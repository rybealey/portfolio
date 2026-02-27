"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signInWithMagicLink, type AuthState } from "@/app/actions/auth";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [magicState, magicAction, magicPending] = useActionState<AuthState, FormData>(
    signInWithMagicLink,
    null
  );

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  const magicError = magicState?.error;

  return (
    <div className="flex w-full flex-col gap-10">
      {/* Form header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-[28px] font-bold text-text-primary">Sign in</h1>
        <p className="text-sm leading-relaxed text-text-secondary">
          Enter your credentials to access the admin dashboard.
        </p>
      </div>

      {/* Password sign-in form */}
      <form onSubmit={handleSignIn} className="flex flex-col gap-6">
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
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="h-[18px] w-[18px]" />
              ) : (
                <EyeOff className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
        </div>

        {/* Options row */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border border-border-light bg-bg-card-alt accent-brand"
            />
            <span className="text-sm text-text-secondary">Remember me</span>
          </label>
          <button type="button" className="text-sm font-medium text-brand hover:opacity-80 transition-opacity">
            Forgot password?
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="font-mono text-xs text-red-400">{error}</p>
        )}

        {/* Sign in button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 font-semibold text-[15px] text-bg-dark transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight className="h-[18px] w-[18px]" />}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border-light" />
        <span className="font-mono text-[10px] font-semibold tracking-[2px] text-text-muted">OR</span>
        <div className="h-px flex-1 bg-border-light" />
      </div>

      {/* Magic link form */}
      <form action={magicAction}>
        <input type="hidden" name="magic_email" value={email} />
        {magicState?.success ? (
          <p className="text-center font-mono text-sm text-brand">
            ✓ Magic link sent — check your inbox.
          </p>
        ) : (
          <>
            {magicError && (
              <p className="mb-3 font-mono text-xs text-red-400">{magicError}</p>
            )}
            <button
              type="submit"
              disabled={magicPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-light px-6 py-3.5 text-sm font-medium text-text-secondary transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
            >
              <Sparkles className="h-[18px] w-[18px]" />
              {magicPending ? "Sending link..." : "Sign in with magic link"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
