import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Link2,
  Lock,
  LogIn,
  ShieldAlert,
  Trash2,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types & sample data                                                 */
/* ------------------------------------------------------------------ */

type Kind =
  | "verified"
  | "verification_failed"
  | "opened"
  | "downloaded"
  | "expired"
  | "created"
  | "encrypted"
  | "extended"
  | "revoked"
  | "deleted"
  | "signed_in";

type Group = "links" | "you";

type ActivityEvent = {
  id: string;
  kind: Kind;
  group: Group;
  title: string;
  detail: string;
  at: number; // ms timestamp
};

const kindStyle: Record<Kind, { icon: LucideIcon; tone: string }> = {
  verified: { icon: CheckCircle2, tone: "bg-emerald-400/10 text-emerald-300" },
  verification_failed: { icon: ShieldAlert, tone: "bg-red-400/10 text-red-300" },
  opened: { icon: Eye, tone: "bg-white/[0.06] text-slate-300" },
  downloaded: { icon: Download, tone: "bg-indigo-500/10 text-indigo-300" },
  expired: { icon: Clock3, tone: "bg-white/[0.06] text-slate-400" },
  created: { icon: Link2, tone: "bg-indigo-500/10 text-indigo-300" },
  encrypted: { icon: Lock, tone: "bg-indigo-500/10 text-indigo-300" },
  extended: { icon: Clock3, tone: "bg-amber-400/10 text-amber-300" },
  revoked: { icon: Trash2, tone: "bg-red-400/10 text-red-300" },
  deleted: { icon: Trash2, tone: "bg-red-400/10 text-red-300" },
  signed_in: { icon: LogIn, tone: "bg-white/[0.06] text-slate-300" },
};

const MIN = 60_000;
const ago = (minutes: number) => Date.now() - minutes * MIN;

// Sample data: replace with your API response (newest first).
const events: ActivityEvent[] = [
  { id: "e1", kind: "verified", group: "links", title: "Recipient verified", detail: "Alex Mwangi verified access to client-database.zip", at: ago(8) },
  { id: "e2", kind: "created", group: "you", title: "Handoff created", detail: "client-database.zip shared with Alex Mwangi", at: ago(13) },
  { id: "e3", kind: "encrypted", group: "you", title: "File encrypted", detail: "client-database.zip was encrypted on this device", at: ago(14) },
  { id: "e4", kind: "verification_failed", group: "links", title: "Verification failed", detail: "Three wrong attempts on production-config.pdf", at: ago(95) },
  { id: "e5", kind: "opened", group: "links", title: "Link opened", detail: "production-config.pdf was opened by Nexus IT", at: ago(130) },
  { id: "e6", kind: "extended", group: "you", title: "Link extended", detail: "server-notes.txt now expires in 24 hours", at: ago(210) },
  { id: "e7", kind: "signed_in", group: "you", title: "Signed in", detail: "New session from Nairobi, Kenya", at: ago(300) },
  { id: "e8", kind: "downloaded", group: "links", title: "File downloaded", detail: "invoice-q3.pdf was downloaded by Brian Otieno", at: ago(24 * 60 + 40) },
  { id: "e9", kind: "expired", group: "links", title: "Link expired", detail: "invoice-q3.pdf reached its download limit", at: ago(24 * 60 + 39) },
  { id: "e10", kind: "revoked", group: "you", title: "Link revoked", detail: "You revoked the link for old-contract.docx", at: ago(26 * 60) },
  { id: "e11", kind: "deleted", group: "you", title: "File deleted", detail: "old-contract.docx was permanently deleted", at: ago(26 * 60 - 2) },
  { id: "e12", kind: "created", group: "you", title: "Handoff created", detail: "invoice-q3.pdf shared with Brian Otieno", at: ago(3 * 24 * 60) },
];

const PAGE_SIZE = 10;

type Filter = "all" | Group;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "links", label: "Link activity" },
  { value: "you", label: "Your actions" },
];

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A12]";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const dayKey = (ms: number) => new Date(ms).toDateString();

function dayLabel(ms: number) {
  const key = dayKey(ms);
  if (key === dayKey(Date.now())) return "Today";
  if (key === dayKey(Date.now() - 24 * 60 * MIN)) return "Yesterday";
  return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const formatTime = (ms: number) =>
  new Date(ms).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function RecentActivity() {
  const [filter, setFilter] = useState<Filter>("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const counts = useMemo(
    () => ({
      all: events.length,
      links: events.filter((e) => e.group === "links").length,
      you: events.filter((e) => e.group === "you").length,
    }),
    [],
  );

  const filtered = filter === "all" ? events : events.filter((e) => e.group === filter);
  const shown = filtered.slice(0, limit);

  const days = useMemo(() => {
    const out: { label: string; items: ActivityEvent[] }[] = [];
    for (const e of shown) {
      const label = dayLabel(e.at);
      const last = out[out.length - 1];
      if (last && last.label === label) last.items.push(e);
      else out.push({ label, items: [e] });
    }
    return out;
  }, [shown]);

  const changeFilter = (value: Filter) => {
    setFilter(value);
    setLimit(PAGE_SIZE);
  };

  return (
    <section aria-label="Recent activity" className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="max-w-md text-sm leading-6 text-slate-400">
          Everything that happens to your shared files, and every action you take.
        </p>

        <div role="group" aria-label="Filter activity" className="inline-flex flex-wrap self-start rounded-full border border-white/10 p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => changeFilter(f.value)}
              aria-pressed={filter === f.value}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${focus} ${
                filter === f.value ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {f.label} <span className="tabular-nums text-slate-500">{counts[f.value]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-200">No activity yet</p>
            <p className="mt-1 text-sm text-slate-500">Events will appear here as soon as you share a file.</p>
          </div>
        ) : (
          days.map((day) => (
            <div key={day.label} className="border-b border-white/[0.06] last:border-b-0">
              <h2 className="border-b border-white/[0.06] bg-white/[0.02] px-6 py-2.5 text-xs font-medium text-slate-500">
                {day.label}
              </h2>

              <ol className="divide-y divide-white/[0.06]">
                {day.items.map((e) => {
                  const { icon: Icon, tone } = kindStyle[e.kind];
                  const alert = e.kind === "verification_failed";

                  return (
                    <li key={e.id} className="flex items-start gap-4 px-6 py-4">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone}`}>
                        <Icon size={16} aria-hidden="true" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${alert ? "text-red-300" : "text-slate-100"}`}>{e.title}</p>
                        <p className="mt-0.5 text-sm leading-5 text-slate-500">{e.detail}</p>
                      </div>

                      <time dateTime={new Date(e.at).toISOString()} className="shrink-0 pt-0.5 text-xs tabular-nums text-slate-500">
                        {formatTime(e.at)}
                      </time>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))
        )}
      </div>

      {filtered.length > shown.length && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((n) => n + PAGE_SIZE)}
            className={`rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05] ${focus}`}
          >
            Show more
          </button>
        </div>
      )}
    </section>
  );
}