

import {
  ArrowRight,
  Clock3,
  FileKey2,
  Files,
  Link2,
  Plus,
  ShieldCheck,
  Upload,
} from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  description: string;
  icon: typeof Files;
  iconClassName: string;
};

const stats: StatCardProps[] = [
  {
    label: "Active links",
    value: "12",
    description: "Currently available",
    icon: Link2,
    iconClassName: "bg-indigo-50 text-indigo-600",
  },
  {
    label: "Stored files",
    value: "48",
    description: "Protected in your workspace",
    icon: Files,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "Expiring soon",
    value: "03",
    description: "Within the next 24 hours",
    icon: Clock3,
    iconClassName: "bg-amber-50 text-amber-600",
  },
  {
    label: "Secure shares",
    value: "24",
    description: "Created this month",
    icon: ShieldCheck,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
];

const recentActivity = [
  {
    title: "Secure link created",
    description: "Project-brief.pdf",
    time: "12 minutes ago",
    icon: Link2,
    iconClassName: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "File uploaded",
    description: "Financial-report.xlsx",
    time: "2 hours ago",
    icon: Upload,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    title: "Secure link opened",
    description: "Design-assets.zip",
    time: "Yesterday",
    icon: FileKey2,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
];

const expiringLinks = [
  {
    name: "Project proposal.pdf",
    expiresIn: "Expires in 4 hours",
  },
  {
    name: "Client credentials.txt",
    expiresIn: "Expires tomorrow",
  },
  {
    name: "Design-assets.zip",
    expiresIn: "Expires tomorrow",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page introduction */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            Manage your encrypted files and shared links.
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Welcome back
          </h2>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          <Plus size={17} />
          Create secure link
        </button>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* Main dashboard grid */}
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        {/* Recent activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-950">
                Recent activity
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Your latest workspace actions.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
            >
              View all
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="mt-6 divide-y divide-slate-100">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  key={`${activity.title}-${activity.description}`}
                  className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.iconClassName}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {activity.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {activity.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-slate-400">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-950">
                Security status
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Your workspace is protected.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-sm font-semibold text-emerald-800">
                All systems secure
              </p>
            </div>

            <p className="mt-2 text-xs leading-5 text-emerald-700">
              Your files are encrypted and your secure links are being
              monitored.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <SecurityItem label="Local file encryption" />
            <SecurityItem label="Secure link protection" />
            <SecurityItem label="Account protection" />
          </div>
        </div>
      </section>

      {/* Expiring links */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-slate-950">Expiring soon</h3>
            <p className="mt-1 text-sm text-slate-500">
              Links that will become unavailable soon.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 self-start text-sm font-medium text-indigo-600 transition hover:text-indigo-700 sm:self-auto"
          >
            Manage links
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {expiringLinks.map((link) => (
            <div
              key={link.name}
              className="rounded-xl border border-slate-200 p-4 transition hover:border-amber-200 hover:bg-amber-50/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Clock3 size={17} />
                </div>

                <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700">
                  Expiring
                </span>
              </div>

              <p className="mt-4 truncate text-sm font-medium text-slate-800">
                {link.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">{link.expiresIn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid gap-4 md:grid-cols-2">
        <QuickAction
          icon={Upload}
          title="Upload a file"
          description="Store a file securely in your workspace."
          action="Upload file"
        />

        <QuickAction
          icon={Link2}
          title="Create a secure link"
          description="Share sensitive information with controlled access."
          action="Create link"
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function SecurityItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <ShieldCheck size={12} />
      </span>
      {label}
    </div>
  );
}

type QuickActionProps = {
  icon: typeof Upload;
  title: string;
  description: string;
  action: string;
};

function QuickAction({
  icon: Icon,
  title,
  description,
  action,
}: QuickActionProps) {
  return (
    <button
      type="button"
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
          {action}
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </button>
  );
}
