
import {
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  FileArchive,
  FileKey2,
  FileText,
  FolderLock,
  KeyRound,
  Menu,
  MoreHorizontal,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useUser} from "../Providers/User"; 

import Sidebar, { type View } from "./components/dashboard/sidebar";
import Header from "./components/dashboard/header";
import StatCard from "./components/dashboard/StatCard";
import DashboardQuickStats from "./components/dashboard/quickstats";

type HandoffStatus =
  | "active"
  | "downloaded"
  | "expiring"
  | "revoked"
  | "expired";



type Handoff = {
  id: string;
  name: string;
  type: string;
  size: string;
  recipient: string;
  recipientEmail: string;
  status: HandoffStatus;
  expires: string;
  downloads: string;
  icon: "file" | "key" | "archive";
};



const handoffs: Handoff[] = [
  {
    id: "01",
    name: "production-backup.zip",
    type: "Encrypted archive",
    size: "248 MB",
    recipient: "Acme Systems",
    recipientEmail: "ops@acme.io",
    status: "active",
    expires: "22h 14m",
    downloads: "0 / 1",
    icon: "archive",
  },
  {
    id: "02",
    name: "production-api-key.txt",
    type: "Encrypted secret",
    size: "2.4 KB",
    recipient: "DevOps Team",
    recipientEmail: "devops@company.io",
    status: "active",
    expires: "1d 08h",
    downloads: "0 / 1",
    icon: "key",
  },
  {
    id: "03",
    name: "router-config.pdf",
    type: "Encrypted document",
    size: "4.8 MB",
    recipient: "IT Support",
    recipientEmail: "support@client.io",
    status: "downloaded",
    expires: "Expired",
    downloads: "1 / 1",
    icon: "file",
  },
  {
    id: "04",
    name: "private-certificate.p12",
    type: "Encrypted certificate",
    size: "4.3 KB",
    recipient: "Security Team",
    recipientEmail: "security@company.io",
    status: "expiring",
    expires: "5h 42m",
    downloads: "0 / 1",
    icon: "key",
  },
  {
    id: "05",
    name: "client-documents.zip",
    type: "Encrypted archive",
    size: "15.2 MB",
    recipient: "External Partner",
    recipientEmail: "partner@client.io",
    status: "active",
    expires: "4d 12h",
    downloads: "0 / 3",
    icon: "archive",
  },
];

const activity = [
  {
    icon: FileKey2,
    title: "File downloaded",
    detail: "router-config.pdf",
    time: "2 hours ago",
    tone: "red",
  },
  {
    icon: ShieldCheck,
    title: "Verification successful",
    detail: "Acme Systems",
    time: "5 hours ago",
    tone: "green",
  },
  {
    icon: KeyRound,
    title: "Secure link opened",
    detail: "production-api-key.txt",
    time: "6 hours ago",
    tone: "blue",
  },
  {
    icon: X,
    title: "Handoff revoked",
    detail: "old-client-backup.zip",
    time: "Yesterday",
    tone: "gray",
  },
];



function StatusBadge({ status }: { status: HandoffStatus }) {
  const styles: Record<HandoffStatus, string> = {
    active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    downloaded: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    expiring: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    revoked: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
    expired: "border-red-500/20 bg-red-500/10 text-red-400",
  };

  const labels: Record<HandoffStatus, string> = {
    active: "Active",
    downloaded: "Downloaded",
    expiring: "Expiring soon",
    revoked: "Revoked",
    expired: "Expired",
  };

  const dots: Record<HandoffStatus, string> = {
    active: "bg-emerald-400",
    expiring: "bg-amber-400",
    downloaded: "bg-blue-400",
    expired: "bg-red-400",
    revoked: "bg-zinc-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[9px] font-medium ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {labels[status]}
    </span>
  );
}

function FileIcon({ type }: { type: Handoff["icon"] }) {
  const Icon =
    type === "key"
      ? KeyRound
      : type === "archive"
        ? FileArchive
        : FileText;

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-zinc-400">
      <Icon size={18} strokeWidth={1.7} />
    </div>
  );
}






export default function Dashboard() {
  const [activeView, setActiveView] = useState<View>("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [siderMinimized, setSiderMinimized] = useState(false);
  const navigate = useNavigate();
  const {isAuthenticated} = useUser();
const [profileOpen, setProfileOpen] = useState(false);

  const changeView = (newView: View) => {
    setActiveView(newView);
    setMenuOpen(false);
  };

  const navigateOutside = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };



useEffect(() => {
  if (!isAuthenticated) {
    navigate("/login", { replace: true });
  }
}, [isAuthenticated, navigate]);


  const container = "mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-10";

  return (
    <div className="relative h-screen overflow-hidden bg-[#070809] text-white">
      {/* Background */}
      <div className=" pointer-events-none fixed inset-0 z-0 opacity-[0.035] [background-size:48px_48px] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]" />

      {/* Sidebar */}
     <Sidebar changeView={changeView} activeView={activeView}
      navigateOutside={navigateOutside} open={menuOpen} 
      onClose={() => setMenuOpen(false)}
      onOpen={() => setMenuOpen(true)}
      siderMinimized={siderMinimized}
      onToggleMinimized={() =>setSiderMinimized((minimized) => !minimized)}
    />

      {/* Application content */}
      <div className={`relative z-10 flex h-full min-h-0 flex-col transition-[padding] duration-200 ${siderMinimized ? "lg:pl-[60px]" : "lg:pl-[248px]"}`}> 

        <Header
  activeView={activeView}
  menuOpen={menuOpen}
  setMenuOpen={setMenuOpen}
/>


        {/* =============================== MAIN SCROLL CONTAINER ========================================================= */}

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain scroll-smooth">


        <div className={`${container} space-y-5 py-7`}>            
            {/* ================================================STATS ===================================================== */}
            <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">

              <StatCard icon={KeyRound} label="Active links" value="3" detail="of 10 total handoffs" accent="red" />
              <StatCard icon={Clock3} label="Expiring soon" value="1" detail="within the next 24 hours" accent="amber"/>
              <StatCard icon={FolderLock} label="Total handoffs" value="12" detail="created this month" accent="blue" />
              <StatCard icon={Check} label="Downloads" value="8" detail="successful this month" accent="green"/>

            </section>

            {/* ========================================= CONTENT GRID ===================================================== */}
            <section className="grid min-h-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_290px]">
              {/* ============================================= HANDOFFS =================================================== */}
              <div className=" flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101214]" >
                {/* Panel header */}
                <div className="flex shrink-0 flex-col gap-4 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-white">
                        Recent handoffs
                      </h2>

                      <span className="rounded-md border border-white/[0.07] bg-white/[0.025] px-1.5 py-0.5 text-[9px] text-zinc-500">
                        12
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-zinc-600">
                      Your latest encrypted data transfers.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="
                        flex h-9 items-center gap-2
                        rounded-lg
                        border border-white/[0.07]
                        bg-white/[0.025]
                        px-3
                        text-xs text-zinc-500
                        hover:text-white
                      "
                    >
                      <Search size={14} />

                      <span className="hidden sm:block">Search</span>
                    </button>

                    <button
                      type="button"
                      className="
                        flex h-9 items-center gap-2
                        rounded-lg
                        px-3
                        text-xs text-zinc-500
                        hover:bg-white/[0.035]
                        hover:text-white
                      "
                    >
                      View all
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* =================================================
                    HANDOFF LIST — INDEPENDENT SCROLL
                ================================================= */}
                <div className="min-h-0 flex-1">
                  {/* Desktop */}
                  <div className="hidden xl:block">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-[#101214]">
                        <tr className="border-b border-white/[0.05] text-left">
                          <th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-700">
                            Handoff
                          </th>

                          <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-700">
                            Recipient
                          </th>

                          <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-700">
                            Status
                          </th>

                          <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-700">
                            Expires
                          </th>

                          <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-700">
                            Access
                          </th>

                          <th className="w-14 px-2" />
                        </tr>
                      </thead>

                      <tbody>
                        {handoffs.map((handoff) => (
                          <tr
                            key={handoff.id}
                            className="border-b border-white/[0.045] transition hover:bg-white/[0.018]"
                          >
                            <td className="px-5 py-4 align-middle">
                              <div className="flex items-center gap-3">
                                <FileIcon type={handoff.icon} />

                                <div className="min-w-0">
                                  <p className="truncate text-xs font-medium text-zinc-200">
                                    {handoff.name}
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-zinc-600">
                                    {handoff.type} · {handoff.size}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4 align-middle">
                              <p className="text-xs text-zinc-400">
                                {handoff.recipient}
                              </p>

                              <p className="mt-0.5 text-[10px] text-zinc-700">
                                {handoff.recipientEmail}
                              </p>
                            </td>

                            <td className="px-4 py-4 align-middle">
                              <StatusBadge status={handoff.status} />
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 align-middle">
                              <p
                                className={
                                  handoff.status === "expiring"
                                    ? "text-xs text-amber-400"
                                    : handoff.status === "downloaded"
                                      ? "text-xs text-zinc-600"
                                      : "text-xs text-zinc-400"
                                }
                              >
                                {handoff.expires}
                              </p>
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 align-middle">
                              <span className="text-xs tabular-nums text-zinc-500">
                                {handoff.downloads}
                              </span>
                            </td>

                            <td className="px-2 py-4 text-right align-middle">
                              <button
                                type="button"
                                aria-label={`More actions for ${handoff.name}`}
                                className="rounded-lg p-2 text-zinc-700 transition hover:bg-white/[0.05] hover:text-zinc-300"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Compact */}
                  <div className="divide-y divide-white/[0.05] xl:hidden">
                    {handoffs.map((handoff) => (
                      <div key={handoff.id} className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <FileIcon type={handoff.icon} />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-zinc-200">
                                  {handoff.name}
                                </p>

                                <p className="mt-1 truncate text-[10px] text-zinc-600">
                                  {handoff.size} · {handoff.recipient}
                                </p>
                              </div>

                              <button
                                type="button"
                                aria-label={`More actions for ${handoff.name}`}
                                className="-mr-2 -mt-1.5 shrink-0 rounded-lg p-2 text-zinc-700 hover:bg-white/[0.05] hover:text-zinc-300"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <StatusBadge status={handoff.status} />

                              <span className="text-[10px] text-zinc-600">
                                {handoff.expires}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* =================================================
                    SECURITY STRIP
                ================================================= */}
                <div className="shrink-0 p-5">
                  <div className="flex flex-col gap-4 rounded-xl border border-red-500/10 bg-gradient-to-r from-red-500/[0.055] to-transparent p-4 sm:flex-row sm:items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/[0.08] text-red-400">
                      <ShieldCheck size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-zinc-200">
                        Client-side encryption is active
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-zinc-600">
                        Your files are encrypted in this browser before
                        upload. encript receives encrypted data only.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="inline-flex shrink-0 items-center gap-1.5 self-start text-[10px] font-medium text-red-400 hover:text-red-300 sm:self-center"
                    >
                      Security details
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ===================================================
                  RIGHT COLUMN — INDEPENDENT SCROLL
              =================================================== */}
              <aside className="min-h-0 overflow-y-auto overscroll-contain">
                <DashboardQuickStats activity={activity} />
              </aside>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
