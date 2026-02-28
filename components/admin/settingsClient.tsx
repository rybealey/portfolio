"use client";

import { useActionState, useEffect, useState } from "react";
import { Save, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/admin/richTextEditor";
import {
  updateProfile,
  type ProfileFormState,
} from "@/app/actions/profile";
import type { Profile } from "@/lib/supabase/types";

type Props = {
  profile: Profile | null;
};

export function SettingsClient({ profile }: Props) {
  const [state, formAction, isPending] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    null
  );

  const [available, setAvailable] = useState(profile?.looking_for_work ?? false);
  const [bio, setBio] = useState(profile?.about ?? "");

  useEffect(() => {
    if (state?.success) {
      toast.success("Settings saved");
    }
    if (state?.error) {
      toast.error("Save failed", { description: state.error });
    }
  }, [state]);

  return (
    <form action={formAction} className="flex h-full flex-col overflow-auto">
      {profile && <input type="hidden" name="id" value={profile.id} />}
      <input type="hidden" name="looking_for_work" value={available ? "on" : ""} />
      <input type="hidden" name="about" value={bio} />

      {/* Content wrapper with padding */}
      <div className="flex flex-col gap-8 p-8">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
            <p className="text-sm text-text-secondary">
              Manage your portfolio profile and public information.
            </p>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex shrink-0 items-center gap-2 rounded-md bg-brand px-[18px] py-2.5 text-[13px] font-semibold text-bg-dark transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>

        <div className="h-px shrink-0 bg-border-light" />

        {/* Two-Column Layout */}
        <div className="flex gap-6">
          {/* Left Column — fixed 400px */}
          <div className="w-[400px] shrink-0">
            <div className="flex flex-col gap-6 rounded-[10px] border border-border-light bg-bg-page p-6">
              {/* Card Header */}
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-semibold text-text-primary">
                  Profile
                </span>
                <span className="text-xs text-text-muted">
                  Your name as displayed across the portfolio.
                </span>
              </div>

              <div className="h-px bg-border-light" />

              {/* Avatar Row */}
              <div className="flex items-center gap-5">
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-border-light bg-bg-card-alt">
                  <User className="h-7 w-7 text-text-muted" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-text-primary">
                      Avatar
                    </span>
                    <span className="text-xs text-text-muted">
                      JPG, PNG or WebP &middot; Recommended 400×400px
                    </span>
                  </div>
                </div>
              </div>

              {/* Name Row */}
              <div className="flex gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-secondary">
                    First name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    defaultValue={profile?.first_name ?? ""}
                    className="w-full rounded-md border border-border-light bg-bg-card-alt px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-secondary">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    required
                    defaultValue={profile?.last_name ?? ""}
                    className="w-full rounded-md border border-border-light bg-bg-card-alt px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand"
                  />
                </div>
              </div>

              {/* Available for Work Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-border-light bg-bg-card-alt px-4 py-3.5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-text-primary">
                    Available for Work
                  </span>
                  <span className="text-xs text-text-muted">
                    Show the &apos;Available&apos; badge on your portfolio.
                  </span>
                </div>
                <Switch
                  checked={available}
                  onCheckedChange={setAvailable}
                  className="shrink-0 data-[state=checked]:bg-brand"
                />
              </div>
            </div>
          </div>

          {/* Right Column — fills remaining space */}
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            {/* About Card */}
            <div className="flex flex-col gap-6 rounded-[10px] border border-border-light bg-bg-page p-6">
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-semibold text-text-primary">
                  About
                </span>
                <span className="text-xs text-text-muted">
                  Write a short bio displayed on your portfolio homepage.
                </span>
              </div>

              <div className="h-px bg-border-light" />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Biography
                </label>
                <RichTextEditor
                  content={profile?.about ?? ""}
                  onChange={setBio}
                />
              </div>
            </div>

            {/* Portfolio Stats Card */}
            <div className="flex flex-col gap-6 rounded-[10px] border border-border-light bg-bg-page p-6">
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-semibold text-text-primary">
                  Portfolio Stats
                </span>
                <span className="text-xs text-text-muted">
                  Key numbers shown in the hero section of your portfolio.
                </span>
              </div>

              <div className="h-px bg-border-light" />

              <div className="flex gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-secondary">
                    Years of experience
                  </label>
                  <input
                    type="number"
                    name="years_exp"
                    defaultValue={profile?.years_exp ?? 0}
                    className="w-full rounded-md border border-border-light bg-bg-card-alt px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-secondary">
                    Completed projects
                  </label>
                  <input
                    type="number"
                    name="project_count"
                    defaultValue={profile?.project_count ?? 0}
                    className="w-full rounded-md border border-border-light bg-bg-card-alt px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-secondary">
                    Clients
                  </label>
                  <input
                    type="number"
                    name="client_count"
                    defaultValue={profile?.client_count ?? 0}
                    className="w-full rounded-md border border-border-light bg-bg-card-alt px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand"
                  />
                </div>
              </div>

              <span className="text-[11px] text-text-muted">
                These values appear as animated counters on the live portfolio.
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
