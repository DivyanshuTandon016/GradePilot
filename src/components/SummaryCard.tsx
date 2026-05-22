import type { ReactNode } from 'react';

type SummaryCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
  tone?: 'emerald' | 'cyan' | 'coral' | 'gold';
};

const tones = {
  emerald: 'from-emerald-300/20 to-emerald-300/0 text-emerald-100',
  cyan: 'from-cyan-300/20 to-cyan-300/0 text-cyan-100',
  coral: 'from-rose-300/20 to-rose-300/0 text-rose-100',
  gold: 'from-amber-200/20 to-amber-200/0 text-amber-100',
};

export function SummaryCard({
  label,
  value,
  helper,
  icon,
  tone = 'emerald',
}: SummaryCardProps) {
  return (
    <article className="surface-panel relative min-h-40 overflow-hidden p-5">
      <div
        className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${tones[tone]}`}
        aria-hidden="true"
      />
      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-zinc-300">{label}</p>
          <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-black/20">
            {icon}
          </span>
        </div>
        <div>
          <p className="text-4xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{helper}</p>
        </div>
      </div>
    </article>
  );
}
