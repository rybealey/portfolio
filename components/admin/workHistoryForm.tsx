"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Briefcase } from "lucide-react";
import {
  createWorkHistory,
  updateWorkHistory,
  type WorkHistoryFormState,
} from "@/app/actions/workHistory";
import type { WorkHistory } from "@/lib/supabase/types";

type Props = {
  workHistory?: WorkHistory;
};

export function WorkHistoryForm({ workHistory }: Props) {
  const isEdit = !!workHistory;
  const action = isEdit ? updateWorkHistory : createWorkHistory;

  const [state, formAction, isPending] = useActionState<WorkHistoryFormState, FormData>(
    action,
    null
  );

  const [isCurrent, setIsCurrent] = useState(!workHistory?.end_date);

  useEffect(() => {
    if (state?.error) {
      toast.error(isEdit ? "Update failed" : "Creation failed", {
        description: state.error,
      });
    }
  }, [state, isEdit]);

  return (
    <form action={formAction} className="flex flex-col gap-6 p-8">
      {isEdit && <input type="hidden" name="id" value={workHistory.id} />}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/work-history"
            className="flex items-center gap-1.5 rounded-md border border-border-light px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <h1 className="text-[22px] font-semibold text-text-primary">
            {isEdit ? "Edit Work" : "Add Work"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-bg-dark transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Publish Entry"}
        </button>
      </div>

      {/* Form Content */}
      <div className="flex flex-col gap-6">
        {/* Title + Employer Row */}
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary">
                Job Title
              </label>
              <input
                type="text"
                name="job_title"
                required
                defaultValue={workHistory?.job_title ?? ""}
                placeholder="Enter job title..."
                className="rounded-md border border-border-light bg-bg-card-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary">
                Employer
              </label>
              <input
                type="text"
                name="employer"
                required
                defaultValue={workHistory?.employer ?? ""}
                placeholder="Enter company name..."
                className="rounded-md border border-border-light bg-bg-card-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-text-secondary">
                Description
              </label>
              <span className="font-mono text-[10px] text-text-muted">
                Supports Markdown
              </span>
            </div>
            <textarea
              name="job_description"
              rows={10}
              defaultValue={workHistory?.job_description ?? ""}
              placeholder="Describe your role, responsibilities, and key achievements in this position..."
              className="resize-none rounded-md border border-border-light bg-bg-card-alt px-4 py-4 text-sm leading-relaxed text-text-primary placeholder:text-text-muted outline-none focus:border-brand"
            />
          </div>

          {/* Employment Details Card */}
          <div className="flex flex-col gap-5 rounded-lg border border-border-light bg-bg-page p-6">
            <div className="flex items-center gap-2.5">
              <Briefcase className="h-4 w-4 text-brand" />
              <span className="font-mono text-[11px] font-semibold tracking-[1.2px] text-text-secondary">
                EMPLOYMENT DETAILS
              </span>
            </div>
            <div className="h-px bg-border-light" />
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-xs font-medium text-text-secondary">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  required
                  defaultValue={workHistory?.start_date ?? ""}
                  className="rounded-md border border-border-light bg-bg-card-alt px-4 py-3 text-sm text-text-primary outline-none focus:border-brand"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-xs font-medium text-text-secondary">
                  End Date
                </label>
                {isCurrent ? (
                  <div className="flex h-[46px] items-center rounded-md border border-border-light bg-bg-card-alt px-4">
                    <span className="text-sm text-text-muted">Present</span>
                  </div>
                ) : (
                  <input
                    type="date"
                    name="end_date"
                    defaultValue={workHistory?.end_date ?? ""}
                    className="rounded-md border border-border-light bg-bg-card-alt px-4 py-3 text-sm text-text-primary outline-none focus:border-brand"
                  />
                )}
              </div>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="h-4 w-4 rounded border-border-light accent-brand"
              />
              <span className="text-xs text-text-secondary">
                I currently work here
              </span>
            </label>
          </div>
        </div>
    </form>
  );
}
