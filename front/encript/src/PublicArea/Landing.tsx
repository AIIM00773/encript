

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
import Header from "./components/header";
import Footer from "./components/footer"; 
import {useUser}from "../Providers/User"

const benefits = [
  {
    icon: LockKeyhole,
    label: "Encrypted in your browser",
    color: "text-red-300",
  },
  {
    icon: SlidersHorizontal,
    label: "Access on your terms",
    color: "text-amber-300",
  },
  {
    icon: Timer,
    label: "Links expire when you choose",
    color: "text-emerald-300",
  },
];

const controls = [
  {
    icon: KeyRound,
    title: "Your keys",
    detail: "Stay in your control",
    color: "text-red-300",
  },
  {
    icon: SlidersHorizontal,
    title: "Your access",
    detail: "Set the rules",
    color: "text-amber-300",
  },
  {
    icon: Timer,
    title: "Your timing",
    detail: "Choose expiration",
    color: "text-emerald-300",
  },
];


function SecurityVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/[0.07] blur-[100px]"
      />

      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#101214]/95 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-6">
        {/* Top status */}
        <div className="flex items-center justify-between border-b border-white/[0.055] pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/[0.08] text-red-300">
              <LockKeyhole size={13} />
            </span>

            <span className="text-[10px] font-medium text-zinc-400">
              Private workspace
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-2.5 py-1 text-[9px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Protected
          </span>
        </div>

        {/* Security illustration */}
        <div
          aria-hidden="true"
          className="relative mx-auto my-8 flex h-56 w-56 items-center justify-center sm:my-10 sm:h-64 sm:w-64"
        >
          {/* Orbit rings */}
          <div className="absolute inset-0 rounded-full border border-white/[0.055]" />
          <div className="absolute inset-5 rounded-full border border-dashed border-white/[0.07]" />
          <div className="absolute inset-11 rounded-full border border-red-400/[0.12]" />

          {/* Orbit accents */}
          <span className="absolute left-4 top-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#17191c] text-red-300 shadow-xl shadow-black/20">
            <KeyRound size={15} />
          </span>

          <span className="absolute right-2 top-[4.5rem] flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#17191c] text-blue-300 shadow-xl shadow-black/20">
            <Fingerprint size={15} />
          </span>

          <span className="absolute bottom-5 left-8 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#17191c] text-emerald-300 shadow-xl shadow-black/20">
            <SlidersHorizontal size={15} />
          </span>

          {/* Core */}
          <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-red-400/20 bg-gradient-to-br from-red-500/[0.16] via-red-500/[0.07] to-red-500/[0.02] shadow-[0_0_80px_rgba(239,68,68,0.12)] sm:h-32 sm:w-32">
            <div className="absolute inset-2 rounded-[1.5rem] border border-white/[0.055]" />

            <ShieldCheck
              size={48}
              strokeWidth={1.25}
              className="text-red-300 sm:h-14 sm:w-14"
            />

            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#101214] bg-emerald-400 text-[#08100b]">
              <Check size={12} strokeWidth={3} />
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {controls.map(({ icon: Icon, title, detail, color }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-2 py-3.5 text-center transition hover:border-white/[0.1] hover:bg-white/[0.035] sm:px-3"
            >
              <Icon size={15} className={`mx-auto ${color}`} />

              <p className="mt-2 text-[10px] font-medium text-zinc-300">
                {title}
              </p>

              <p className="mt-1 text-[8px] leading-4 text-zinc-600 sm:text-[9px]">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}





export default function LandingPage() {
  const {isAuthenticated} = useUser(); 
  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#090b0d] text-white selection:bg-red-500/30">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-48 h-[520px] w-[720px] rounded-full bg-red-500/[0.07] blur-[140px]" />

        <div className="absolute -right-40 top-[45%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.035] blur-[130px]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[360px] w-[500px] rounded-full bg-red-500/[0.025] blur-[130px]" />
      </div>

      <Header />

      <div className="relative z-10">
        <section className="mx-auto grid max-w-8xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-20">
          {/* Copy */}
          <div className="max-w-2xl">
         
            <h1 className="text-[3.2rem] font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-[4.6rem]">
              Your Space,
              <br />
              <span className="bg-gradient-to-r from-red-300 via-red-400 to-orange-300 bg-clip-text text-transparent">
                Your control.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              Share sensitive files through private, expiring links with
              access controls you define. Your files are encrypted in your
              browser before they leave your device.
            </p>

            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
              And when you need to communicate privately, Encript keeps
              conversations protected with end-to-end encryption and
              user-controlled keys.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link

                to= {`${isAuthenticated ?"/sp" :"/signup"}`}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(239,68,68,0.18)] transition hover:bg-red-400 hover:shadow-[0_12px_40px_rgba(239,68,68,0.25)]"
              >
                {isAuthenticated?"Your Space":"   Get started"}
             

                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3.5 text-sm font-medium text-zinc-300 transition hover:border-white/[0.14] hover:bg-white/[0.055] hover:text-white"
              >
                How it works
                <ChevronRight size={15} />
              </Link>
            </div>

            {/* Trust points */}
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
              {benefits.map(({ icon: Icon, label, color }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-[10px] text-zinc-500 sm:text-[11px]"
                >
                  <Icon size={13} className={color} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Visual */}
          <SecurityVisual />
        </section>

        <Footer />
      </div>
    </main>
  );
}
