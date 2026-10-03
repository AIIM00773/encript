import { useState } from "react";
import { Check, Copy, FileKey2, Trash2 } from "lucide-react";

type Link = {
  id: string;
  name: string;
  recipient: string;
  verified: boolean;
  url: string;
  ttl: string;
  progress: number; // % of lifetime left
  expiring: boolean;
  downloads: { used: number; max: number };
};

const initialLinks: Link[] = [
  {
    id: "l1",
    name: "client-database.zip",
    recipient: "Alex Mwangi",
    verified: true,
    url: "https://encript.app/h/8f21-a9c3",
    ttl: "21h 42m",
    progress: 72,
    expiring: false,
    downloads: { used: 0, max: 1 },
  },
  {
    id: "l2",
    name: "production-config.pdf",
    recipient: "Nexus IT",
    verified: false,
    url: "https://encript.app/h/b72d-04e1",
    ttl: "4h 18m",
    progress: 31,
    expiring: false,
    downloads: { used: 1, max: 3 },
  },
  {
    id: "l3",
    name: "server-notes.txt",
    recipient: "Grace W.",
    verified: true,
    url: "https://encript.app/h/c418-77fa",
    ttl: "48m",
    progress: 9,
    expiring: true,
    downloads: { used: 0, max: 1 },
  },
];

type Filter = "all" | "expiring";

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A12]";

export default function ActiveLinks() {
  const [links, setLinks] = useState(initialLinks);
  const [filter, setFilter] = useState<Filter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const expiringCount = links.filter((l) => l.expiring).length;
  const visible = filter === "expiring" ? links.filter((l) => l.expiring) : links;

  const copy = async (link: Link) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedId(link.id);
      window.setTimeout(() => setCopiedId((id) => (id === link.id ? null : id)), 2000);
    } catch {
      // Clipboard can be blocked (insecure context or denied permission); fail quietly.
    }
  };

  const revoke = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setConfirmId(null);
  };

  const cols = "lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)_150px_90px_190px]";

  return (
    <section aria-label="Active links" className="space-y-5">
      {/* Intro + filter */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="max-w-md text-sm leading-6 text-slate-400">
          Secure links that are still live. Revoking a link stops access immediately.
        </p>

        <div role="group" aria-label="Filter links" className="inline-flex self-start rounded-full border border-white/10 p-1">
          {(
            [
              ["all", `All ${links.length}`],
              ["expiring", `Expiring ${expiringCount}`],
            ] as [Filter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${focus} ${
                filter === value ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025]">
        {visible.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-slate-400">
              <FileKey2 size={20} />
            </span>
            <p className="mt-4 text-sm font-medium text-slate-200">
              {links.length === 0 ? "No active links" : "Nothing is expiring soon"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {links.length === 0
                ? "Create a handoff to share a file securely."
                : "Links with less than an hour left will show up here."}
            </p>
          </div>
        ) : (
          <>
            <div
              className={`hidden gap-4 border-b border-white/[0.06] px-6 py-3 text-xs font-medium text-slate-500 lg:grid ${cols}`}
            >
              <span>File</span>
              <span>Recipient</span>
              <span>Expires in</span>
              <span>Downloads</span>
              <span className="text-right">Actions</span>
            </div>

            <ul className="divide-y divide-white/[0.06]">
              {visible.map((l) => {
                const confirming = confirmId === l.id;
                const copied = copiedId === l.id;

                return (
                  <li key={l.id} className={`grid items-center gap-x-4 gap-y-3 px-6 py-4 ${cols}`}>
                    {/* File */}
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          l.expiring ? "bg-amber-400/10 text-amber-300" : "bg-indigo-500/10 text-indigo-300"
                        }`}
                      >
                        <FileKey2 size={17} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-100">{l.name}</p>
                        <p className="truncate text-xs text-slate-500">{l.url.replace("https://", "")}</p>
                      </div>
                    </div>

                    {/* Recipient */}
                    <div className="min-w-0">
                      <p className="truncate text-sm text-slate-300">{l.recipient}</p>
                      <p className={`text-xs ${l.verified ? "text-emerald-400" : "text-slate-500"}`}>
                        {l.verified ? "Verified" : "Not verified yet"}
                      </p>
                    </div>

                    {/* Expiry */}
                    <div>
                      <p className={`mb-1.5 text-sm font-medium tabular-nums ${l.expiring ? "text-amber-300" : "text-slate-300"}`}>
                        {l.ttl}
                      </p>
                      <div className="h-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${l.expiring ? "bg-amber-400" : "bg-indigo-400"}`}
                          style={{ width: `${l.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Downloads */}
                    <p className="text-sm tabular-nums text-slate-400">
                      {l.downloads.used} of {l.downloads.max}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:justify-end">
                      {confirming ? (
                        <>
                          <button
                            type="button"
                            onClick={() => revoke(l.id)}
                            className={`rounded-full bg-red-500/15 px-3.5 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/25 ${focus}`}
                          >
                            Revoke link
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
                          <button
                            type="button"
                            onClick={() => copy(l)}
                            aria-label={`Copy link for ${l.name}`}
                            className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-sm font-medium transition hover:bg-white/[0.05] ${focus} ${
                              copied ? "text-emerald-300" : "text-slate-200"
                            }`}
                          >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? "Copied" : "Copy link"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(l.id)}
                            aria-label={`Revoke link for ${l.name}`}
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-red-500/10 hover:text-red-300 ${focus}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
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