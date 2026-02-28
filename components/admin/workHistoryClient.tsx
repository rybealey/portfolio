"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { deleteWorkHistory } from "@/app/actions/workHistory";
import type { WorkHistory } from "@/lib/supabase/types";

export function WorkHistoryClient({ entries }: { entries: WorkHistory[] }) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = entries.filter((entry) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      entry.job_title.toLowerCase().includes(q) ||
      entry.employer.toLowerCase().includes(q)
    );
  });

  function formatDateRange(start: string, end: string | null) {
    const startYear = new Date(start).getFullYear();
    if (!end) return `${startYear} — Present`;
    const endYear = new Date(end).getFullYear();
    return startYear === endYear ? `${startYear}` : `${startYear} — ${endYear}`;
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteWorkHistory(id);
      setDeletingId(null);
      if (result?.error) {
        toast.error("Delete failed", { description: result.error });
      } else {
        toast.success("Entry deleted", {
          description: "The work history entry has been removed.",
        });
      }
    });
  }

  return (
    <div className="flex flex-col gap-7 p-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-text-primary">Work History</h1>
          <p className="text-sm text-text-secondary">
            Manage your employment history and work experience.
          </p>
        </div>
        <Link
          href="/admin/work-history/new"
          className="flex items-center gap-2 rounded-md bg-brand px-[18px] py-2.5 text-[13px] font-semibold text-bg-dark transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Entry
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center">
        <div className="flex w-[280px] items-center gap-2 rounded-md border border-border-light bg-bg-page px-3.5 py-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          <input
            type="text"
            placeholder="Search by title or employer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted outline-none"
          />
        </div>
      </div>

      {/* Entries List */}
      {filtered.length > 0 ? (
        <div className="flex flex-col overflow-hidden rounded-lg border border-border-light bg-bg-page">
          {filtered.map((entry, i) => (
            <div
              key={entry.id}
              className={`flex items-start gap-5 px-6 py-5 transition-opacity ${
                i < filtered.length - 1 ? "border-b border-border-light" : ""
              } ${deletingId === entry.id ? "opacity-50" : ""}`}
            >
              {/* Icon */}
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-card-alt">
                <Briefcase className="h-4 w-4 text-text-muted" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold text-text-primary">
                      {entry.job_title}
                    </span>
                    <span className="font-mono text-sm text-brand">
                      {entry.employer}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-text-muted">
                    {formatDateRange(entry.start_date, entry.end_date)}
                  </span>
                </div>
                {entry.job_description && (
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
                    {entry.job_description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/work-history/${entry.id}/edit`}
                  className="flex items-center gap-1.5 rounded border border-border-light px-3 py-1.5 text-[11px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded border border-red-500/20 px-3 py-1.5 text-[11px] font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border-light bg-bg-page py-24">
          <p className="font-mono text-sm text-text-muted">
            {search ? "No entries match your search." : "No work history yet."}
          </p>
          {!search && (
            <Link
              href="/admin/work-history/new"
              className="mt-4 flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-bg-dark transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Your First Entry
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
