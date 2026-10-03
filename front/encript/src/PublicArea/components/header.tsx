
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

import { useUser } from "../../Providers/User";

export function Brand() {
  return (
    <Link
      to="/"
      aria-label="Encript home"
      className="group inline-flex shrink-0 items-center gap-2.5"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/[0.08] text-red-400 transition-all duration-200 group-hover:border-red-400/30 group-hover:bg-red-500/[0.12]">
        <LockKeyhole size={17} strokeWidth={1.8} />
      </span>

      <span className="text-sm font-semibold tracking-[0.01em] text-zinc-100">
        encript
      </span>
    </Link>
  );
}

const navigation = [
  {
    label: "How it works",
    to: "/how-it-works",
  }
];

export default function Header() {
  const { isAuthenticated } = useUser();

  const dashboardPath = isAuthenticated ? "/me" : "/login";

  return (
    <header className="relative z-50">
      <div className="mx-auto flex h-[72px] max-w-8xl items-center justify-between px-5 sm:px-8 lg:px-10 lg:pr-12">
        <Brand />

        {/* Desktop navigation */}
        <div className="flex flex-row items-center gap-4">
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 sm:flex"
        >
          {navigation.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-xs font-medium inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth action */}
        <Link
          to={dashboardPath}
          className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
        >
          {isAuthenticated ? "Open dashboard" : "Sign in"}

          <ArrowUpRight
            size={14}
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
      </div>

    </header>
  );
}
