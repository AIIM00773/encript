import { useEffect } from "react";

type IconProps = {
  size?: number;
  className?: string;
};

type IconComponent = (props: IconProps) => React.JSX.Element;

const iconDefaults = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function ShieldCheck({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LockKeyhole({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M12 13v3" />
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

function ActivityIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M5 3v14" />
      <path d="M12 3v8" />
      <path d="M19 3v18" />
    </svg>
  );
}

function SettingsIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="m11 10.27-4-6.93" />
      <path d="m11 13.73-4 6.93" />
      <path d="M12 22v-2" />
      <path d="M12 2v2" />
      <path d="M14 12h8" />
      <path d="m17 20.66-1-1.73" />
      <path d="m17 3.34-1 1.73" />
      <path d="M2 12h2" />
      <path d="m20.66 17-1.73-1" />
      <path d="m20.66 7-1.73 1" />
      <path d="m3.34 17 1.73-1" />
      <path d="m3.34 7 1.73 1" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function HomeIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function PlusIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 .83.18 2 2 0 0 0 .83-.18l8.58-3.9a1 1 0 0 0 0-1.831z" />
      <path d="M16 17h6" />
      <path d="M19 14v6" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 .825.178" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l2.116-.962" />
    </svg>
  );
}

function MessageIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function UsersIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M17 21v-1a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1" />
      <path d="M19 10h1a2 2 0 0 1 2 2v1" />
      <path d="M5 10H4a2 2 0 0 0-2 2v1" />
      <circle cx="12" cy="11" r="3" />
      <circle cx="18" cy="4" r="2" />
      <circle cx="6" cy="4" r="2" />
    </svg>
  );
}

function DecryptionKeysIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M4 12v6" />
      <path d="M4 14h2" />
      <path d="M9.65 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v4" />
      <circle cx="4" cy="20" r="2" />
    </svg>
  );
}

function ActiveLinkIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function MenuToggleOpen({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m10 8 4 4-4 4" />
    </svg>
  );
}

function MenuToggleClose({ size = 24, className }: IconProps) {
  return (
    <svg
      {...iconDefaults}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m14 16-4-4 4-4" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type View =
  | "Dashboard"
  | "Active Links"
  | "Decryption Keys"
  | "Create handoff"
  | "Activity"
  | "Settings"
  | "Live Chat"
  | "Community";

type SidebarProps = {
  changeView: (view: View) => void;
  activeView: View;
  navigateOutside: (path: string) => void;

  /** Mobile drawer state */
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void;

  /** Desktop sidebar state */
  siderMinimized: boolean;
  onToggleMinimized: () => void;
};

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

const navigation: { label: View; icon: IconComponent }[] = [
  {
    label: "Dashboard",
    icon: HomeIcon,
  },
  {
    label: "Active Links",
    icon: ActiveLinkIcon,
  },
  {
    label: "Decryption Keys",
    icon: DecryptionKeysIcon,
  },
  {
    label: "Create handoff",
    icon: PlusIcon,
  },
  {
    label: "Activity",
    icon: ActivityIcon,
  },
  {
    label: "Settings",
    icon: SettingsIcon,
  },
  {
    label: "Live Chat",
    icon: MessageIcon,
  },
  {
    label: "Community",
    icon: UsersIcon,
  },
];

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const SIDEBAR_WIDTH = "lg:w-[248px]";
const SIDEBAR_MIN_WIDTH = "lg:w-[64px]";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 focus-visible:ring-offset-0";

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */

export default function Sidebar({
  changeView,
  activeView,
  navigateOutside,
  open = false,
  onClose,
  onOpen,
  siderMinimized,
  onToggleMinimized,
}: SidebarProps) {
  /* ------------------------------------------------------------------------ */
  /* Mobile keyboard handling                                                 */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!open || !onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  /* ------------------------------------------------------------------------ */
  /* Navigation                                                               */
  /* ------------------------------------------------------------------------ */

  const handleNavigation = (view: View) => {
    changeView(view);

    // Only relevant on mobile. On desktop this is a no-op.
    onClose?.();
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Mobile overlay                                                     */}
      {/* ------------------------------------------------------------------ */}

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Sidebar                                                             */}
      {/* ------------------------------------------------------------------ */}

      <aside
        aria-label="Sidebar"
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          border-r border-white/[0.06]
          bg-[#090a0c]
          shadow-[8px_0_30px_rgba(0,0,0,0.18)]
          transition-[width,transform,visibility]
          duration-200
          ease-out

          ${siderMinimized ? SIDEBAR_MIN_WIDTH : SIDEBAR_WIDTH}

          ${
            open
              ? "visible w-[248px] translate-x-0"
              : "invisible w-[248px] -translate-x-full lg:visible lg:translate-x-0"
          }
        `}
      >
        {/* ================================================================ */}
        {/* Header                                                           */}
        {/* ================================================================ */}

        <header
          className={`
            relative
            flex h-[76px]
            shrink-0
            items-center
            border-b border-white/[0.06]
            transition-[padding]
            duration-200

            ${
              siderMinimized
                ? "lg:justify-center lg:px-2"
                : "lg:justify-between lg:px-4"
            }

            max-lg:justify-between
            max-lg:px-4
          `}
        >
          {/* Brand */}

          <div
            className={`
              flex min-w-0 items-center gap-3
              overflow-hidden
              transition-[width,opacity]
              duration-200

              ${
                siderMinimized
                  ? "lg:pointer-events-none lg:w-0 lg:opacity-0"
                  : "lg:w-auto lg:opacity-100"
              }

              ${
                open
                  ? "max-lg:w-auto max-lg:opacity-100"
                  : "max-lg:pointer-events-none max-lg:w-0 max-lg:opacity-0"
              }
            `}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-[0_0_24px_rgba(220,38,38,0.22)]">
              <LockKeyhole size={18} />
            </div>

            <div className="min-w-0 leading-none">
              <div className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-white">
                en<span className="text-blue-500">cript</span>
              </div>

              <div className="mt-1 whitespace-nowrap text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                Secure channels
              </div>
            </div>
          </div>

          {/* Desktop collapse / expand */}

          <button
            type="button"
            onClick={onToggleMinimized}
            aria-label={
              siderMinimized
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            aria-expanded={!siderMinimized}
            className={`
              hidden
              h-10 w-10
              shrink-0
              items-center justify-center
              rounded-xl
              text-zinc-500
              transition
              hover:bg-white/[0.06]
              hover:text-white
              lg:flex
              ${focusRing}
            `}
          >
            {siderMinimized ? (
              <MenuToggleOpen size={18} />
            ) : (
              <MenuToggleClose size={18} />
            )}
          </button>

          {/* Mobile open / close */}

          <button
            type="button"
            onClick={open ? onClose : onOpen}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`
              flex
              h-10 w-10
              shrink-0
              items-center justify-center
              rounded-xl
              text-zinc-500
              transition
              hover:bg-white/[0.06]
              hover:text-white
              lg:hidden
              ${focusRing}
            `}
          >
            {open ? (
              <MenuToggleClose size={18} />
            ) : (
              <MenuToggleOpen size={18} />
            )}
          </button>
        </header>

        {/* ================================================================ */}
        {/* Navigation                                                       */}
        {/* ================================================================ */}

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-6">
          {/* Section label */}

          <p
            className={`
              mb-3
              overflow-hidden
              px-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-zinc-700
              transition-[height,opacity,margin]
              duration-200

              ${
                siderMinimized
                  ? "lg:h-0 lg:mb-0 lg:opacity-0"
                  : "lg:h-auto lg:opacity-100"
              }

              ${
                open
                  ? "max-lg:h-auto max-lg:opacity-100"
                  : "max-lg:h-0 max-lg:mb-0 max-lg:opacity-0"
              }
            `}
          >
            Workspace
          </p>

          <nav
            aria-label="Workspace navigation"
            className="space-y-2"
          >
            {navigation.map(({ label, icon: Icon }) => {
              const isActive = activeView === label;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleNavigation(label)}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={
                    siderMinimized ? label : undefined
                  }
                  title={
                    siderMinimized ? label : undefined
                  }
                  className={`
                    group
                    flex
                    h-11
                    w-full
                    items-center
                    rounded-xl
                    border
                    px-2
                    text-left
                    text-sm
                    transition-all
                    duration-200
                    ${focusRing}

                    ${
                      siderMinimized
                        ? "lg:justify-center lg:gap-0"
                        : "lg:justify-start lg:gap-3"
                    }

                    ${
                      open
                        ? "max-lg:justify-start max-lg:gap-3"
                        : "max-lg:justify-center max-lg:gap-0"
                    }

                    ${
                      isActive
                        ? "border-red-500/10 bg-red-500/[0.09] text-white"
                        : "border-transparent text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-200"
                    }
                  `}
                >
                  <Icon
                    size={17}
                    className={`
                      shrink-0
                      transition-colors
                      ${
                        isActive
                          ? "text-red-400"
                          : "text-zinc-600 group-hover:text-zinc-400"
                      }
                    `}
                  />

                  {/* Navigation label */}

                  <span
                    className={`
                      min-w-0
                      overflow-hidden
                      whitespace-nowrap
                      transition-[width,opacity]
                      duration-200

                      ${
                        siderMinimized
                          ? "lg:pointer-events-none lg:w-0 lg:opacity-0"
                          : "lg:w-auto lg:opacity-100"
                      }

                      ${
                        open
                          ? "max-lg:w-auto max-lg:opacity-100"
                          : "max-lg:pointer-events-none max-lg:w-0 max-lg:opacity-0"
                      }
                    `}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ================================================================ */}
        {/* Security footer                                                  */}
        {/* ================================================================ */}

        <footer className="shrink-0 p-3">
          <div
            className={`
              relative
              overflow-hidden
              rounded-2xl
              border border-red-500/10
              bg-gradient-to-br
              from-red-500/[0.08]
              to-transparent
              transition-[padding]
              duration-200

              ${
                siderMinimized
                  ? "lg:flex lg:justify-center lg:p-3"
                  : "lg:p-4"
              }

              ${
                open
                  ? "max-lg:p-4"
                  : "max-lg:flex max-lg:justify-center max-lg:p-3"
              }
            `}
          >
            {/* Decorative glow */}

            <div
              aria-hidden="true"
              className="
                absolute
                -right-8
                -top-8
                h-24
                w-24
                rounded-full
                bg-red-600/[0.07]
                blur-2xl
              "
            />

            <div
              className={`
                relative
                flex
                items-center

                ${
                  siderMinimized
                    ? "lg:justify-center lg:gap-0"
                    : "lg:gap-3"
                }

                ${
                  open
                    ? "max-lg:gap-3"
                    : "max-lg:justify-center max-lg:gap-0"
                }
              `}
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-red-500/15
                  bg-red-500/10
                  text-red-400
                "
              >
                <ShieldCheck size={15} />
              </div>

              {/* Footer label */}

              <p
                className={`
                  overflow-hidden
                  whitespace-nowrap
                  text-[11px]
                  leading-5
                  text-zinc-400
                  transition-[width,opacity]
                  duration-200

                  ${
                    siderMinimized
                      ? "lg:pointer-events-none lg:w-0 lg:opacity-0"
                      : "lg:w-auto lg:opacity-100"
                  }

                  ${
                    open
                      ? "max-lg:w-auto max-lg:opacity-100"
                      : "max-lg:pointer-events-none max-lg:w-0 max-lg:opacity-0"
                  }
                `}
              >
                End-to-end encryption
              </p>
            </div>
          </div>
        </footer>
      </aside>
    </>
  );
}