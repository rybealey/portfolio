"use client";

import { useActionState, useState, useEffect } from "react";
import { Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { signInWithMagicLink, type AuthState } from "@/app/actions/auth";

export function RegisterForm() {
  const [email, setEmail] = useState("");

  const [magicState, magicAction, magicPending] = useActionState<AuthState, FormData>(
    signInWithMagicLink,
    null
  );

  useEffect(() => {
    if (magicState?.error) {
      toast.error("Registration failed", { description: magicState.error });
    }
  }, [magicState]);

  return (
    <div className="flex w-full flex-col gap-10">
      {/* Form header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-[28px] font-bold text-text-primary">Create account</h1>
        <p className="text-sm leading-relaxed text-text-secondary">
          Enter your email and we&apos;ll send you a magic link to get started.
        </p>
      </div>

      {/* Magic link form */}
      <form action={magicAction} className="flex flex-col gap-6">
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[11px] font-semibold tracking-[2px] text-text-muted">
            EMAIL
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-border-light bg-bg-card-alt px-4 py-3.5 focus-within:border-brand transition-colors">
            <Mail className="h-[18px] w-[18px] shrink-0 text-text-muted" />
            <input
              type="email"
              name="magic_email"
              required
              placeholder="admin@ry.bealey"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        {magicState?.success ? (
          <p className="text-center font-mono text-sm text-brand">
            ✓ Magic link sent — check your inbox.
          </p>
        ) : (
          <button
            type="submit"
            disabled={magicPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-[15px] font-semibold text-bg-dark transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Sparkles className="h-[18px] w-[18px]" />
            {magicPending ? "Sending link..." : "Send magic link"}
          </button>
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
