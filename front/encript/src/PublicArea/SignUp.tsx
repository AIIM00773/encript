import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

type SignupForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: SignupForm = {
  email: "",
  password: "",
  confirmPassword: "",
};

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
        encript - <span className="text-green-500 "> SIGNUP </span>
      </span>
    </Link>
  );
}

function PasswordRequirement({
  met,
  children,
}: {
  met: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[11px] transition-colors ${
        met ? "text-emerald-400/80" : "text-zinc-600"
      }`}
    >
      <span
        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors ${
          met
            ? "border-emerald-400/40 bg-emerald-400/10"
            : "border-white/[0.08] bg-white/[0.02]"
        }`}
      >
        {met && <Check size={9} strokeWidth={2.5} />}
      </span>

      {children}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const [form, setForm] = useState<SignupForm>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const updateField = (field: keyof SignupForm, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validate = () => {
    const email = form.email.trim();

    if (!email) {
      return "Enter your email address.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Enter a valid email address.";
    }

    if (!form.password) {
      return "Create a password.";
    }

    if (form.password.length < 8) {
      return "Your password must contain at least 8 characters.";
    }

    if (!form.confirmPassword) {
      return "Confirm your password.";
    }

    if (form.password !== form.confirmPassword) {
      return "Your passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const backendError =
          data?.detail ||
          data?.email?.[0] ||
          data?.password?.[0] ||
          "Unable to create your account.";

        throw new Error(backendError);
      }

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Your encript account has been created. You can now sign in.",
        },
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "h-[52px] w-full rounded-[14px] border border-white/[0.08] bg-white/[0.025] pl-11 pr-4 text-[14px] text-zinc-100 outline-none transition-all placeholder:text-zinc-700 hover:border-white/[0.13] focus:border-red-400/45 focus:bg-red-500/[0.025] focus:ring-4 focus:ring-red-500/[0.07] disabled:cursor-not-allowed disabled:opacity-50";

  const passwordLengthMet = form.password.length >= 8;
  const passwordsMatch =
    form.confirmPassword.length > 0 &&
    form.password === form.confirmPassword;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090b0d] text-zinc-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-240px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-500/[0.035] blur-[120px]" />

        <div className="absolute bottom-[-260px] left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-orange-500/[0.02] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-20">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Brand />

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-zinc-600 sm:block">
              Already have an account?
            </span>

            <Link
              to="/login"
              className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="relative z-10 flex items-center justify-center px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="w-full max-w-[430px]">
       
          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-500/[0.055] px-4 py-3.5 text-[13px] leading-5 text-red-300"
            >
              <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-400/30 text-[11px] font-semibold">
                !
              </span>

              <span>{error}</span>
            </div>
          )}

          {/* Card */}
          <div className="relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#101214]/95 p-6 shadow-[0_35px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-7">
            {/* Accent */}
            <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

            <div className="pointer-events-none absolute -right-28 -top-28 h-56 w-56 rounded-full bg-red-500/[0.045] blur-3xl" />

            <form
              onSubmit={handleSubmit}
              className="relative space-y-5"
              noValidate
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.09em] text-zinc-500"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-red-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    disabled={loading}
                    className={inputClassName}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.09em] text-zinc-500"
                >
                  Password
                </label>

                <div className="group relative">
                  <LockKeyhole
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-red-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    placeholder="Create a password"
                    disabled={loading}
                    className={`${inputClassName} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    disabled={loading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[10px] text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300 disabled:cursor-not-allowed"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {/* Password requirements */}
                <div className="mt-2.5 flex items-center gap-4">
                  <PasswordRequirement met={passwordLengthMet}>
                    8+ characters
                  </PasswordRequirement>

                  <PasswordRequirement met={/[A-Z]/.test(form.password)}>
                    Uppercase
                  </PasswordRequirement>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.09em] text-zinc-500"
                >
                  Confirm password
                </label>

                <div className="group relative">
                  <LockKeyhole
                    size={17}
                    strokeWidth={1.8}
                    className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                      passwordsMatch
                        ? "text-emerald-400"
                        : "text-zinc-600 group-focus-within:text-red-400"
                    }`}
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField("confirmPassword", event.target.value)
                    }
                    placeholder="Confirm your password"
                    disabled={loading}
                    className={`${inputClassName} pr-12 ${
                      passwordsMatch
                        ? "border-emerald-400/25 focus:border-emerald-400/40 focus:ring-emerald-400/[0.06]"
                        : ""
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    disabled={loading}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmed password"
                        : "Show confirmed password"
                    }
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[10px] text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300 disabled:cursor-not-allowed"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                {form.confirmPassword.length > 0 && (
                  <div
                    className={`mt-2 flex items-center gap-1.5 text-[11px] ${
                      passwordsMatch ? "text-emerald-400/80" : "text-red-400/80"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        passwordsMatch ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />

                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </div>
                )}
              </div>

              {/* Terms */}
              <p className="pt-1 text-[11px] leading-[18px] text-zinc-600">
                By creating an account, you agree to the Encript{" "}
                <Link
                  to="/terms"
                  className="text-zinc-400 underline decoration-white/10 underline-offset-2 transition-colors hover:text-red-400"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-zinc-400 underline decoration-white/10 underline-offset-2 transition-colors hover:text-red-400"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-1 flex h-[52px] w-full items-center justify-center overflow-hidden rounded-xl bg-red-500 text-[13px] font-semibold text-white shadow-[0_12px_35px_rgba(239,68,68,0.16)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-red-400 hover:shadow-[0_15px_42px_rgba(239,68,68,0.23)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight
                      size={16}
                      className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-zinc-600">
            <ShieldCheck
              size={13}
              strokeWidth={1.8}
              className="text-emerald-500/70"
            />

            <span>Private by design</span>

            <span className="text-zinc-800">•</span>

            <span>Your data. Your control.</span>
          </div>

          {/* Mobile sign-in */}
          <p className="mt-5 text-center text-[12px] text-zinc-600 sm:hidden">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}