"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  ArrowUpDown,
  Calendar,
  Eye,
  Pencil,
  EyeOff,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { deleteProject, toggleProjectStatus } from "@/app/actions/projects";
import type { Project } from "@/lib/supabase/types";

type Tab = "all" | "published" | "draft";

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    if (activeTab === "published" && p.status !== "published") return false;
    if (activeTab === "draft" && p.status !== "draft") return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.excerpt.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const publishedCount = projects.filter((p) => p.status === "published").length;
  const draftCount = projects.filter((p) => p.status === "draft").length;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: projects.length },
    { key: "published", label: "Published", count: publishedCount },
    { key: "draft", label: "Draft", count: draftCount },
  ];

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteProject(id);
      setDeletingId(null);
      if (result?.error) {
        toast.error("Delete failed", { description: result.error });
      } else {
        toast.success("Project deleted", {
          description: "The project has been removed from your portfolio.",
        });
      }
    });
  }

  function handleToggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    setTogglingId(id);
    startTransition(async () => {
      const result = await toggleProjectStatus(id, newStatus);
      setTogglingId(null);
      if (result?.error) {
        toast.error("Status update failed", { description: result.error });
      } else {
        toast.success(
          newStatus === "published" ? "Project published" : "Project unpublished",
          {
            description:
              newStatus === "published"
                ? "The project is now visible on your portfolio."
                : "The project has been moved to drafts.",
          }
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-7 p-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-sm text-text-secondary">
            Manage, edit, and organize your portfolio projects.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-md bg-brand px-[18px] py-2.5 text-[13px] font-semibold text-bg-dark transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex rounded-md border border-border-light bg-bg-page p-[3px]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded px-4 py-[7px] text-xs transition-colors ${
                activeTab === tab.key
                  ? "bg-bg-card font-medium text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-3">
          <div className="flex w-[220px] items-center gap-2 rounded-md border border-border-light bg-bg-page px-3.5 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-text-muted" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-md border border-border-light px-3.5 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((project) => (
            <div
              key={project.id}
              className={`flex flex-col overflow-hidden rounded-lg border border-border-light bg-bg-page transition-opacity ${
                deletingId === project.id ? "opacity-50" : ""
              }`}
            >
              {/* Thumbnail */}
              {project.cover_image ? (
                <div className="h-40 overflow-hidden">
                  <img
                    src={project.cover_image}
                    alt={project.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-bg-card-alt">
                  <span className="font-mono text-xs text-text-muted">
                    {project.type}
                  </span>
                </div>
              )}

              {/* Card Body */}
              <div className="flex flex-col gap-3 p-5">
                {/* Title + Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[15px] font-semibold text-text-primary">
                      {project.name}
                    </span>
                    <span className="line-clamp-2 text-xs leading-[1.4] text-text-secondary">
                      {project.excerpt}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      project.status === "published"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-amber-400/10 text-amber-400"
                    }`}
                  >
                    {project.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
                    <Calendar className="h-3 w-3" />
                    {new Date(project.date_completed).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
                    <Eye className="h-3 w-3" />
                    {project.team} team
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-border-light pt-3">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="flex items-center gap-1.5 rounded border border-border-light px-3 py-1.5 text-[11px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(project.id, project.status)}
                    disabled={isPending || togglingId === project.id}
                    className="flex items-center gap-1.5 rounded border border-border-light px-3 py-1.5 text-[11px] font-medium text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
                  >
                    {project.status === "published" ? (
                      <>
                        <EyeOff className="h-3 w-3" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3" />
                        Publish
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={isPending}
                    className="flex items-center gap-1.5 rounded border border-red-500/20 px-3 py-1.5 text-[11px] font-medium text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border-light bg-bg-page py-24">
          <p className="font-mono text-sm text-text-muted">
            {search ? "No projects match your search." : "No projects yet."}
          </p>
          {!search && (
            <Link
              href="/admin/projects/new"
              className="mt-4 flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-bg-dark transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Your First Project
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
