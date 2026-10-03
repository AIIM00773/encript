

import {
  Activity,
  Home,
  LockKeyhole,
  Plus,
  Settings,
  ShieldCheck,
  ArrowUpRight,
  Terminal,
  Users,
  Gauge
} from "lucide-react";


export default function  DashboardQuickStats({TotalHandoffs=0, ActiveLinks=0,Downloads=0,Expired=0,Revoved=0,activity}:{TotalHandoffs:number, ActiveLinks:number,Downloads:number,Expired:number,Revoved:number,activity:any[]}){
	return(

            <div className="space-y-6">
              {/* Quick stats */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#101214]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Gauge size={15} className="text-zinc-500" />
                    <h3 className="text-xs font-semibold text-zinc-200">
                      Quick stats
                    </h3>
                  </div>

                  <button className="text-zinc-700 hover:text-zinc-300">
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="p-2">
                  {[
                    ["Total handoffs", TotalHandoffs],
                    ["Active links", ActiveLinks],
                    ["Successful downloads", Downloads],
                    ["Expired", Expired],
                    ["Revoked", Revoved],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.02]"
                    >
                      <span className="text-[11px] text-zinc-600">
                        {label}
                      </span>

                      <span className="text-xs font-medium text-zinc-300">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#101214]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Activity size={15} className="text-zinc-500" />
                    <h3 className="text-xs font-semibold text-zinc-200">
                      Recent activity
                    </h3>
                  </div>

                  <button className="text-zinc-700 hover:text-zinc-300">
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="p-2">
                  {activity.map((event, index) => {
                    const Icon = event.icon;

                    const tone =
                      event.tone === "red"
                        ? "text-red-400 bg-red-500/10 border-red-500/10"
                        : event.tone === "green"
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/10"
                          : event.tone === "blue"
                            ? "text-blue-400 bg-blue-500/10 border-blue-500/10"
                            : "text-zinc-500 bg-white/[0.035] border-white/[0.06]";

                    return (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.02]"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${tone}`}
                        >
                          <Icon size={14} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-zinc-300">
                            {event.title}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                            {event.detail}
                          </p>

                          <p className="mt-1 text-[9px] text-zinc-700">
                            {event.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System status */}
              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0f11]">
                <div className="relative p-5">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-600/[0.06] blur-3xl" />

                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/[0.08] text-red-400">
                        <Terminal size={16} />
                      </div>

                      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] text-emerald-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,.7)]" />
                        Operational
                      </span>
                    </div>

                    <p className="text-sm font-medium text-zinc-200">
                      encript security layer
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-zinc-600">
                      Encryption, access control and expiration services are
                      operating normally.
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5">
                        <p className="text-[9px] uppercase tracking-wider text-zinc-700">
                          Encryption
                        </p>
                        <p className="mt-1 text-[10px] text-emerald-400">
                          AES-GCM
                        </p>
                      </div>

                      <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5">
                        <p className="text-[9px] uppercase tracking-wider text-zinc-700">
                          Transport
                        </p>
                        <p className="mt-1 text-[10px] text-emerald-400">
                          TLS 1.3
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
	)
}