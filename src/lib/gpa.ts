import { DEFAULT_PERCENTAGE_SCALE } from '../data/defaults';
import {
  GPA_GRADES,
  NON_GPA_GRADES,
  type CompletedCourse,
  type CurrentCourse,
  type Grade,
  type GradeScaleBand,
  type GpaGrade,
} from '../types';

export const GRADE_POINTS: Record<GpaGrade, number> = {
  'A+': 4.33,
  A: 4,
  'A-': 3.67,
  'B+': 3.33,
  B: 3,
  'B-': 2.67,
  'C+': 2.33,
  C: 2,
  D: 1,
  'E/F': 0,
};

export type GpaSummary = {
  rawGpa: number;
  displayedGpa: number;
  gradedCredits: number;
  qualityPoints: number;
};

type WeightedGrade = {
  credits: number;
  grade: Grade;
};

const round = (value: number, places = 2) =>
  Number.isFinite(value) ? Number(value.toFixed(places)) : 0;

export const isPositiveNumber = (value: number) =>
  Number.isFinite(value) && value > 0;

export const isPercentage = (value: number) =>
  Number.isFinite(value) && value >= 0 && value <= 100;

export const isGpaGrade = (grade: string): grade is GpaGrade =>
  GPA_GRADES.includes(grade as GpaGrade);

export const isNonGpaGrade = (grade: string): grade is Grade =>
  NON_GPA_GRADES.includes(grade as (typeof NON_GPA_GRADES)[number]);

export const normalizeGrade = (grade: string): Grade | null => {
  const normalized = grade.trim().toUpperCase().replace(/\s+/g, '');

  if (normalized === 'F' || normalized === 'E' || normalized === 'E/F') {
    return 'E/F';
  }

  if (isGpaGrade(normalized) || isNonGpaGrade(normalized)) {
    return normalized;
  }

  return null;
};

export const gradePointFor = (grade: Grade) =>
  isGpaGrade(grade) ? GRADE_POINTS[grade] : null;

export const qualityPointsFor = (credits: number, grade: Grade) => {
  const gradePoint = gradePointFor(grade);

  if (!isPositiveNumber(credits) || gradePoint === null) {
    return null;
  }

  return round(credits * gradePoint);
};

export const estimateLetterGrade = (
  percentage: number,
  percentageScale: GradeScaleBand[] = DEFAULT_PERCENTAGE_SCALE,
) => {
  if (!isPercentage(percentage)) {
    return null;
  }

  const band = [...percentageScale]
    .sort((left, right) => right.min - left.min)
    .find(({ min, max }) => percentage >= min && percentage <= max);

  return band?.grade ?? 'E/F';
};

const summarizeWeightedGrades = (courses: WeightedGrade[]): GpaSummary => {
  const totals = courses.reduce(
    (summary, course) => {
      const points = qualityPointsFor(course.credits, course.grade);

      if (points === null) {
        return summary;
      }

      return {
        gradedCredits: summary.gradedCredits + course.credits,
        qualityPoints: summary.qualityPoints + points,
      };
    },
    { gradedCredits: 0, qualityPoints: 0 },
  );

  const rawGpa =
    totals.gradedCredits === 0 ? 0 : totals.qualityPoints / totals.gradedCredits;

  return {
    rawGpa: round(rawGpa, 3),
    displayedGpa: round(Math.min(rawGpa, 4), 3),
    gradedCredits: round(totals.gradedCredits),
    qualityPoints: round(totals.qualityPoints),
  };
};

export const summarizeCompletedCourses = (courses: CompletedCourse[]) =>
  summarizeWeightedGrades(courses);

export const summarizeCurrentCourses = (
  courses: CurrentCourse[],
  percentageScale: GradeScaleBand[],
) =>
  summarizeWeightedGrades(
    courses.flatMap((course) => {
      const grade = estimateLetterGrade(course.percentage, percentageScale);
      return grade ? [{ credits: course.credits, grade }] : [];
    }),
  );

export const summarizeProjectedCourses = (
  completedCourses: CompletedCourse[],
  currentCourses: CurrentCourse[],
  percentageScale: GradeScaleBand[],
) =>
  summarizeWeightedGrades([
    ...completedCourses,
    ...currentCourses.flatMap((course) => {
      const grade = estimateLetterGrade(course.percentage, percentageScale);
      return grade ? [{ credits: course.credits, grade }] : [];
    }),
  ]);

export const summarizeScenario = (
  completedCourses: CompletedCourse[],
  currentCourses: CurrentCourse[],
  scenarioGrades: Record<string, GpaGrade>,
) =>
  summarizeWeightedGrades([
    ...completedCourses,
    ...currentCourses.flatMap((course) => {
      const grade = scenarioGrades[course.id];
      return grade ? [{ credits: course.credits, grade }] : [];
    }),
  ]);

export const summarizeSemesterGpas = (courses: CompletedCourse[]) => {
  const semesters = new Map<string, CompletedCourse[]>();

  courses.forEach((course) => {
    const label = course.semester.trim() || 'Unassigned semester';
    semesters.set(label, [...(semesters.get(label) ?? []), course]);
  });

  return [...semesters.entries()].map(([semester, semesterCourses]) => ({
    semester,
    courseCount: semesterCourses.length,
    ...summarizeCompletedCourses(semesterCourses),
  }));
};

export const validateCompletedCourse = (course: CompletedCourse) => {
  const errors: string[] = [];

  if (!course.name.trim()) {
    errors.push('Add a course name.');
  }

  if (!course.semester.trim()) {
    errors.push('Add a semester.');
  }

  if (!isPositiveNumber(course.credits)) {
    errors.push('Credits must be a positive number.');
  }

  if (!normalizeGrade(course.grade)) {
    errors.push('Choose a valid grade.');
  }

  return errors;
};

export const validateCurrentCourse = (course: CurrentCourse) => {
  const errors: string[] = [];

  if (!course.name.trim()) {
    errors.push('Add a course name.');
  }

  if (!isPositiveNumber(course.credits)) {
    errors.push('Credits must be a positive number.');
  }

  if (!isPercentage(course.percentage)) {
    errors.push('Percentage must be between 0 and 100.');
  }

  return errors;
};
