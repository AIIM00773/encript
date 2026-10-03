import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { Check, Copy, FileKey2, Lock, UploadCloud, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const MAX_FILE_MB = 100; // placeholder: set to your real upload limit

const expiryOptions = [
  { value: "1h", label: "1 hour" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
];

const limitOptions = [
  { value: 1, label: "One-time" },
  { value: 3, label: "3 downloads" },
  { value: 10, label: "10 downloads" },
];

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A12]";

const card = "rounded-2xl border border-white/[0.08] bg-white/[0.025]";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

/**
 * Placeholder for the real work:
 * 1. encrypt the file in the browser (WebCrypto AES-256-GCM)
 * 2. upload the ciphertext and the access rules
 * 3. return the share link (key stays in the URL fragment, never sent to the server)
 */
async function createHandoff(onProgress: (pct: number) => void): Promise<string> {
  for (let pct = 0; pct <= 100; pct += 10) {
    onProgress(pct);
    await new Promise((r) => setTimeout(r, 140));
  }
  const id = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `https://encript.app/h/${id}`;
}

/* ------------------------------------------------------------------ */
/* Small controls                                                      */
/* ------------------------------------------------------------------ */

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full border border-white/10 p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${focus} ${
              active ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${focus} ${
        checked ? "bg-indigo-500" : "bg-white/15"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function CreateNewHandoff() {
  const inputRef = useRef<HTMLInputElement>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [email, setEmail] = useState("");
  const [verify, setVerify] = useState(true);
  const [expiry, setExpiry] = useState("24h");
  const [limit, setLimit] = useState(1);

  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "encrypting" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const emailRequired = verify;
  const emailInvalid = email.trim() !== "" && !emailPattern.test(email.trim());
  const emailMissing = emailRequired && email.trim() === "";
  const showEmailError = submitted && (emailInvalid || emailMissing);

  const pick = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setFile(null);
      setFileError(`This file is larger than ${MAX_FILE_MB} MB. Compress it or split it into parts.`);
      return;
    }
    setFileError(null);
    setFile(f);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!file) {
      setFileError("Choose a file to share.");
      return;
    }
    if (emailMissing || emailInvalid) return;

    setStatus("encrypting");
    setProgress(0);
    const url = await createHandoff((p) => mounted.current && setProgress(p));
    if (!mounted.current) return;
    setLink(url);
    setStatus("done");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => mounted.current && setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the link is still selectable in the field.
    }
  };

  const reset = () => {
    setFile(null);
    setFileError(null);
    setEmail("");
    setVerify(true);
    setExpiry("24h");
    setLimit(1);
    setSubmitted(false);
    setStatus("idle");
    setProgress(0);
    setLink("");
    setCopied(false);
  };

  /* ---------------------------- Done ---------------------------- */
  if (status === "done" && file) {
    const summary = [
      ["File", file.name],
      ["Expires after", expiryOptions.find((o) => o.value === expiry)?.label],
      ["Downloads", limitOptions.find((o) => o.value === limit)?.label],
      ["Recipient", verify ? `Must verify (${email.trim()})` : email.trim() || "Anyone with the link"],
    ];

    return (
      <section aria-label="Handoff created" className={`mx-auto max-w-2xl p-6 sm:p-8 ${card}`}>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
          <Check size={20} strokeWidth={2.4} />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-white">Your link is ready</h2>
        <p className="mt-1 text-sm text-slate-400">The file was encrypted on this device before it was uploaded.</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={link}
            aria-label="Share link"
            onFocus={(e) => e.currentTarget.select()}
            className={`min-w-0 flex-1 rounded-full border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-slate-200 ${focus}`}
          />
          <button
            type="button"
            onClick={copy}
            className={`inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 ${focus}`}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        <dl className="mt-6 divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] text-sm">
          {summary.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-slate-500">{k}</dt>
              <dd className="min-w-0 truncate text-right text-slate-200">{v}</dd>
            </div>
          ))}
        </dl>

        {!verify && (
          <p className="mt-4 text-sm text-amber-300">
            Verification is off, so anyone who gets this link can open it until it expires or is used up.
          </p>
        )}

        <button
          type="button"
          onClick={reset}
          className={`mt-6 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05] ${focus}`}
        >
          Create another
        </button>
      </section>
    );
  }

  /* ---------------------------- Form ---------------------------- */
  const busy = status === "encrypting";

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Create a new handoff" className="mx-auto max-w-2xl space-y-5">
      {/* 1. File */}
      <fieldset disabled={busy} className={`p-6 ${card}`}>
        <legend className="sr-only">File</legend>
        <h2 className="text-base font-semibold text-white">File</h2>
        <p className="mt-0.5 text-sm text-slate-500">It is encrypted on this device before upload. Up to {MAX_FILE_MB} MB.</p>

        <input ref={inputRef} type="file" className="sr-only" tabIndex={-1} onChange={(e) => pick(e.target.files)} />

        {file ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
              <FileKey2 size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">{file.name}</p>
              <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              aria-label="Remove file"
              className={`flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/5 hover:text-white ${focus}`}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`mt-4 flex flex-col items-center rounded-xl border border-dashed px-6 py-10 text-center transition-colors ${
              dragging ? "border-indigo-400 bg-indigo-500/10" : "border-white/15"
            }`}
          >
            <UploadCloud size={22} className="text-slate-400" />
            <p className="mt-3 text-sm text-slate-300">Drag a file here, or</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={`mt-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/[0.05] ${focus}`}
            >
              Browse files
            </button>
          </div>
        )}

        {fileError && (
          <p role="alert" className="mt-3 text-sm text-red-300">
            {fileError}
          </p>
        )}
      </fieldset>

      {/* 2. Recipient */}
      <fieldset disabled={busy} className={`p-6 ${card}`}>
        <legend className="sr-only">Recipient</legend>
        <h2 className="text-base font-semibold text-white">Recipient</h2>

        <label htmlFor="recipient-email" className="mt-4 block text-sm text-slate-300">
          Email {emailRequired ? "" : <span className="text-slate-500">(optional)</span>}
        </label>
        <input
          id="recipient-email"
          type="email"
          inputMode="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          aria-invalid={showEmailError}
          aria-describedby={showEmailError ? "recipient-error" : undefined}
          className={`mt-1.5 w-full rounded-full border bg-black/20 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 ${focus} ${
            showEmailError ? "border-red-400/60" : "border-white/10"
          }`}
        />
        {showEmailError && (
          <p id="recipient-error" role="alert" className="mt-2 text-sm text-red-300">
            {emailMissing ? "Enter the recipient's email so they can verify." : "Enter a valid email address."}
          </p>
        )}

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-200">Require verification</p>
            <p className="mt-0.5 text-sm text-slate-500">The recipient must confirm their identity before opening the file.</p>
          </div>
          <Switch checked={verify} onChange={setVerify} label="Require recipient verification" />
        </div>
      </fieldset>

      {/* 3. Access rules */}
      <fieldset disabled={busy} className={`p-6 ${card}`}>
        <legend className="sr-only">Access rules</legend>
        <h2 className="text-base font-semibold text-white">Access rules</h2>

        <div className="mt-4 space-y-5">
          <div>
            <p className="mb-2 text-sm text-slate-300">Link expires after</p>
            <Segmented label="Link expiry" options={expiryOptions} value={expiry} onChange={setExpiry} />
          </div>
          <div>
            <p className="mb-2 text-sm text-slate-300">Download limit</p>
            <Segmented label="Download limit" options={limitOptions} value={limit} onChange={setLimit} />
          </div>
        </div>
      </fieldset>

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {busy ? (
          <div className="flex-1" role="status" aria-live="polite">
            <p className="mb-2 text-sm text-slate-300">Encrypting on your device… {progress}%</p>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-indigo-400 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Lock size={14} className="text-emerald-400" />
            Keys never leave this device.
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className={`inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 ${focus}`}
        >
          {busy ? "Encrypting…" : "Encrypt and create link"}
        </button>
      </div>
    </form>
  );
}