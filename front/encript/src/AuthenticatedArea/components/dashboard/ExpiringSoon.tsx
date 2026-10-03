import { useEffect, useState } from "react";
import { Clock3, FileKey2, Trash2 } from "lucide-react";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const WINDOW = HOUR; // links with less than this left count as "expiring soon"

type Link = {
  id: string;
  name: string;
  recipient: string;
  expiresAt: number; // ms timestamp
  downloads: { used: number; max: number };
};

// Sample data: replace with your API response.
const initialLinks: Link[] = [
  { id: "l1", name: "server-notes.txt", recipient: "Grace W.", expiresAt: Date.now() + 48 * MINUTE, downloads: { used: 0, max: 1 } },
  { id: "l2", name: "invoice-q3.pdf", recipient: "Brian Otieno", expiresAt: Date.now() + 12 * MINUTE, downloads: { used: 0, max: 1 } },
  { id: "l3", name: "client-database.zip", recipient: "Alex Mwangi", expiresAt: Date.now() + 21 * HOUR, downloads: { used: 0, max: 1 } },
];

const extendOptions = [
  { label: "+1 hour", ms: HOUR },
  { label: "+24 hours", ms: 24 * HOUR },
];

type Panel = { id: string; mode: "extend" | "revoke" } | null;

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A12]";

function formatLeft(ms: number) {
  const totalMin = Math.max(0, Math.floor(ms / MINUTE));
  if (totalMin < 1) return "Under 1 min";
  if (totalMin < 60) return `${totalMin} min`;
  return `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;
}

export default function ExpiringSoon() {
  const [links, setLinks] = useState(initialLinks);
  const [now, setNow] = useState(() => Date.now());
  const [panel, setPanel] = useState<Panel>(null);
  const [notice, setNotice] = useState("");

  // Keep countdowns current.
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(t);
  }, []);

  const expiring = links
    .filter((l) => l.expiresAt > now && l.expiresAt - now < WINDOW)
    .sort((a, b) => a.expiresAt - b.expiresAt);

  const extend = (link: Link, ms: number, label: string) => {
    setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, expiresAt: l.expiresAt + ms } : l)));
    setPanel(null);
    setNotice(`${link.name} extended (${label}). It will leave this list.`);
  };

  const revoke = (link: Link) => {
    setLinks((prev) => prev.filter((l) => l.id !== link.id));
    setPanel(null);
    setNotice(`Link for ${link.name} revoked.`);
  };

  return (
    <section aria-label="Expiring soon" className="space-y-5">
      <p className="max-w-md text-sm leading-6 text-slate-400">
        Links with less than an hour left. Extend them to keep access open, or let them expire.
      </p>

      <p role="status" aria-live="polite" className={`text-sm text-slate-300 ${notice ? "" : "sr-only"}`}>
        {notice}
      </p>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025]">
        {expiring.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-slate-400">
              <Clock3 size={20} />
            </span>
            <p className="mt-4 text-sm font-medium text-slate-200">Nothing is expiring soon</p>
            <p className="mt-1 text-sm text-slate-500">Links with less than an hour left will show up here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {expiring.map((l) => {
              const left = l.expiresAt - now;
              const critical = left < 10 * MINUTE;
              const open = panel?.id === l.id ? panel.mode : null;

              return (
                <li
                  key={l.id}
                  className="flex flex-col gap-4 px-6 py-4 lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_170px_auto] lg:items-center lg:gap-x-6"
                >
                  {/* File */}
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                      <FileKey2 size={17} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-100">{l.name}</p>
                      <p className="text-xs text-slate-500">
                        {l.downloads.used} of {l.downloads.max} {l.downloads.max === 1 ? "download" : "downloads"} used
                      </p>
                    </div>
                  </div>

                  {/* Recipient */}
                  <p className="truncate text-sm text-slate-300">{l.recipient}</p>

                  {/* Countdown */}
                  <div>
                    <p className={`mb-1.5 text-sm font-medium tabular-nums ${critical ? "text-red-300" : "text-amber-300"}`}>
                      {formatLeft(left)} left
                    </p>
                    <div className="h-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${critical ? "bg-red-400" : "bg-amber-400"}`}
                        style={{ width: `${Math.max(3, (left / WINDOW) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    {open === "extend" && (
                      <>
                        {extendOptions.map((o) => (
                          <button
                            key={o.label}
                            type="button"
                            onClick={() => extend(l, o.ms, o.label)}
                            className={`rounded-full bg-indigo-500 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-400 ${focus}`}
                          >
                            {o.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setPanel(null)}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:text-white ${focus}`}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {open === "revoke" && (
                      <>
                        <button
                          type="button"
                          onClick={() => revoke(l)}
                          className={`rounded-full bg-red-500/15 px-3.5 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/25 ${focus}`}
                        >
                          Revoke link
                        </button>
                        <button
                          type="button"
                          onClick={() => setPanel(null)}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:text-white ${focus}`}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {open === null && (
                      <>
                        <button
                          type="button"
                          onClick={() => setPanel({ id: l.id, mode: "extend" })}
                          aria-label={`Extend link for ${l.name}`}
                          className={`rounded-full border border-white/10 px-3.5 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05] ${focus}`}
                        >
                          Extend
                        </button>
                        <button
                          type="button"
                          onClick={() => setPanel({ id: l.id, mode: "revoke" })}
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
        )}
      </div>
    </section>
  );
}