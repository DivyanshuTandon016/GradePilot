import {
  ArrowRight,
  FileUp,
  Layers3,
  LineChart,
  Table2,
  WandSparkles,
} from 'lucide-react';

type LandingPageProps = {
  onStart: () => void;
  onUpload: () => void;
};

const features = [
  {
    icon: FileUp,
    title: 'Upload previous grades',
    copy: 'Read selectable-text PDF transcripts without sending them to a server.',
  },
  {
    icon: Table2,
    title: 'Predict semester GPA',
    copy: 'Turn current course percentages into expected letter grades and points.',
  },
  {
    icon: LineChart,
    title: 'Forecast cumulative GPA',
    copy: 'See how current credits change your next cumulative result.',
  },
  {
    icon: WandSparkles,
    title: 'Run what-if scenarios',
    copy: 'Swap expected grades instantly before deciding what needs attention.',
  },
];

export function LandingPage({ onStart, onUpload }: LandingPageProps) {
  return (
    <main>
      <section className="relative isolate min-h-[70svh] overflow-hidden border-b border-white/10">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
          src="/hero-gradepilot.png"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,14,15,0.98)_0%,rgba(12,14,15,0.9)_38%,rgba(12,14,15,0.2)_72%,rgba(12,14,15,0.72)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#111315] to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[70svh] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-lg border border-emerald-100/20 bg-emerald-100/10 px-3 py-2 text-sm text-emerald-50">
              <Layers3 className="size-4" aria-hidden="true" />
              Private GPA forecasting for college students
            </p>
            <h1 className="max-w-xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              GradePilot
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-200">
              Upload past grades, model your current semester, and understand the
              credits and quality points behind every projected GPA number.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="action-button px-5 py-3" onClick={onStart} type="button">
                Start Calculating
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
              <button className="ghost-button px-5 py-3" onClick={onUpload} type="button">
                <FileUp className="size-4" aria-hidden="true" />
                Upload Transcript
              </button>
            </div>
            <p className="mt-6 text-sm leading-6 text-zinc-400">
              First version data lives in browser localStorage. No login and no
              database required.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {features.map(({ icon: Icon, title, copy }) => (
          <article className="surface-panel p-5" key={title}>
            <span className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-cyan-100">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
