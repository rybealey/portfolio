"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signInWithMagicLink, type AuthState } from "@/app/actions/auth";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [magicState, magicAction, magicPending] = useActionState<AuthState, FormData>(
    signInWithMagicLink,
    null
  );

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  return (
    <div className="flex w-full flex-col gap-10">
      {/* Form header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-[28px] font-bold text-text-primary">Create account</h1>
        <p className="text-sm leading-relaxed text-text-secondary">
          Fill in your details to set up your admin access.
        </p>
      </div>

      {/* Sign-up form */}
      <form onSubmit={handleSignUp} className="flex flex-col gap-6">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[11px] font-semibold tracking-[2px] text-text-muted">
            FULL NAME
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-border-light bg-bg-card-alt px-4 py-3.5 focus-within:border-brand transition-colors">
            <User className="h-[18px] w-[18px] shrink-0 text-text-muted" />
            <input
              type="text"
              name="name"
              required
              placeholder="Ry Bealey"
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[11px] font-semibold tracking-[2px] text-text-muted">
            EMAIL
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-border-light bg-bg-card-alt px-4 py-3.5 focus-within:border-brand transition-colors">
            <Mail className="h-[18px] w-[18px] shrink-0 text-text-muted" />
            <input
              type="email"
              name="email"
              required
              placeholder="admin@ry.bealey"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[11px] font-semibold tracking-[2px] text-text-muted">
            PASSWORD
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-border-light bg-bg-card-alt px-4 py-3.5 focus-within:border-brand transition-colors">
            <Lock className="h-[18px] w-[18px] shrink-0 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="••••••••••••"
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="shrink-0 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPassword ? <Eye className="h-[18px] w-[18px]" /> : <EyeOff className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[11px] font-semibold tracking-[2px] text-text-muted">
            CONFIRM PASSWORD
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-border-light bg-bg-card-alt px-4 py-3.5 focus-within:border-brand transition-colors">
            <Lock className="h-[18px] w-[18px] shrink-0 text-text-muted" />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm_password"
              required
              placeholder="••••••••••••"
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="shrink-0 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showConfirm ? <Eye className="h-[18px] w-[18px]" /> : <EyeOff className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border-light bg-bg-card-alt accent-brand"
          />
          <span className="text-sm text-text-secondary">
            I agree to the{" "}
            <span className="text-brand">Terms of Service</span> and{" "}
            <span className="text-brand">Privacy Policy</span>
          </span>
        </label>

        {/* Error */}
        {error && (
          <p className="font-mono text-xs text-red-400">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !agreed}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-[15px] font-semibold text-bg-dark transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
          {!loading && <ArrowRight className="h-[18px] w-[18px]" />}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border-light" />
        <span className="font-mono text-[10px] font-semibold tracking-[2px] text-text-muted">OR</span>
        <div className="h-px flex-1 bg-border-light" />
      </div>

      {/* Magic link */}
      <form action={magicAction}>
        <input type="hidden" name="magic_email" value={email} />
        {magicState?.success ? (
          <p className="text-center font-mono text-sm text-brand">
            ✓ Magic link sent — check your inbox.
          </p>
        ) : (
          <>
            {magicState?.error && (
              <p className="mb-3 font-mono text-xs text-red-400">{magicState.error}</p>
            )}
            <button
              type="submit"
              disabled={magicPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-light px-6 py-3.5 text-sm font-medium text-text-secondary transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
            >
              <Sparkles className="h-[18px] w-[18px]" />
              {magicPending ? "Sending link..." : "Sign up with magic link"}
            </button>
          </>
        )}
      </form>

      {/* Sign in link */}
      <p className="text-center text-sm text-text-muted">
        Already have an account?{" "}
        <a href="/admin" className="font-semibold text-brand hover:opacity-80 transition-opacity">
          Sign in
        </a>
      </p>
    </div>
  );
}
