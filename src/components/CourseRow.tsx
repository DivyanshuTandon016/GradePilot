import { Trash2 } from 'lucide-react';
import {
  GPA_GRADES,
  NON_GPA_GRADES,
  type CompletedCourse,
  type CurrentCourse,
  type Grade,
  type GradeScaleBand,
} from '../types';
import {
  estimateLetterGrade,
  gradePointFor,
  qualityPointsFor,
} from '../lib/gpa';

type CompletedCourseRowProps = {
  mode: 'completed';
  course: CompletedCourse;
  errors: string[];
  onChange: (course: CompletedCourse) => void;
  onRemove: () => void;
};

type CurrentCourseRowProps = {
  mode: 'current';
  course: CurrentCourse;
  errors: string[];
  percentageScale: GradeScaleBand[];
  onChange: (course: CurrentCourse) => void;
  onRemove: () => void;
};

type CourseRowProps = CompletedCourseRowProps | CurrentCourseRowProps;

const toNumber = (value: string) => (value === '' ? 0 : Number(value));

const ErrorRow = ({
  errors,
  columns,
}: {
  errors: string[];
  columns: number;
}) =>
  errors.length > 0 ? (
    <tr>
      <td className="px-3 pb-3 pt-0" colSpan={columns}>
        <p className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">
          {errors.join(' ')}
        </p>
      </td>
    </tr>
  ) : null;

export function CourseRow(props: CourseRowProps) {
  if (props.mode === 'completed') {
    const { course, errors, onChange, onRemove } = props;
    const gradePoint = gradePointFor(course.grade);
    const qualityPoints = qualityPointsFor(course.credits, course.grade);

    return (
      <>
        <tr className="align-top">
          <td className="table-cell">
            <input
              aria-label="Completed course name"
              className="field min-w-40"
              onChange={(event) => onChange({ ...course, name: event.target.value })}
              placeholder="CSE 310"
              value={course.name}
            />
          </td>
          <td className="table-cell">
            <input
              aria-label="Completed course semester"
              className="field min-w-36"
              onChange={(event) =>
                onChange({ ...course, semester: event.target.value })
              }
              placeholder="Fall 2025"
              value={course.semester}
            />
          </td>
          <td className="table-cell">
            <input
              aria-label="Completed course credits"
              className="field w-24"
              min="0"
              onChange={(event) =>
                onChange({ ...course, credits: toNumber(event.target.value) })
              }
              step="0.5"
              type="number"
              value={course.credits}
            />
          </td>
          <td className="table-cell">
            <select
              aria-label="Completed course grade"
              className="field min-w-24"
              onChange={(event) =>
                onChange({ ...course, grade: event.target.value as Grade })
              }
              value={course.grade}
            >
              {[...GPA_GRADES, ...NON_GPA_GRADES].map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </td>
          <td className="table-cell metric-cell">
            {gradePoint === null ? 'Excluded' : gradePoint.toFixed(2)}
          </td>
          <td className="table-cell metric-cell">
            {qualityPoints === null ? 'Excluded' : qualityPoints.toFixed(2)}
          </td>
          <td className="table-cell">
            <button
              aria-label={`Remove ${course.name || 'completed course'}`}
              className="icon-button"
              onClick={onRemove}
              title="Remove course"
              type="button"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </td>
        </tr>
        <ErrorRow columns={7} errors={errors} />
      </>
    );
  }

  const { course, errors, percentageScale, onChange, onRemove } = props;
  const estimatedGrade = estimateLetterGrade(course.percentage, percentageScale);
  const gradePoint = estimatedGrade ? gradePointFor(estimatedGrade) : null;
  const qualityPoints = estimatedGrade
    ? qualityPointsFor(course.credits, estimatedGrade)
    : null;

  return (
    <>
      <tr className="align-top">
        <td className="table-cell">
          <input
            aria-label="Current course name"
            className="field min-w-40"
            onChange={(event) => onChange({ ...course, name: event.target.value })}
            placeholder="MAT 343"
            value={course.name}
          />
        </td>
        <td className="table-cell">
          <input
            aria-label="Current course credits"
            className="field w-24"
            min="0"
            onChange={(event) =>
              onChange({ ...course, credits: toNumber(event.target.value) })
            }
            step="0.5"
            type="number"
            value={course.credits}
          />
        </td>
        <td className="table-cell">
          <div className="flex min-w-32 items-center gap-2">
            <input
              aria-label="Current or assumed percentage"
              className="field w-24"
              max="100"
              min="0"
              onChange={(event) =>
                onChange({ ...course, percentage: toNumber(event.target.value) })
              }
              step="0.1"
              type="number"
              value={course.percentage}
            />
            <span className="text-sm text-zinc-500">%</span>
          </div>
        </td>
        <td className="table-cell metric-cell">{estimatedGrade ?? '--'}</td>
        <td className="table-cell metric-cell">
          {gradePoint === null ? '--' : gradePoint.toFixed(2)}
        </td>
        <td className="table-cell metric-cell">
          {qualityPoints === null ? '--' : qualityPoints.toFixed(2)}
        </td>
        <td className="table-cell">
          <button
            aria-label={`Remove ${course.name || 'current course'}`}
            className="icon-button"
            onClick={onRemove}
            title="Remove course"
            type="button"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </td>
      </tr>
      <ErrorRow columns={7} errors={errors} />
    </>
  );
}
