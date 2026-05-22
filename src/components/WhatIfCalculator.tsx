import { RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  estimateLetterGrade,
  summarizeScenario,
} from '../lib/gpa';
import {
  GPA_GRADES,
  type CompletedCourse,
  type CurrentCourse,
  type GradeScaleBand,
  type GpaGrade,
} from '../types';
import { GPAResultPanel } from './GPAResultPanel';

type WhatIfCalculatorProps = {
  completedCourses: CompletedCourse[];
  currentCourses: CurrentCourse[];
  percentageScale: GradeScaleBand[];
};

const projectedGradeMap = (
  currentCourses: CurrentCourse[],
  percentageScale: GradeScaleBand[],
) =>
  Object.fromEntries(
    currentCourses.flatMap((course) => {
      const grade = estimateLetterGrade(course.percentage, percentageScale);
      return grade ? [[course.id, grade]] : [];
    }),
  ) as Record<string, GpaGrade>;

export function WhatIfCalculator({
  completedCourses,
  currentCourses,
  percentageScale,
}: WhatIfCalculatorProps) {
  const baselineGrades = useMemo(
    () => projectedGradeMap(currentCourses, percentageScale),
    [currentCourses, percentageScale],
  );
  const [scenarioGrades, setScenarioGrades] =
    useState<Record<string, GpaGrade>>(baselineGrades);

  useEffect(() => {
    setScenarioGrades((grades) => ({
      ...baselineGrades,
      ...Object.fromEntries(
        Object.entries(grades).filter(([courseId]) =>
          currentCourses.some((course) => course.id === courseId),
        ),
      ),
    }));
  }, [baselineGrades, currentCourses]);

  const scenarioSemester = summarizeScenario([], currentCourses, scenarioGrades);
  const scenarioCumulative = summarizeScenario(
    completedCourses,
    currentCourses,
    scenarioGrades,
  );

  return (
    <section className="space-y-4">
      <div className="surface-panel p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-100">
              <Sparkles className="size-5" aria-hidden="true" />
              <h2 className="panel-title">What-If Calculator</h2>
            </div>
            <p className="panel-copy mt-2 max-w-2xl">
              Duplicate the current semester assumptions and test different final
              grades. Changes here do not overwrite your percentage estimates.
            </p>
          </div>
          <button
            className="ghost-button"
            onClick={() => setScenarioGrades(baselineGrades)}
            type="button"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset Scenario
          </button>
        </div>

        {currentCourses.length === 0 ? (
          <p className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
            Add current semester courses first, then test grades here.
          </p>
        ) : (
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {currentCourses.map((course) => (
              <label
                className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                key={course.id}
              >
                <span>
                  <span className="block font-medium text-white">
                    {course.name || 'Untitled current course'}
                  </span>
                  <span className="mt-1 block text-sm text-zinc-400">
                    {course.credits || 0} credits
                  </span>
                </span>
                <select
                  aria-label={`What-if grade for ${course.name || 'current course'}`}
                  className="field min-w-28"
                  onChange={(event) =>
                    setScenarioGrades((grades) => ({
                      ...grades,
                      [course.id]: event.target.value as GpaGrade,
                    }))
                  }
                  value={scenarioGrades[course.id] ?? 'E/F'}
                >
                  {GPA_GRADES.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <GPAResultPanel
          capAtFour={false}
          helper="The current semester GPA produced only by the what-if letter grades."
          summary={scenarioSemester}
          title="What-If Semester GPA"
        />
        <GPAResultPanel
          helper="Completed history plus this what-if version of your current semester."
          summary={scenarioCumulative}
          title="What-If Cumulative GPA"
        />
      </div>
    </section>
  );
}
