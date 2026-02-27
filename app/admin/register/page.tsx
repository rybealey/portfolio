import { RegisterForm } from "@/components/admin/register-form";
import { redirectIfAuthenticated } from "@/lib/auth/proxy";
import { createAdminClient } from "@/lib/supabase/server";
import { Lock } from "lucide-react";

export default async function AdminRegisterPage() {
  await redirectIfAuthenticated();

  const admin = createAdminClient();
  const { data } = await admin.auth.admin.listUsers({ perPage: 1 });
  const registrationOpen = (data?.users?.length ?? 0) === 0;

  return (
    <div className="flex min-h-screen bg-bg-dark font-sans">
      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-between bg-bg-page p-16">
        {/* Top: logo + status */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-lg font-bold text-text-primary">ry.bealey</span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="font-mono text-[10px] font-medium tracking-[1.5px] text-text-muted">
                SYSTEMS ONLINE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="font-mono text-[10px] font-medium tracking-[1.5px] text-text-muted">
                v2.4.1
              </span>
            </div>
          </div>
        </div>

        {/* Middle: hero */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-[11px] font-semibold tracking-[3px] text-brand">
              GET STARTED
            </span>
            <h2 className="text-[56px] font-bold leading-[1.1] text-text-primary">
              Create your<br />account.
            </h2>
            <p className="max-w-[400px] text-base leading-relaxed text-text-secondary">
              Set up your admin credentials to start managing your portfolio content.
            </p>
          </div>

          {/* Terminal block */}
          <div className="flex max-w-[400px] flex-col gap-3 rounded-lg border border-border-light bg-bg-card-alt p-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="h-2 w-2 rounded-full bg-green-500" />
            </div>
            <span className="font-mono text-[13px] text-text-secondary">
              $ create-admin --new
            </span>
            <span className="font-mono text-[13px] text-brand">
              &gt; initializing account...
            </span>
            <span className="font-mono text-[13px] text-green-400">
              ✓ ready to configure
            </span>
          </div>
        </div>

        {/* Bottom: copyright */}
        <p className="text-xs text-text-muted">
          &copy; 2026 Ry Bealey. All rights reserved.
        </p>
      </div>

      {/* Accent line */}
      <div className="hidden lg:block w-px bg-brand shrink-0" />

      {/* ===== RIGHT PANEL ===== */}
      <div className="flex w-full flex-col items-center justify-center bg-bg-dark px-6 py-12 lg:w-[560px] lg:shrink-0 lg:px-20 lg:py-16">
        <div className="w-full max-w-sm lg:max-w-none">
          {registrationOpen ? (
            <RegisterForm />
          ) : (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-light bg-bg-page">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <h1 className="text-[28px] font-bold text-text-primary">Registration closed</h1>
                <p className="text-sm leading-relaxed text-text-secondary">
                  An account cannot be created at this time. If you already have an account,{" "}
                  <a href="/admin" className="font-semibold text-brand hover:opacity-80 transition-opacity">
                    sign in here
                  </a>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
