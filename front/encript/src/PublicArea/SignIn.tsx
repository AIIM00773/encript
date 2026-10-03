
import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useUser } from "../Providers/User";

type LoginForm = {
  email: string;
  password: string;
};

type LoginResponse = {
  access?: string;
  refresh?: string;
  detail?: string;
  email?: string[];
  password?: string[];
};

type LocationState = {
  message?: string;
};

const API_URL = import.meta.env.VITE_API_URL;

const ACCESS_TOKEN_KEY = "keynest_access_token";
const REFRESH_TOKEN_KEY = "keynest_refresh_token";

function Brand() {
  return (
    <Link
      to="/"
      aria-label="Encript home"
      className="group inline-flex items-center gap-2.5"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/[0.08] text-red-400 transition-all duration-200 group-hover:border-red-400/30 group-hover:bg-red-500/[0.12]">
        <LockKeyhole size={17} strokeWidth={1.8} />
      </span>

      <span className="text-sm font-semibold tracking-[0.01em] text-zinc-100">
        encript - <span className="text-green-500 "> LOGIN </span>
      </span>
    </Link>
  );
}

export default function Login() {
  const { isAuthenticated } = useUser();

  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const updateField = (field: keyof LoginForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      return "Enter your email address.";
    }

    if (!form.password) {
      return "Enter your password.";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        const backendError =
          data.detail ||
          data.email?.[0] ||
          data.password?.[0] ||
          "Invalid email or password.";

        throw new Error(backendError);
      }

      if (!data.access || !data.refresh) {
        throw new Error(
          "The server returned an invalid authentication response.",
        );
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);

      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign you in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#090b0d] text-white selection:bg-red-500/30">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-48 -top-56 h-[600px] w-[760px] rounded-full bg-red-500/[0.055] blur-[150px]" />

        <div className="absolute -right-48 top-[40%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.025] blur-[130px]" />

        <div className="absolute bottom-[-220px] left-[35%] h-[400px] w-[520px] rounded-full bg-red-500/[0.025] blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-20">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
         
          <Brand /> 
        
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-zinc-600 sm:block">
              Don't have an account?
            </span>

            <Link
              to="/signup"
              className="inline-flex items-center rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition-all hover:border-white/[0.15] hover:bg-white/[0.055] hover:text-white"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="relative z-10 flex min-h-[calc(100dvh-72px)] items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-[430px]">

          {/* Success */}
          {state?.message && (
            <div
              role="status"
              className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.045] px-4 py-3.5 text-xs leading-5 text-emerald-200"
            >
              <Check
                size={15}
                strokeWidth={2.5}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <span>{state.message}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.045] px-4 py-3.5 text-xs leading-5 text-red-200"
            >
              <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-300/25 text-[10px] font-semibold text-red-300">
                !
              </span>

              <span>{error}</span>
            </div>
          )}

          {/* Login card */}
          <div className="relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#101214]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-7">
            {/* Top accent */}
            <div
              aria-hidden="true"
              className="absolute inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-red-400/60 to-transparent"
            />

            {/* Card glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-red-500/[0.045] blur-3xl"
            />

            <form onSubmit={handleSubmit} className="relative space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail
                    size={16}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-red-300"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    required
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    disabled={loading}
                    className="h-[50px] w-full rounded-[14px] border border-white/[0.07] bg-white/[0.02] pl-11 pr-4 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-700 hover:border-white/[0.12] focus:border-red-400/30 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/[0.045] disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-medium text-zinc-600 transition-colors hover:text-red-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="group relative">
                  <LockKeyhole
                    size={16}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-red-300"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    placeholder="Enter your password"
                    disabled={loading}
                    className="h-[50px] w-full rounded-[14px] border border-white/[0.07] bg-white/[0.02] pl-11 pr-12 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-700 hover:border-white/[0.12] focus:border-red-400/30 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/[0.045] disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={loading}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[10px] text-zinc-600 transition-colors hover:bg-white/[0.04] hover:text-zinc-300 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={1.8} />
                    ) : (
                      <Eye size={16} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label className="group flex cursor-pointer items-center gap-2.5 text-[11px] text-zinc-600">
                <input type="checkbox" className="peer sr-only" />

                <span className="flex h-[17px] w-[17px] items-center justify-center rounded-[5px] border border-white/[0.1] bg-white/[0.02] transition-all group-hover:border-white/[0.18] peer-checked:border-red-400/50 peer-checked:bg-red-500">
                  <Check
                    size={10}
                    strokeWidth={3}
                    className="scale-0 text-white transition-transform peer-checked:scale-100"
                  />
                </span>

                Keep me signed in
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-[51px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-500 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(239,68,68,0.16)] transition-all hover:bg-red-400 hover:shadow-[0_12px_40px_rgba(239,68,68,0.24)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Security state */}
            <div className="mt-5 flex items-center justify-center gap-2 border-t border-white/[0.05] pt-5">
              <ShieldCheck
                size={14}
                strokeWidth={1.7}
                className="text-emerald-300"
              />

              <span className="text-[10px] text-zinc-600">
                Secure authentication
              </span>

              <span className="h-1 w-1 rounded-full bg-zinc-800" />

              <span className="text-[10px] text-zinc-600">
                Privacy-first by design
              </span>
            </div>
          </div>

          {/* Signup */}
          <p className="mt-6 text-center text-xs text-zinc-600">
            New to Encript?{" "}
            <Link
              to="/signup"
              className="font-medium text-zinc-400 transition-colors hover:text-red-300"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
