
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileKey2,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  Timer,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

import Header from "./components/header";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Choose your files",
    description:
      "Select the files you want to hand off. Encript prepares them locally before anything is uploaded.",
    accent: "text-red-300",
    glow: "bg-red-500/[0.08]",
  },
  {
    number: "02",
    icon: LockKeyhole,
    title: "Encrypt in your browser",
    description:
      "Your files are encrypted on your device before they leave your browser. The plaintext file is never uploaded.",
    accent: "text-orange-300",
    glow: "bg-orange-500/[0.07]",
  },
  {
    number: "03",
    icon: FileKey2,
    title: "Create a private link",
    description:
      "Choose how long the link remains available and share one simple link with your recipient.",
    accent: "text-emerald-300",
    glow: "bg-emerald-500/[0.07]",
  },
];

function SecurityFlow() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/[0.035] blur-[110px]"
      />

      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#101214] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/[0.055] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/[0.08] text-red-300">
              <ShieldCheck size={13} />
            </span>

            <span className="text-[10px] font-medium text-zinc-400">
              Secure file handoff
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-2.5 py-1 text-[9px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            End-to-end protected
          </span>
        </div>

        {/* Flow */}
        <div className="relative grid gap-0 p-5 sm:p-8 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center lg:gap-5">
          {/* Step 1 */}
          <FlowNode
            icon={Upload}
            eyebrow="01"
            title="Your device"
            detail="Choose your file"
            accent="text-red-300"
            iconBg="bg-red-500/[0.08]"
          />

          <FlowConnector />

          {/* Step 2 */}
          <FlowNode
            icon={LockKeyhole}
            eyebrow="02"
            title="Your browser"
            detail="Encrypt before upload"
            accent="text-orange-300"
            iconBg="bg-orange-500/[0.07]"
            active
          />

          <FlowConnector />

          {/* Step 3 */}
          <FlowNode
            icon={FileKey2}
            eyebrow="03"
            title="Private link"
            detail="Share with control"
            accent="text-emerald-300"
            iconBg="bg-emerald-500/[0.07]"
          />
        </div>

        {/* Status */}
        <div className="border-t border-white/[0.055] bg-white/[0.012] px-5 py-4 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-emerald-300">
                <Check size={14} strokeWidth={2.5} />
              </span>

              <div>
                <p className="text-[10px] font-medium text-zinc-300">
                  Plaintext stays on your device
                </p>
                <p className="mt-0.5 text-[9px] text-zinc-600">
                  Encryption happens before the upload begins.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[9px] text-zinc-600">
              <LockKeyhole size={11} className="text-red-300" />
              Browser-side encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FlowNodeProps = {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  detail: string;
  accent: string;
  iconBg: string;
  active?: boolean;
};

function FlowNode({
  icon: Icon,
  eyebrow,
  title,
  detail,
  accent,
  iconBg,
  active = false,
}: FlowNodeProps) {
  return (
    <div
      className={`relative rounded-2xl border p-5 transition ${
        active
          ? "border-red-400/15 bg-white/[0.035]"
          : "border-white/[0.055] bg-white/[0.018]"
      }`}
    >
      {active && (
        <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[#08100b]">
          <Check size={10} strokeWidth={3} />
        </span>
      )}

      <div className="flex items-center justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${accent}`}
        >
          <Icon size={17} strokeWidth={1.8} />
        </span>

        <span className="font-mono text-[9px] text-zinc-700">
          {eyebrow}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-zinc-200">{title}</p>

      <p className="mt-1 text-[10px] leading-5 text-zinc-600">{detail}</p>
    </div>
  );
}

function FlowConnector() {
  return (
    <div
      aria-hidden="true"
      className="hidden items-center justify-center lg:flex"
    >
      <div className="flex items-center gap-2">
        <span className="h-px w-8 bg-white/[0.08]" />
        <ArrowRight size={13} className="text-zinc-700" />
        <span className="h-px w-8 bg-white/[0.08]" />
      </div>
    </div>
  );
}

function DetailCard({
  icon: Icon,
  title,
  description,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <article className="group rounded-2xl border border-white/[0.06] bg-[#101214] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.11] hover:bg-[#121416]">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.035] ${accent}`}
      >
        <Icon size={15} strokeWidth={1.8} />
      </div>

      <h3 className="mt-5 text-sm font-medium text-zinc-200">{title}</h3>

      <p className="mt-2 text-xs leading-6 text-zinc-500">{description}</p>
    </article>
  );
}

export default function HowItWorks() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#090b0d] text-white selection:bg-red-500/30">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-48 h-[520px] w-[720px] rounded-full bg-red-500/[0.06] blur-[140px]" />

        <div className="absolute -right-40 top-[45%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.03] blur-[130px]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[360px] w-[500px] rounded-full bg-red-500/[0.025] blur-[130px]" />
      </div>

      <div className="relative z-10">
        <Header />

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">
          <div className="max-w-2xl">
            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Privacy 
              <br />
              <span className="bg-gradient-to-r from-red-300 via-red-400 to-orange-300 bg-clip-text text-transparent">
                without complexity.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              Encript keeps the handoff simple: choose a file, encrypt it
              locally, then share a controlled link with the person who needs
              it.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="border-y border-white/[0.055] bg-white/[0.008]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
            <div className="max-w-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
                Three simple steps
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                From file to private link.
              </h2>

              <p className="mt-4 text-sm leading-6 text-zinc-500">
                No complicated workflow. Encript handles the protection while
                you stay in control of how the file is shared.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {steps.map(
                ({
                  number,
                  icon: Icon,
                  title,
                  description,
                  accent,
                  glow,
                }) => (
                  <article
                    key={number}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#101214] p-6 transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.11]"
                  >
                    <div
                      aria-hidden="true"
                      className={`absolute -right-10 -top-10 h-28 w-28 rounded-full ${glow} opacity-0 blur-3xl transition group-hover:opacity-100`}
                    />

                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.035] ${accent}`}
                        >
                          <Icon size={17} strokeWidth={1.8} />
                        </span>

                        <span className="font-mono text-[10px] text-zinc-700">
                          {number}
                        </span>
                      </div>

                      <h3 className="mt-7 text-sm font-medium text-zinc-200">
                        {title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-zinc-500">
                        {description}
                      </p>
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Control section */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                You stay in control
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                The link is yours
                <br />
                to define.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-zinc-500">
                Decide how your shared file behaves after it leaves your
                device. Set the access conditions and expiration that fit the
                handoff.
              </p>

              <Link
                to="/signup"
                className="group mt-7 inline-flex items-center gap-2 text-xs font-medium text-zinc-300 transition hover:text-white"
              >
                Create your first link
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <DetailCard
                icon={Timer}
                title="Expiration"
                description="Choose when a shared link should stop being available."
                accent="text-amber-300"
              />

              <DetailCard
                icon={ShieldCheck}
                title="Access"
                description="Define the conditions required to reach the shared content."
                accent="text-emerald-300"
              />

              <DetailCard
                icon={Fingerprint}
                title="Privacy"
                description="Keep sensitive file protection centered around your device."
                accent="text-red-300"
              />
            </div>
          </div>
        </section>


        {/* Footer */}
        <footer className="border-t border-white/[0.055] bg-white/[0.01]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <p className="text-center text-[10px] uppercase tracking-[0.18em] text-zinc-600 sm:text-left">
              ...
            </p>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-zinc-500 sm:justify-end">
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
      </div>
    </main>
  );
}
