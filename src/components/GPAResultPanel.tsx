import type { GpaSummary } from '../lib/gpa';

type GPAResultPanelProps = {
  title: string;
  summary: GpaSummary;
  helper: string;
  capAtFour?: boolean;
};

export function GPAResultPanel({
  title,
  summary,
  helper,
  capAtFour = true,
}: GPAResultPanelProps) {
  const visibleGpa = capAtFour ? summary.displayedGpa : summary.rawGpa;

  return (
    <article className="surface-panel p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-400">{helper}</p>
        </div>
        <p className="rounded-lg bg-emerald-200 px-3 py-2 text-2xl font-semibold text-[#101513]">
          {visibleGpa.toFixed(2)}
        </p>
      </div>

      <details className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4">
        <summary className="cursor-pointer text-sm font-medium text-zinc-200">
          Advanced details
        </summary>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <p className="text-zinc-500">Raw calculated GPA</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {summary.rawGpa.toFixed(3)}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">Quality points</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {summary.qualityPoints.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">Graded credits</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {summary.gradedCredits.toFixed(2)}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {capAtFour
            ? 'Displayed cumulative GPA is capped at 4.00. '
            : 'Semester GPA is shown from the raw calculated grade points. '}
          Non-GPA grades W, P, X, Y, and I do not add graded credits or quality
          points.
        </p>
      </details>
    </article>
  );
}
