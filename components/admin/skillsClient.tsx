"use client";

import { useState, useTransition } from "react";
import { Plus, PenTool, Code, Wrench, Tag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { deleteSkill, deleteSkillCategory } from "@/app/actions/skills";
import { AddSkillModal } from "@/components/admin/addSkillModal";
import type { Skill } from "@/lib/supabase/types";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  design: PenTool,
  development: Code,
  tools: Wrench,
};

export function SkillsClient({ skills }: { skills: Skill[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  // Group skills by type
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  function handleDeleteSkill(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteSkill(id);
      setDeletingId(null);
      if (result?.error) {
        toast.error("Delete failed", { id: `delete-skill-${id}`, description: result.error });
      } else {
        toast.success("Skill deleted", { id: `delete-skill-${id}` });
      }
    });
  }

  function handleDeleteCategory(type: string) {
    if (!confirm(`Delete all skills in "${type}"?`)) return;
    setDeletingCategory(type);
    startTransition(async () => {
      const result = await deleteSkillCategory(type);
      setDeletingCategory(null);
      if (result?.error) {
        toast.error("Delete failed", { id: `delete-cat-${type}`, description: result.error });
      } else {
        toast.success("Category deleted", {
          id: `delete-cat-${type}`,
          description: `All "${type}" skills have been removed.`,
        });
      }
    });
  }

  function getIcon(type: string) {
    const Icon = CATEGORY_ICONS[type.toLowerCase()] ?? Tag;
    return <Icon className="h-4 w-4 text-brand" />;
  }

  return (
    <div className="flex flex-col gap-7 p-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-text-primary">Skills</h1>
          <p className="text-sm text-text-secondary">
            Manage your skills and expertise by category.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-brand px-[18px] py-2.5 text-[13px] font-semibold text-bg-dark transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </button>
      </div>

      {/* Category Cards */}
      {Object.keys(grouped).length > 0 ? (
        <div className="flex flex-col gap-5">
          {Object.entries(grouped).map(([type, categorySkills]) => (
            <div
              key={type}
              className={`flex flex-col gap-4 rounded-lg border border-border-light bg-bg-page p-6 transition-opacity ${
                deletingCategory === type ? "opacity-50" : ""
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {getIcon(type)}
                  <span className="font-mono text-[11px] font-semibold tracking-[1.2px] text-text-secondary uppercase">
                    {type}
                  </span>
                  <span className="text-xs text-text-muted">
                    {categorySkills.length}{" "}
                    {categorySkills.length === 1 ? "skill" : "skills"}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(type)}
                  disabled={isPending}
                  className="flex items-center justify-center rounded border border-red-500/20 p-1.5 text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Skill Chips */}
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`flex items-center gap-2 rounded-md border border-border-light bg-bg-card-alt px-3.5 py-2 text-[13px] text-text-primary transition-opacity ${
                      deletingId === skill.id ? "opacity-50" : ""
                    }`}
                  >
                    {skill.skill}
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      disabled={isPending}
                      className="text-text-muted transition-colors hover:text-text-primary"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border-light bg-bg-page py-24">
          <p className="font-mono text-sm text-text-muted">
            No skills added yet.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-bg-dark transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Your First Skill
          </button>
        </div>
      )}

      <AddSkillModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
