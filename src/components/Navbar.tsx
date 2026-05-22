import { Calculator, ShieldCheck } from 'lucide-react';

type NavbarProps = {
  page: 'landing' | 'dashboard';
  onNavigate: (page: 'landing' | 'dashboard') => void;
};

export function Navbar({ page, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#111315]/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          className="flex min-w-0 items-center gap-3 text-left"
          onClick={() => onNavigate('landing')}
          type="button"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-300 text-[#101513] shadow-[0_0_24px_rgba(110,231,183,0.25)]">
            <Calculator className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-semibold text-white">
              GradePilot
            </span>
            <span className="block truncate text-xs text-zinc-400">
              Browser-local GPA forecasting
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 sm:flex">
            <ShieldCheck className="size-4 text-emerald-200" aria-hidden="true" />
            Transcript data stays local
          </span>
          <button
            className={page === 'dashboard' ? 'action-button' : 'ghost-button'}
            onClick={() => onNavigate(page === 'dashboard' ? 'landing' : 'dashboard')}
            type="button"
          >
            {page === 'dashboard' ? 'Home' : 'Dashboard'}
          </button>
        </div>
      </nav>
    </header>
  );
}
