

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  SlidersHorizontal,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";



export default function Footer() {
  return (
    <footer className="border-t border-white/[0.055] bg-white/[0.01]">
      <div className="mx-auto flex max-w-8xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <p className="text-center text-[10px] uppercase tracking-[0.18em] text-zinc-600 sm:text-left">
          ...
        </p>

        <div className="flex flex-wrap justify-center gap-8 lg:gap-x-20 gap-y-2 text-[10px] text-zinc-500 sm:justify-end lg:mr-26">
          <span className="inline-flex items-center gap-1.5">
            <LockKeyhole size={12} className="text-red-400" />
            Browser-side encryption
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Timer size={12} className="text-amber-300" />
            Expiring links
          </span>

          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-emerald-300" />
            Access controls
          </span>
        </div>
      </div>
    </footer>
  );
}