"use client";

import { useActionState, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createSkill, type SkillFormState } from "@/app/actions/skills";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AddSkillModal({ open, onClose }: Props) {
  const [state, formAction, isPending] = useActionState<SkillFormState, FormData>(
    createSkill,
    null
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Skill added");
      formRef.current?.reset();
      onClose();
    }
    if (state?.error) {
      toast.error("Failed to add skill", { description: state.error });
    }
  }, [state, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-[440px] rounded-xl border border-border-light bg-bg-page shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Add New Skill
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted transition-colors hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-px bg-border-light" />

        {/* Form */}
        <form ref={formRef} action={formAction} className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text-secondary">
              Skill Name
            </label>
            <input
              type="text"
              name="skill"
              required
              placeholder="Enter skill name..."
              className="rounded-md border border-border-light bg-bg-card-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text-secondary">
              Category
            </label>
            <input
              type="text"
              name="type"
              required
              placeholder="e.g. Design, Development, Tools..."
              className="rounded-md border border-border-light bg-bg-card-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand"
            />
          </div>

          <div className="mt-2 h-px bg-border-light" />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border-light px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-bg-dark transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
