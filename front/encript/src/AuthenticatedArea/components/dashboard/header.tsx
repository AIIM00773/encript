import {
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Globe2,
  KeyRound,
  LogOut,
  Mail,
  Menu,
  Moon,
  Phone,
  Settings,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useUser, type User as EncriptUser } from "../../../Providers/User";

type HeaderProps = {
  activeView: string;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};

type AccountPanel = "profile" | "settings";

const container = "mx-auto w-full max-w-[1600px] px-5 sm:px-7 lg:px-8 xl:px-10";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getUserName(user: EncriptUser | null | undefined) {
  if (!user) return "Account";

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`
    .trim()
    .replace(/\s+/g, " ");

  return fullName || user.username || "Account";
}

function getInitials(user: EncriptUser | null | undefined) {
  const name = getUserName(user);

  if (name === "Account") return "A";

  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

function getAccountStatus(user: EncriptUser | null | undefined) {
  if (!user) {
    return {
      label: "Account unavailable",
      description: "Sign in to access your workspace",
      color: "zinc",
    };
  }

  if (user.status === "suspended") {
    return {
      label: "Account suspended",
      description: "Some workspace features are unavailable",
      color: "red",
    };
  }

  if (user.status === "pending") {
    return {
      label: "Verification pending",
      description: "Complete your account verification",
      color: "amber",
    };
  }

  return {
    label: "Account protected",
    description: "Your private workspace is active",
    color: "emerald",
  };
}

/* -------------------------------------------------------------------------- */
/* Small UI primitives                                                        */
/* -------------------------------------------------------------------------- */

function CardDivider() {
  return <div className="h-px bg-white/[0.06]" />;
}

function StatusDot({ active = true }: { active?: boolean }) {
  return (
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        active
          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]"
          : "bg-zinc-700"
      }`}
    />
  );
}

function DetailRow({
  icon,
  label,
  value,
  verified,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  verified?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.025]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.035] text-zinc-500">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-600">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs text-zinc-300">
          {value || "Not provided"}
        </p>
      </div>

      {verified && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/[0.08] text-emerald-400">
          <Check size={11} strokeWidth={2.5} />
        </span>
      )}
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-white/[0.025]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.035] text-zinc-500">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-zinc-300">{title}</p>
        <p className="mt-0.5 max-w-[230px] text-[10px] leading-relaxed text-zinc-600">
          {description}
        </p>
      </div>

      <button
        type="button"
        aria-pressed={enabled}
        onClick={onToggle}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          enabled ? "bg-red-500" : "bg-zinc-800"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Profile card                                                               */
/* -------------------------------------------------------------------------- */

function ProfileCard({
  user,
  onClose,
}: {
  user: EncriptUser | null;
  onClose: () => void;
}) {
  return (
    <div className="w-full">
      {/* Contact */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.018]">
        <div className="border-b border-white/[0.05] px-3 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
            Account information
          </p>
        </div>

        <div className="p-1.5">
          <DetailRow
            icon={<Mail size={14} />}
            label="Email"
            value={user?.email || ""}
            verified={user?.isEmailVerified}
          />
          <DetailRow
            icon={<Phone size={14} />}
            label="Phone"
            value={user?.phone || ""}
            verified={user?.isPhoneVerified}
          />
          <DetailRow
            icon={<Globe2 size={14} />}
            label="Country"
            value={user?.country || ""}
          />
        </div>
      </div>

      {/* Bio */}
      {user?.bio && (
        <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
            About
          </p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            {user.bio}
          </p>
        </div>
      )}

      {/* Verification */}
      <div className="mt-4 rounded-2xl border border-emerald-400/[0.10] bg-emerald-400/[0.025] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-emerald-400">
            <ShieldCheck size={17} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-300">
              Identity protected
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-emerald-400/50">
              Your Encript account is protected and your private workspace is
              active.
            </p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniInfo
          label="Language"
          value={user?.language?.toUpperCase() || "EN"}
        />
        <MiniInfo label="Timezone" value={user?.timezone || "Not set"} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Settings card                                                              */
/* -------------------------------------------------------------------------- */

function SettingsCard({
  user,
  onClose,
}: {
  user: EncriptUser | null;
  onClose: () => void;
}) {
  const { updateUser } = useUser();
  const preferences = user?.preferences;

  const updatePreference = (
    key: keyof NonNullable<EncriptUser["preferences"]>
  ) => {
    if (!user?.preferences) return;
    updateUser({
      preferences: { ...user.preferences, [key]: !user.preferences[key] },
    });
  };

  return (
    <div className="w-full">
      {/* Preferences */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.018]">
        <div className="border-b border-white/[0.05] px-3 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
            Preferences
          </p>
        </div>

        <div className="p-1.5">
          <SettingRow
            icon={<Bell size={15} />}
            title="Email notifications"
            description="Receive important account and workspace updates."
            enabled={Boolean(preferences?.emailNotifications)}
            onToggle={() => updatePreference("emailNotifications")}
          />
          <SettingRow
            icon={<ShieldCheck size={15} />}
            title="Security notifications"
            description="Get notified about important security events."
            enabled={Boolean(preferences?.securityNotifications)}
            onToggle={() => updatePreference("securityNotifications")}
          />
          <SettingRow
            icon={<Mail size={15} />}
            title="Product updates"
            description="Occasional news and product announcements."
            enabled={Boolean(preferences?.marketingEmails)}
            onToggle={() => updatePreference("marketingEmails")}
          />
          <SettingRow
            icon={<Moon size={15} />}
            title="Dark interface"
            description="Keep Encript's dark workspace appearance."
            enabled={Boolean(preferences?.darkMode)}
            onToggle={() => updatePreference("darkMode")}
          />
        </div>
      </section>

      {/* Security */}
      <section className="mt-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.018]">
        <div className="border-b border-white/[0.05] px-3 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
            Security
          </p>
        </div>

        <div className="p-1.5">
          <SettingLink
            icon={<KeyRound size={15} />}
            title="Password"
            description="Manage your account credentials"
          />
          <SettingLink
            icon={<ShieldCheck size={15} />}
            title="Account protection"
            description="Review your verification status"
            status="Protected"
          />
        </div>
      </section>

      {/* Locale */}
      <section className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.035] text-zinc-500">
            <Globe2 size={15} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-300">Region</p>
            <p className="mt-0.5 text-[10px] text-zinc-600">
              Language and timezone
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-medium text-zinc-400">
              {user?.language?.toUpperCase() || "EN"}
            </p>
            <p className="mt-0.5 max-w-[110px] truncate text-[9px] text-zinc-700">
              {user?.timezone || "Not configured"}
            </p>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-400/[0.08] bg-red-400/[0.02] p-4">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-400/[0.06] text-red-400">
          <ShieldCheck size={14} />
        </div>

        <div>
          <p className="text-[11px] font-medium text-zinc-300">
            Privacy comes first
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-zinc-600">
            Encript keeps privacy controls close to your workspace instead of
            hiding them behind separate account pages.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Settings helpers                                                           */
/* -------------------------------------------------------------------------- */

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.018] px-3 py-2.5">
      <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-700">
        {label}
      </p>
      <p className="mt-1 truncate text-[10px] text-zinc-400">{value}</p>
    </div>
  );
}

function SettingLink({
  icon,
  title,
  description,
  status,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  status?: string;
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/[0.035]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.035] text-zinc-500 transition-colors group-hover:bg-white/[0.06] group-hover:text-zinc-300">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-zinc-300">
          {title}
        </span>
        <span className="mt-0.5 block truncate text-[10px] text-zinc-600">
          {description}
        </span>
      </span>

      {status ? (
        <span className="flex items-center gap-1.5 text-[9px] text-emerald-400/70">
          <StatusDot />
          {status}
        </span>
      ) : (
        <ChevronRight
          size={14}
          className="shrink-0 text-zinc-700 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500"
        />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Account switcher                                                           */
/* -------------------------------------------------------------------------- */

function AccountPanel({
  user,
  panel,
  setPanel,
  onClose,
  onLogout,
}: {
  user: EncriptUser | null;
  panel: AccountPanel;
  setPanel: (panel: AccountPanel) => void;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div
      className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(430px,calc(100vw-24px))] overflow-hidden rounded-sm border border-white/[0.08] bg-[#101214]/[0.985] shadow-[0_30px_100px_rgba(0,0,0,0.62)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-1 duration-150"
      role="dialog"
      aria-label="Account controls"
    >
      {/* Top accent */}
      <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

      {/* Tabs */}
      <div className="border-b border-white/[0.06] px-3 pt-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-1">
          <AccountTab
            active={panel === "profile"}
            icon={<User size={14} />}
            label="Profile"
            onClick={() => setPanel("profile")}
          />
          <AccountTab
            active={panel === "settings"}
            icon={<Settings size={14} />}
            label="Settings"
            onClick={() => setPanel("settings")}
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-white/[0.05] hover:text-zinc-300"
        >
          <X size={15} />
        </button>
      </div>

      {/* Card content */}
      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/[0.08] max-h-[calc(100vh-190px)] overflow-y-auto p-4">
        {panel === "profile" ? (
          <ProfileCard user={user} onClose={onClose} />
        ) : (
          <SettingsCard user={user} onClose={onClose} />
        )}
      </div>

      {/* Footer */}
      <CardDivider />

      <div className="p-2">
        <button
          type="button"
          onClick={onLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-red-500/[0.055]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/[0.05] text-red-400/70 transition-colors group-hover:bg-red-500/[0.08] group-hover:text-red-400">
            <LogOut size={15} />
          </span>

          <span className="flex-1">
            <span className="block text-xs font-medium text-zinc-400 transition-colors group-hover:text-red-300">
              Sign out
            </span>
            <span className="mt-0.5 block text-[10px] text-zinc-700">
              End this Encript session
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

function AccountTab({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-t-lg px-3 py-2.5 text-xs font-medium transition-colors ${
        active ? "text-zinc-100" : "text-zinc-600 hover:text-zinc-300"
      }`}
    >
      {icon}
      {label}
      {active && (
        <span className="absolute inset-x-2 bottom-0 h-px bg-red-400" />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export default function Header({
  activeView,
  menuOpen,
  setMenuOpen,
}: HeaderProps) {
  const { user, isAuthenticated, signOut } = useUser();
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountPanel, setAccountPanel] = useState<AccountPanel>("profile");
  const accountRef = useRef<HTMLDivElement>(null);
  
  const initials = getInitials(user);
  const userName = getUserName(user);

  /* ------------------------------------------------------------------------ */
  /* Close account panel when clicking outside                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!accountOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!accountRef.current?.contains(target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [accountOpen]);

  /* ------------------------------------------------------------------------ */
  /* Close account panel after authentication changes                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!isAuthenticated) {
      setAccountOpen(false);
    }
  }, [isAuthenticated]);

  /* ------------------------------------------------------------------------ */
  /* Account controls                                                         */
  /* ------------------------------------------------------------------------ */

  const handleLogout = () => {
    setAccountOpen(false);
    /*
     * UserProvider owns authentication state and token cleanup.
     * The header should not duplicate that responsibility.
     */
    signOut();
  };

  return (
    <header className="relative z-30 shrink-0 border-b border-white/[0.06] bg-[#070809]/90 backdrop-blur-xl">
      <div className={`${container} flex h-[76px] items-center justify-between gap-4`}>
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="-ml-2.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-white lg:hidden"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>

          {/* Mobile brand */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="leading-none">
              <div className="text-[15px] font-semibold tracking-tight text-white">
                en<span className="text-red-500">cript</span>
              </div>
              <div className="mt-1 text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                Secure channels
              </div>
            </div>
          </div>

          <div className="hidden h-8 w-px bg-white/[0.07] sm:block lg:hidden" />

          {/* Workspace */}
          <div className="hidden min-w-0 sm:block">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Secure workspace
            </p>
            <p className="mt-0.5 truncate text-sm font-medium text-zinc-300">
              {activeView}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="relative flex shrink-0 items-center gap-2">
          {/* Notifications */}
          <button
            type="button"
            aria-label="Open notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.025] text-zinc-500 transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white"
          >
            <Bell size={16} strokeWidth={1.8} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          </button>

          <div className="mx-1 h-5 w-px bg-white/[0.07]" />

          {/* Account */}
          <div ref={accountRef} className="relative">
            <button
              type="button"
              aria-label={`Open account controls for ${userName}`}
              aria-expanded={accountOpen}
              aria-haspopup="dialog"
              onClick={() => {
                setAccountOpen((open) => !open);
              }}
              className={`flex items-center gap-1.5 rounded-full p-1.5 transition-all duration-200 ${
                accountOpen ? "bg-white/[0.07]" : "hover:bg-white/[0.035]"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-800 text-[11px] font-semibold text-white shadow-[0_0_18px_rgba(239,68,68,0.14)] ring-1 transition-all ${
                  accountOpen ? "ring-red-400/40" : "ring-white/[0.08]"
                }`}
              >
                {initials}
              </div>
              <ChevronDown
                size={13}
                className={`mr-1 hidden text-zinc-600 transition-transform sm:block ${
                  accountOpen ? "rotate-180 text-zinc-400" : ""
                }`}
              />
            </button>

            {accountOpen && (
              <AccountPanel
                user={user}
                panel={accountPanel}
                setPanel={setAccountPanel}
                onClose={() => setAccountOpen(false)}
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}