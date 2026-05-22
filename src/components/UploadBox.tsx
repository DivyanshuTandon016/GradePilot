import { FileUp, ShieldCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import { parseTranscriptPdf } from '../lib/pdf';
import type { CompletedCourse } from '../types';

type UploadBoxProps = {
  onCoursesImported: (courses: CompletedCourse[]) => void;
};

export function UploadBox({ onCoursesImported }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const importFile = async (file?: File) => {
    if (!file) {
      return;
    }

    try {
      setIsParsing(true);
      const parsed = await parseTranscriptPdf(file);
      setErrors(parsed.errors);

      if (parsed.courses.length > 0) {
        onCoursesImported(parsed.courses);
        setMessage(
          `${parsed.courses.length} completed course${
            parsed.courses.length === 1 ? '' : 's'
          } imported from ${file.name}.`,
        );
      } else {
        setMessage('');
      }
    } catch {
      setErrors([
        'The PDF could not be read. Try another transcript PDF or add courses manually.',
      ]);
      setMessage('');
    } finally {
      setIsParsing(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <section className="surface-panel p-5" id="transcript-upload">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-emerald-100">
            <FileUp className="size-5" aria-hidden="true" />
            <h2 className="panel-title">Transcript Upload</h2>
          </div>
          <p className="panel-copy">
            Upload a selectable-text PDF transcript and GradePilot will look for
            completed course rows, credits, terms, and grades.
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-zinc-400">
            <ShieldCheck
              className="mt-1 size-4 shrink-0 text-emerald-200"
              aria-hidden="true"
            />
            PDF parsing stays in your browser. Scanned PDFs or school-specific
            layouts may still need manual course entry.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={(event) => importFile(event.target.files?.[0])}
            ref={inputRef}
            type="file"
          />
          <button
            className="action-button justify-center"
            disabled={isParsing}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            <FileUp className="size-4" aria-hidden="true" />
            {isParsing ? 'Reading PDF...' : 'Upload PDF'}
          </button>
          <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs leading-5 text-zinc-400">
            Review imported rows before relying on a forecast.
          </p>
        </div>
      </div>

      {message ? (
        <p className="mt-4 rounded-lg border border-emerald-200/20 bg-emerald-200/10 px-3 py-2 text-sm text-emerald-50">
          {message}
        </p>
      ) : null}

      {errors.length > 0 ? (
        <div className="mt-4 rounded-lg border border-rose-300/20 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
