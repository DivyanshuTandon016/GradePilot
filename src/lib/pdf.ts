import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import type {
  TextItem,
  TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api';
import { createId } from '../data/defaults';
import { isPositiveNumber, normalizeGrade } from './gpa';
import type { CompletedCourse, Grade } from '../types';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export type PdfParseResult = {
  courses: CompletedCourse[];
  errors: string[];
};

type LineBucket = {
  y: number;
  items: Array<{ x: number; text: string }>;
};

type TranscriptLine = {
  y: number;
  text: string;
};

const SEMESTER_PATTERN =
  /\b(?:(Spring|Summer|Fall|Winter)\s+(20\d{2})|(20\d{2})\s+(Spring|Summer|Fall|Winter))\b/i;
const GRADE_PATTERN =
  /(?:^|\s)(A\+|A-|A|B\+|B-|B|C\+|C|D|E\/F|E|F|W|P|X|Y|I)(?=\s|$)/i;
const COURSE_CODE_PATTERN = /\b[A-Z]{2,}[A-Z0-9-]*\s*\d{2,}[A-Z0-9-]*\b/;
const NUMBER_PATTERN = /\b\d+(?:\.\d+)?\b/g;

const isTextItem = (
  item: TextItem | TextMarkedContent,
): item is TextItem => 'str' in item;

const normalizeLine = (line: string) =>
  line
    .replace(/\s+/g, ' ')
    .replace(/\s+([,;:])/g, '$1')
    .trim();

const semesterFromLine = (line: string) => {
  const match = line.match(SEMESTER_PATTERN);

  if (!match) {
    return '';
  }

  const season = match[1] ?? match[4];
  const year = match[2] ?? match[3];
  return `${season} ${year}`;
};

const cleanCourseName = (line: string) =>
  normalizeLine(
    line
      .replace(SEMESTER_PATTERN, ' ')
      .replace(GRADE_PATTERN, ' ')
      .replace(/[|]+/g, ' '),
  ).replace(/^[,;:\-]+|[,;:\-]+$/g, '');

const linesForColumn = (items: TextItem[]) => {
  const buckets: LineBucket[] = [];

  items.forEach((item) => {
    const text = normalizeLine(item.str);
    const x = Number(item.transform[4] ?? 0);
    const y = Number(item.transform[5] ?? 0);

    if (!text) {
      return;
    }

    const bucket = buckets.find((line) => Math.abs(line.y - y) < 3);

    if (bucket) {
      bucket.items.push({ x, text });
      return;
    }

    buckets.push({ y, items: [{ x, text }] });
  });

  return buckets
    .sort((left, right) => right.y - left.y)
    .map((line) => ({
      y: line.y,
      text: normalizeLine(
        line.items
          .sort((left, right) => left.x - right.x)
          .map((item) => item.text)
          .join(' '),
      ),
    }))
    .filter((line) => Boolean(line.text));
};

const pageColumnsFromItems = (items: TextItem[], pageWidth: number) => {
  const columns = [[], []] as TextItem[][];
  const pageMidpoint = pageWidth / 2;

  items.forEach((item) => {
    const x = Number(item.transform[4] ?? 0);
    columns[x < pageMidpoint ? 0 : 1].push(item);
  });

  return columns.map(linesForColumn).filter((column) => column.length > 0);
};

const creditMatchFor = (line: string) =>
  [...line.matchAll(NUMBER_PATTERN)].find((match) => {
    const value = Number(match[0]);
    return isPositiveNumber(value) && value <= 6;
  });

const removeMatch = (line: string, match: RegExpMatchArray) => {
  const index = match.index ?? -1;

  if (index < 0) {
    return line;
  }

  return `${line.slice(0, index)} ${line.slice(index + match[0].length)}`;
};

const parseCourseLine = (
  line: string,
  fallbackSemester: string,
): CompletedCourse | null => {
  const normalized = normalizeLine(line);
  const semester = semesterFromLine(normalized) || fallbackSemester;
  const gradeMatch = normalized.match(GRADE_PATTERN);
  const grade = gradeMatch ? normalizeGrade(gradeMatch[1]) : null;
  const creditMatch = creditMatchFor(normalized);
  const credits = creditMatch ? Number(creditMatch[0]) : 0;
  const hasCourseCode = COURSE_CODE_PATTERN.test(normalized.toUpperCase());

  if (!semester || !grade || !creditMatch || !hasCourseCode) {
    return null;
  }

  const name = cleanCourseName(removeMatch(normalized, creditMatch));

  if (!name || !isPositiveNumber(credits)) {
    return null;
  }

  return {
    id: createId(),
    name,
    semester,
    credits,
    grade: grade as Grade,
  };
};

const dedupeCourses = (courses: CompletedCourse[]) => {
  const unique = new Map<string, CompletedCourse>();

  courses.forEach((course) => {
    const key = [
      course.name.toLowerCase(),
      course.semester.toLowerCase(),
      course.credits,
      course.grade,
    ].join('|');

    if (!unique.has(key)) {
      unique.set(key, course);
    }
  });

  return [...unique.values()];
};

export const parseTranscriptPdf = async (file: File): Promise<PdfParseResult> => {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return {
      courses: [],
      errors: ['Upload a PDF transcript file.'],
    };
  }

  const document = await getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  }).promise;
  const pages: TranscriptLine[][] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const textItems = textContent.items.filter(isTextItem);
    pages.push(
      ...pageColumnsFromItems(
        textItems,
        page.getViewport({ scale: 1 }).width,
      ),
    );
  }

  if (pages.length === 0) {
    return {
      courses: [],
      errors: [
        'This PDF has no selectable transcript text. Scanned PDFs need OCR before GradePilot can read them.',
      ],
    };
  }

  const courses = pages.flatMap((lines) => {
    let currentSemester = '';
    const columnCourses: CompletedCourse[] = [];

    lines.forEach((line) => {
      currentSemester = semesterFromLine(line.text) || currentSemester;

      if (/Repeat\s*-\s*Excluded/i.test(line.text)) {
        columnCourses.pop();
        return;
      }

      const course = parseCourseLine(line.text, currentSemester);

      if (course) {
        columnCourses.push(course);
      }
    });

    return columnCourses;
  });
  const uniqueCourses = dedupeCourses(courses);

  if (uniqueCourses.length === 0) {
    return {
      courses: [],
      errors: [
        'GradePilot read the PDF text but could not identify course rows. This transcript layout may need a school-specific parser.',
      ],
    };
  }

  return {
    courses: uniqueCourses,
    errors: [],
  };
};
