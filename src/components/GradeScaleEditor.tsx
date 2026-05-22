import { Settings2 } from 'lucide-react';
import type { GradeScaleBand } from '../types';

type GradeScaleEditorProps = {
  percentageScale: GradeScaleBand[];
  onChange: (percentageScale: GradeScaleBand[]) => void;
};

const scaleHasErrors = (percentageScale: GradeScaleBand[]) =>
  percentageScale.some(
    (band) =>
      !Number.isFinite(band.min) ||
      !Number.isFinite(band.max) ||
      band.min < 0 ||
      band.max > 100 ||
      band.min > band.max,
  );

export function GradeScaleEditor({
  percentageScale,
  onChange,
}: GradeScaleEditorProps) {
  const updateBand = (
    grade: GradeScaleBand['grade'],
    field: 'min' | 'max',
    value: string,
  ) => {
    onChange(
      percentageScale.map((band) =>
        band.grade === grade ? { ...band, [field]: Number(value) } : band,
      ),
    );
  };

  return (
    <details className="surface-panel p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span>
          <span className="flex items-center gap-2 text-lg font-semibold text-white">
            <Settings2 className="size-5 text-cyan-100" aria-hidden="true" />
            Grade Scale Settings
          </span>
          <span className="mt-1 block text-sm leading-6 text-zinc-400">
            Adjust the percentage bands used to estimate current semester letter
            grades.
          </span>
        </span>
        <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
          Edit
        </span>
      </summary>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {percentageScale.map((band) => (
          <label
            className="rounded-lg border border-white/10 bg-black/20 p-3"
            key={band.grade}
          >
            <span className="block text-sm font-semibold text-white">
              {band.grade}
            </span>
            <span className="mt-3 flex items-center gap-2">
              <input
                aria-label={`${band.grade} minimum percentage`}
                className="field w-full"
                max="100"
                min="0"
                onChange={(event) =>
                  updateBand(band.grade, 'min', event.target.value)
                }
                type="number"
                value={band.min}
              />
              <span className="text-zinc-500">to</span>
              <input
                aria-label={`${band.grade} maximum percentage`}
                className="field w-full"
                max="100"
                min="0"
                onChange={(event) =>
                  updateBand(band.grade, 'max', event.target.value)
                }
                type="number"
                value={band.max}
              />
            </span>
          </label>
        ))}
      </div>

      {scaleHasErrors(percentageScale) ? (
        <p className="mt-4 rounded-lg border border-rose-300/20 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">
          Each percentage range must stay between 0 and 100 with the minimum no
          higher than the maximum.
        </p>
      ) : (
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          Bands are applied from the highest minimum percentage downward.
        </p>
      )}
    </details>
  );
}
