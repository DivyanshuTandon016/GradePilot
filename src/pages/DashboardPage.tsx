import {
  BookOpenCheck,
  Eraser,
  Gauge,
  Save,
  Sigma,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { CourseTable } from '../components/CourseTable';
import { GPAResultPanel } from '../components/GPAResultPanel';
import { GradeScaleEditor } from '../components/GradeScaleEditor';
import { SummaryCard } from '../components/SummaryCard';
import { UploadBox } from '../components/UploadBox';
import { WhatIfCalculator } from '../components/WhatIfCalculator';
import {
  summarizeCompletedCourses,
  summarizeCurrentCourses,
  summarizeProjectedCourses,
  summarizeSemesterGpas,
  validateCompletedCourse,
  validateCurrentCourse,
} from '../lib/gpa';
import type { GradePilotData } from '../types';

type DashboardPageProps = {
  data: GradePilotData;
  onChange: (data: GradePilotData) => void;
  onClear: () => void;
  onSave: () => void;
};

export function DashboardPage({
  data,
  onChange,
  onClear,
  onSave,
}: DashboardPageProps) {
  const [status, setStatus] = useState('');
  const completedSummary = summarizeCompletedCourses(data.completedCourses);
  const currentSummary = summarizeCurrentCourses(
    data.currentCourses,
    data.percentageScale,
  );
  const projectedSummary = summarizeProjectedCourses(
    data.completedCourses,
    data.currentCourses,
    data.percentageScale,
  );
  const semesterSummaries = summarizeSemesterGpas(data.completedCourses);
  const validationCount = useMemo(
    () =>
      [
        ...data.completedCourses.flatMap(validateCompletedCourse),
        ...data.currentCourses.flatMap(validateCurrentCourse),
      ].length,
    [data.completedCourses, data.currentCourses],
  );

  const updateData = (nextData: Partial<GradePilotData>) =>
    onChange({ ...data, ...nextData });

  const save = () => {
    onSave();
    setStatus('Saved locally in this browser.');
  };

  const clear = () => {
    if (window.confirm('Clear all GradePilot course data from this browser?')) {
      onClear();
      setStatus('All local course data cleared.');
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-100">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            GPA forecast workspace
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            GPA uses total quality points divided by total graded credits. Current
            semester projections update as you change percentages or scenarios.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="action-button" onClick={save} type="button">
            <Save className="size-4" aria-hidden="true" />
            Save
          </button>
          <button className="ghost-button" onClick={clear} type="button">
            <Eraser className="size-4" aria-hidden="true" />
            Clear All Data
          </button>
        </div>
      </section>

      {status || validationCount > 0 ? (
        <section className="grid gap-3 lg:grid-cols-2">
          {status ? (
            <p className="rounded-lg border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-50">
              {status}
            </p>
          ) : null}
          {validationCount > 0 ? (
            <p className="rounded-lg border border-amber-200/20 bg-amber-200/10 px-4 py-3 text-sm text-amber-50">
              Fix {validationCount} course field issue
              {validationCount === 1 ? '' : 's'} for a reliable forecast.
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          helper="Your completed graded history before the current semester."
          icon={<BookOpenCheck className="size-5 text-emerald-100" aria-hidden="true" />}
          label="Completed GPA"
          tone="emerald"
          value={completedSummary.displayedGpa.toFixed(2)}
        />
        <SummaryCard
          helper="Projected from current percentages and the grade scale."
          icon={<Gauge className="size-5 text-cyan-100" aria-hidden="true" />}
          label="Current Semester GPA"
          tone="cyan"
          value={currentSummary.rawGpa.toFixed(2)}
        />
        <SummaryCard
          helper="Completed courses plus current semester projection."
          icon={<TrendingUp className="size-5 text-rose-100" aria-hidden="true" />}
          label="Projected Cumulative GPA"
          tone="coral"
          value={projectedSummary.displayedGpa.toFixed(2)}
        />
        <SummaryCard
          helper="Graded credits currently counted in the projection."
          icon={<Sigma className="size-5 text-amber-100" aria-hidden="true" />}
          label="Total Graded Credits"
          tone="gold"
          value={projectedSummary.gradedCredits.toFixed(2)}
        />
      </section>

      <UploadBox
        onCoursesImported={(courses) =>
          updateData({ completedCourses: [...data.completedCourses, ...courses] })
        }
      />

      <div className="grid gap-6">
        <CourseTable
          courses={data.completedCourses}
          mode="completed"
          onChange={(completedCourses) => updateData({ completedCourses })}
        />
        <CourseTable
          courses={data.currentCourses}
          mode="current"
          onChange={(currentCourses) => updateData({ currentCourses })}
          percentageScale={data.percentageScale}
        />
      </div>

      <WhatIfCalculator
        completedCourses={data.completedCourses}
        currentCourses={data.currentCourses}
        percentageScale={data.percentageScale}
      />

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <GPAResultPanel
            helper="Completed cumulative GPA before current semester assumptions are included."
            summary={completedSummary}
            title="Completed GPA Summary"
          />
          <GPAResultPanel
            helper="Projected cumulative GPA after the current semester percentages are estimated into grades."
            summary={projectedSummary}
            title="Projected GPA Summary"
          />
        </div>

        <section className="surface-panel p-5">
          <div className="flex items-center gap-2 text-cyan-100">
            <TrendingUp className="size-5" aria-hidden="true" />
            <h2 className="panel-title">GPA Trend</h2>
          </div>
          <p className="panel-copy mt-2">
            Semester summaries from completed courses show where your cumulative
            forecast starts.
          </p>

          <div className="mt-5 space-y-3">
            {semesterSummaries.length === 0 ? (
              <p className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
                Semester GPA summaries appear after completed courses are entered.
              </p>
            ) : (
              semesterSummaries.map((semester) => (
                <article
                  className="rounded-lg border border-white/10 bg-black/20 p-4"
                  key={semester.semester}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-white">{semester.semester}</h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        {semester.courseCount} course
                        {semester.courseCount === 1 ? '' : 's'} /{' '}
                        {semester.gradedCredits.toFixed(2)} graded credits
                      </p>
                    </div>
                    <p className="text-2xl font-semibold text-white">
                      {semester.rawGpa.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-200 via-cyan-200 to-rose-200"
                      style={{
                        width: `${Math.max(
                          4,
                          Math.min((semester.rawGpa / 4.33) * 100, 100),
                        )}%`,
                      }}
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>

      <GradeScaleEditor
        onChange={(percentageScale) => updateData({ percentageScale })}
        percentageScale={data.percentageScale}
      />
    </main>
  );
}
