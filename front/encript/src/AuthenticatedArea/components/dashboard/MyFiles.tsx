import { useState } from "react";
import { Download, Search, Share2, Trash2 } from "lucide-react";

type StoredFile = {
  id: string;
  name: string;
  size: number; // bytes
  addedAt: string; // ISO date
  activeLinks: number;
};

// Sample data: replace with your API response.
const initialFiles: StoredFile[] = [
  { id: "f1", name: "client-database.zip", size: 48_300_000, addedAt: "2026-10-01", activeLinks: 1 },
  { id: "f2", name: "production-config.pdf", size: 2_400_000, addedAt: "2026-09-30", activeLinks: 1 },
  { id: "f3", name: "server-notes.txt", size: 14_200, addedAt: "2026-09-30", activeLinks: 1 },
  { id: "f4", name: "invoice-q3.pdf", size: 612_000, addedAt: "2026-09-27", activeLinks: 0 },
  { id: "f5", name: "network-diagram.png", size: 3_800_000, addedAt: "2026-09-18", activeLinks: 0 },
];

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A12]";

function formatSize(bytes: number) {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(0)} KB`;
  if (bytes < 1_000_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${(bytes / 1_000_000_000).toFixed(2)} GB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function extension(name: string) {
  const ext = name.includes(".") ? name.split(".").pop() ?? "" : "";
  return ext ? ext.slice(0, 4) : "file";
}

/** Placeholder: fetch the ciphertext, decrypt it in the browser, then save the result. */
async function downloadFile(_file: StoredFile) {
  await new Promise((r) => setTimeout(r, 400));
}

export default function MyFiles({ onShare }: { onShare?: (fileId: string) => void }) {
  const [files, setFiles] = useState(initialFiles);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const q = query.trim().toLowerCase();
  const visible = q ? files.filter((f) => f.name.toLowerCase().includes(q)) : files;
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  const download = async (file: StoredFile) => {
    setBusyId(file.id);
    setNotice(`Decrypting ${file.name} on this device…`);
    try {
      await downloadFile(file);
      setNotice(`${file.name} is ready.`);
    } catch {
      setNotice(`Could not download ${file.name}. Try again.`);
    } finally {
      setBusyId(null);
    }
  };

  const remove = (file: StoredFile) => {
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    setConfirmId(null);
    setNotice(`${file.name} deleted.`);
  };

  const cols = "lg:grid-cols-[minmax(0,1.8fr)_90px_120px_130px_auto]";

  return (
    <section aria-label="My files" className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files"
            aria-label="Search files"
            className={`w-full rounded-full border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-600 ${focus}`}
          />
        </div>
        <p className="text-sm text-slate-500">
          {files.length} {files.length === 1 ? "file" : "files"}, {formatSize(totalSize)} encrypted
        </p>
      </div>

      <p role="status" aria-live="polite" className={`text-sm text-slate-300 ${notice ? "" : "sr-only"}`}>
        {notice}
      </p>

      {/* List */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025]">
        {visible.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-200">
              {files.length === 0 ? "No files yet" : `No files match “${query.trim()}”`}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {files.length === 0
                ? "Files you encrypt are stored here."
                : "Check the spelling or try a shorter search."}
            </p>
          </div>
        ) : (
          <>
            <div
              className={`hidden gap-4 border-b border-white/[0.06] px-6 py-3 text-xs font-medium text-slate-500 lg:grid ${cols}`}
            >
              <span>Name</span>
              <span>Size</span>
              <span>Added</span>
              <span>Sharing</span>
              <span className="text-right">Actions</span>
            </div>

            <ul className="divide-y divide-white/[0.06]">
              {visible.map((f) => {
                const confirming = confirmId === f.id;
                const busy = busyId === f.id;

                return (
                  <li key={f.id} className={`grid items-center gap-x-4 gap-y-3 px-6 py-4 ${cols}`}>
                    {/* Name */}
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xs font-semibold uppercase text-indigo-300"
                      >
                        {extension(f.name)}
                      </span>
                      <p className="min-w-0 truncate text-sm font-medium text-slate-100">{f.name}</p>
                    </div>

                    <p className="text-sm tabular-nums text-slate-400">{formatSize(f.size)}</p>
                    <p className="text-sm text-slate-400">{formatDate(f.addedAt)}</p>

                    <p className={`text-sm ${f.activeLinks > 0 ? "text-indigo-300" : "text-slate-500"}`}>
                      {f.activeLinks > 0
                        ? `${f.activeLinks} active ${f.activeLinks === 1 ? "link" : "links"}`
                        : "Not shared"}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:justify-end">
                      {confirming ? (
                        <>
                          <button
                            type="button"
                            onClick={() => remove(f)}
                            className={`rounded-full bg-red-500/15 px-3.5 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/25 ${focus}`}
                          >
                            Delete file
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className={`rounded-full px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:text-white ${focus}`}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {onShare && (
                            <button
                              type="button"
                              onClick={() => onShare(f.id)}
                              aria-label={`Share ${f.name}`}
                              className={`flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-white ${focus}`}
                            >
                              <Share2 size={15} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => download(f)}
                            disabled={busy}
                            aria-label={`Download ${f.name}`}
                            className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05] disabled:opacity-50 ${focus}`}
                          >
                            <Download size={14} />
                            {busy ? "Decrypting…" : "Download"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(f.id)}
                            aria-label={`Delete ${f.name}`}
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-red-500/10 hover:text-red-300 ${focus}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>

                    {confirming && (
                      <p className="text-sm text-slate-400 lg:col-span-full">
                        {f.activeLinks > 0
                          ? `Deleting this file also revokes its ${f.activeLinks} active ${f.activeLinks === 1 ? "link" : "links"}. This can't be undone.`
                          : "This permanently deletes the encrypted file. This can't be undone."}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}