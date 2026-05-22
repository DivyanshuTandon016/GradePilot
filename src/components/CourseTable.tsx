import { Plus } from 'lucide-react';
import { createCompletedCourse, createCurrentCourse } from '../data/defaults';
import {
  validateCompletedCourse,
  validateCurrentCourse,
} from '../lib/gpa';
import type {
  CompletedCourse,
  CurrentCourse,
  GradeScaleBand,
} from '../types';
import { CourseRow } from './CourseRow';

type CompletedCourseTableProps = {
  mode: 'completed';
  courses: CompletedCourse[];
  onChange: (courses: CompletedCourse[]) => void;
};

type CurrentCourseTableProps = {
  mode: 'current';
  courses: CurrentCourse[];
  percentageScale: GradeScaleBand[];
  onChange: (courses: CurrentCourse[]) => void;
};

type CourseTableProps = CompletedCourseTableProps | CurrentCourseTableProps;

const updateCourse = <Course extends { id: string }>(
  courses: Course[],
  course: Course,
) => courses.map((item) => (item.id === course.id ? course : item));

const removeCourse = <Course extends { id: string }>(
  courses: Course[],
  courseId: string,
) => courses.filter((item) => item.id !== courseId);

export function CourseTable(props: CourseTableProps) {
  const isCompleted = props.mode === 'completed';

  return (
    <section className="surface-panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="panel-title">
            {isCompleted ? 'Completed Courses' : 'Current Semester Courses'}
          </h2>
          <p className="panel-copy">
            {isCompleted
              ? 'Past graded credits build your completed cumulative GPA.'
              : 'Percentages estimate the letter grades used in your projection.'}
          </p>
        </div>
        <button
          className="action-button"
          onClick={() =>
            isCompleted
              ? props.onChange([...props.courses, createCompletedCourse()])
              : props.onChange([...props.courses, createCurrentCourse()])
          }
          type="button"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add Course
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="table-head">Course</th>
              {isCompleted ? <th className="table-head">Semester</th> : null}
              <th className="table-head">Credits</th>
              <th className="table-head">
                {isCompleted ? 'Grade' : 'Assumed %'}
              </th>
              <th className="table-head">
                {isCompleted ? 'Grade Points' : 'Expected Grade'}
              </th>
              <th className="table-head">
                {isCompleted ? 'Quality Points' : 'Grade Points'}
              </th>
              {!isCompleted ? <th className="table-head">Quality Points</th> : null}
              <th className="table-head">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {props.courses.length === 0 ? (
              <tr>
                <td
                  className="px-5 py-8 text-sm text-zinc-400"
                  colSpan={isCompleted ? 7 : 7}
                >
                  {isCompleted
                    ? 'No completed courses yet. Add them manually or upload a transcript PDF.'
                    : 'Add current semester courses to forecast the next GPA outcome.'}
                </td>
              </tr>
            ) : null}

            {isCompleted
              ? props.courses.map((course) => (
                  <CourseRow
                    course={course}
                    errors={validateCompletedCourse(course)}
                    key={course.id}
                    mode="completed"
                    onChange={(nextCourse) =>
                      props.onChange(updateCourse(props.courses, nextCourse))
                    }
                    onRemove={() =>
                      props.onChange(removeCourse(props.courses, course.id))
                    }
                  />
                ))
              : props.courses.map((course) => (
                  <CourseRow
                    course={course}
                    errors={validateCurrentCourse(course)}
                    key={course.id}
                    mode="current"
                    onChange={(nextCourse) =>
                      props.onChange(updateCourse(props.courses, nextCourse))
                    }
                    onRemove={() =>
                      props.onChange(removeCourse(props.courses, course.id))
                    }
                    percentageScale={props.percentageScale}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
