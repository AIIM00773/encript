
import {
  ArrowUpRight,
  
} from "lucide-react";



export default function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  accent,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  detail: string;
  accent: "red" | "green" | "blue" | "amber";
}) {
  const accents = {
    red: "text-red-400 bg-red-500/10 border-red-500/15",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/15",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/15",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/15",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101214] p-5 transition hover:border-white/[0.12]">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-red-500/[0.025] blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accents[accent]}`}
        >
          <Icon size={18} />
        </div>

        <ArrowUpRight
          size={15}
          className="text-zinc-700 transition group-hover:text-zinc-400"
        />
      </div>

      <div className="relative mt-5">
        <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-zinc-500">
          {label}
        </p>

        <div className="mt-1 flex items-end gap-2">
          <span className="text-3xl font-semibold tracking-tight text-white">
            {value}
          </span>
        </div>

        <p className="mt-1 text-xs text-zinc-600">{detail}</p>
      </div>
    </div>
  );
}
