"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Briefcase,
  Settings,
  Image as ImageIcon,
  ChevronDown,
  Calendar,
  Users,
  Plus,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import {
  createProject,
  updateProject,
  type ProjectFormState,
} from "@/app/actions/projects";
import type { Project } from "@/lib/supabase/types";
import { RichTextEditor } from "@/components/admin/richTextEditor";
import {
  uploadProjectImage,
  deleteProjectImage,
} from "@/lib/supabase/storage";

const PROJECT_TYPES = [
  "Web Application",
  "Mobile App",
  "SaaS Platform",
  "Design System",
  "API / Backend",
  "Marketing Site",
  "E-Commerce",
  "Other",
];

type Props = {
  project?: Project;
};

export function ProjectForm({ project }: Props) {
  const isEdit = !!project;
  const action = isEdit ? updateProject : createProject;

  const [state, formAction, isPending] = useActionState<ProjectFormState, FormData>(
    action,
    null
  );
  const [type, setType] = useState(project?.type ?? "Web Application");
  const [typeOpen, setTypeOpen] = useState(false);
  const [status, setStatus] = useState(project?.status ?? "draft");
  const [statusOpen, setStatusOpen] = useState(false);
  const [description, setDescription] = useState(project?.description ?? "");
  const [tools, setTools] = useState<string[]>(
    project?.tools ? project.tools.split(", ").filter(Boolean) : []
  );
  const [toolInput, setToolInput] = useState("");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(
    project?.cover_image ?? null
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    project?.gallery_images ?? []
  );
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.error) {
      toast.error(isEdit ? "Update failed" : "Publish failed", {
        description: state.error,
      });
    }
  }, [state, isEdit]);

  function handleNameChange(name: string) {
    if (!isEdit) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
      );
    }
  }

  function addTool() {
    const trimmed = toolInput.trim();
    if (trimmed && !tools.includes(trimmed)) {
      setTools([...tools, trimmed]);
    }
    setToolInput("");
  }

  function removeTool(tool: string) {
    setTools(tools.filter((t) => t !== tool));
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !slug) {
      if (!slug) toast.error("Enter a project title first to generate a slug.");
      return;
    }
    setCoverUploading(true);
    try {
      const url = await uploadProjectImage(file, slug);
      setCoverImage(url);
    } catch (err) {
      toast.error("Failed to upload image.", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  async function handleRemoveCover() {
    if (!coverImage) return;
    try {
      await deleteProjectImage(coverImage);
    } catch {
      // file may already be gone
    }
    setCoverImage(null);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0 || !slug) {
      if (!slug) toast.error("Enter a project title first to generate a slug.");
      return;
    }
    setGalleryUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadProjectImage(file, slug);
        urls.push(url);
      }
      setGalleryImages((prev) => [...prev, ...urls]);
    } catch (err) {
      toast.error("Failed to upload gallery image(s).", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  async function handleRemoveGalleryImage(url: string) {
    try {
      await deleteProjectImage(url);
    } catch {
      // file may already be gone
    }
    setGalleryImages((prev) => prev.filter((u) => u !== url));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 p-6 pb-12 md:p-8">
      {/* Hidden fields for values managed by state */}
      {isEdit && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="tools" value={tools.join(", ")} />
      <input type="hidden" name="cover_image" value={coverImage ?? ""} />
      <input
        type="hidden"
        name="gallery_images"
        value={JSON.stringify(galleryImages)}
      />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="flex items-center gap-1.5 rounded-md border border-border-light px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <h1 className="text-[22px] font-semibold text-text-primary">
            {isEdit ? "Edit Project" : "New Project"}
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/projects"
            className="rounded-md border border-border-light px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            {isEdit ? "Cancel" : "Save Draft"}
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-bg-dark transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending
              ? isEdit
                ? "Saving..."
                : "Publishing..."
              : isEdit
                ? "Save Changes"
                : "Publish Project"}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Main Column */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Title + Type row */}
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary">
                Project Title
              </label>
              <input
                name="name"
                type="text"
                defaultValue={project?.name ?? ""}
                placeholder="Enter project title..."
                onChange={(e) => handleNameChange(e.target.value)}
                className="rounded-md border border-border-light bg-bg-card-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand/50"
              />
            </div>
            <div className="relative flex w-[220px] flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary">
                Project Type
              </label>
              <button
                type="button"
                onClick={() => setTypeOpen(!typeOpen)}
                className="flex items-center justify-between rounded-md border border-border-light bg-bg-card-alt px-4 py-3 text-sm text-text-primary outline-none"
              >
                {type}
                <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
              </button>
              {typeOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 z-10 w-full rounded-md border border-border-light bg-bg-card-alt py-1 shadow-lg">
                  {PROJECT_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setType(t);
                        setTypeOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-bg-card ${
                        t === type ? "text-brand" : "text-text-primary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text-secondary">
              Project Description
            </label>
            <RichTextEditor
              content={project?.description ?? ""}
              onChange={setDescription}
            />
          </div>

          {/* Project Details card */}
          <div className="flex flex-col gap-5 rounded-lg border border-border-light bg-bg-page p-6">
            <div className="flex items-center gap-2.5">
              <Briefcase className="h-4 w-4 text-brand" />
              <span className="font-mono text-[11px] font-semibold tracking-[1.2px] text-text-secondary">
                PROJECT DETAILS
              </span>
            </div>
            <div className="h-px bg-border-light" />

            <div className="flex gap-4">
              {/* Left fields */}
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-text-secondary">
                    My Role
                  </label>
                  <input
                    name="role"
                    type="text"
                    defaultValue={project?.role ?? ""}
                    placeholder="Lead Developer & Designer"
                    className="h-10 rounded-md border border-border-light bg-bg-card-alt px-3.5 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-brand/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-text-secondary">
                    Tools Used
                  </label>
                  <div className="flex min-h-[40px] flex-wrap items-center gap-2 rounded-md border border-border-light bg-bg-card-alt px-3.5 py-2">
                    {tools.map((tool) => (
                      <span
                        key={tool}
                        className="flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand"
                      >
                        {tool}
                        <button
                          type="button"
                          onClick={() => removeTool(tool)}
                          className="text-brand/60 hover:text-brand"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={toolInput}
                      onChange={(e) => setToolInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTool();
                        }
                      }}
                      placeholder={tools.length === 0 ? "Add tool" : ""}
                      className="min-w-[60px] flex-1 bg-transparent text-[11px] text-text-primary placeholder:text-text-muted outline-none"
                    />
                    <button
                      type="button"
                      onClick={addTool}
                      className="flex items-center gap-1 rounded-full border border-border-light px-2.5 py-1 text-[11px] text-text-muted transition-colors hover:text-text-secondary"
                    >
                      <Plus className="h-2.5 w-2.5" />
                      Add tool
                    </button>
                  </div>
                </div>
              </div>

              {/* Right fields */}
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-text-secondary">
                    Project Timeline
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 flex-1 items-center gap-2 rounded-md border border-border-light bg-bg-card-alt px-3.5">
                      <Calendar className="h-3 w-3 shrink-0 text-text-muted" />
                      <input
                        name="timeline"
                        type="text"
                        defaultValue={project?.timeline ?? ""}
                        placeholder="Jan 2026 — Present"
                        className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-text-secondary">
                    Team Size
                  </label>
                  <div className="flex h-10 items-center gap-2 rounded-md border border-border-light bg-bg-card-alt px-3.5">
                    <Users className="h-3 w-3 shrink-0 text-text-muted" />
                    <input
                      name="team"
                      type="number"
                      min={1}
                      defaultValue={project?.team ?? 1}
                      placeholder="4 members"
                      className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Column */}
        <div className="flex w-[340px] shrink-0 flex-col gap-5">
          {/* Publish Settings */}
          <div className="flex flex-col gap-4 rounded-lg border border-border-light bg-bg-page p-5">
            <div className="flex items-center gap-2">
              <Settings className="h-3.5 w-3.5 text-brand" />
              <span className="font-mono text-[11px] font-semibold tracking-[1.2px] text-text-secondary">
                PUBLISH SETTINGS
              </span>
            </div>
            <div className="h-px bg-border-light" />

            {/* Status */}
            <div className="relative flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">
                Status
              </label>
              <button
                type="button"
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center justify-between rounded-md border border-border-light bg-bg-card-alt px-3.5 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${status === "published" ? "bg-green-500" : "bg-amber-400"}`}
                  />
                  <span className="text-[13px] text-text-primary">
                    {status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
              </button>
              {statusOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 z-10 w-full rounded-md border border-border-light bg-bg-card-alt py-1 shadow-lg">
                  {(["published", "draft"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setStatus(s);
                        setStatusOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-bg-card ${
                        s === status ? "text-brand" : "text-text-primary"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${s === "published" ? "bg-green-500" : "bg-amber-400"}`}
                      />
                      {s === "published" ? "Published" : "Draft"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* URL Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">
                URL Slug
              </label>
              <div className="flex items-center gap-1.5 rounded-md border border-border-light bg-bg-card-alt px-3.5 py-2.5">
                <span className="font-mono text-xs text-text-muted">
                  /projects/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="new-project"
                  className="w-full bg-transparent font-mono text-xs text-text-primary placeholder:text-text-muted outline-none"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                defaultValue={project?.excerpt ?? ""}
                placeholder="Brief summary for cards and SEO..."
                rows={3}
                className="resize-none rounded-md border border-border-light bg-bg-card-alt p-3.5 text-[13px] leading-relaxed text-text-primary placeholder:text-text-muted outline-none focus:border-brand/50"
              />
            </div>
          </div>

          {/* Date Completed */}
          <div className="flex flex-col gap-4 rounded-lg border border-border-light bg-bg-page p-5">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-brand" />
              <span className="font-mono text-[11px] font-semibold tracking-[1.2px] text-text-secondary">
                DATE COMPLETED
              </span>
            </div>
            <div className="h-px bg-border-light" />
            <input
              name="date_completed"
              type="date"
              defaultValue={
                project?.date_completed
                  ? new Date(project.date_completed).toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              className="rounded-md border border-border-light bg-bg-card-alt px-3.5 py-2.5 text-[13px] text-text-primary outline-none focus:border-brand/50"
            />
          </div>

          {/* Media & Gallery */}
          <div className="flex flex-col gap-4 rounded-lg border border-border-light bg-bg-page p-5">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-3.5 w-3.5 text-brand" />
              <span className="font-mono text-[11px] font-semibold tracking-[1.2px] text-text-secondary">
                MEDIA & GALLERY
              </span>
            </div>
            <div className="h-px bg-border-light" />

            {/* Featured Image */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary">
                Featured Image
              </label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
              {coverImage ? (
                <div className="group relative overflow-hidden rounded-md border border-border-light">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="h-[140px] w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-bg-dark/70 text-text-primary opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={coverUploading}
                  className="flex h-[140px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border-light transition-colors hover:border-text-muted disabled:opacity-60"
                >
                  {coverUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-text-muted" />
                      <span className="text-xs text-text-muted">
                        Click to upload
                      </span>
                      <span className="text-[10px] text-text-muted/50">
                        PNG, JPG up to 5MB
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Gallery */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-text-secondary">
                  Gallery
                </label>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={galleryUploading}
                  className="flex items-center gap-1 rounded border border-border-light px-2 py-1 text-[10px] font-medium text-text-muted transition-colors hover:text-text-secondary disabled:opacity-60"
                >
                  {galleryUploading ? (
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                  ) : (
                    <Plus className="h-2.5 w-2.5" />
                  )}
                  Add
                </button>
              </div>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
              />
              <div className="flex flex-wrap gap-2">
                {galleryImages.map((url) => (
                  <div
                    key={url}
                    className="group relative h-[70px] w-[70px] overflow-hidden rounded border border-border-light"
                  >
                    <img
                      src={url}
                      alt="Gallery"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(url)}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-bg-dark/70 text-text-primary opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {galleryImages.length === 0 && !galleryUploading && (
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex h-[70px] w-[70px] items-center justify-center rounded border border-dashed border-border-light transition-colors hover:border-text-muted"
                  >
                    <Plus className="h-4 w-4 text-text-muted" />
                  </button>
                )}
                {galleryUploading && (
                  <div className="flex h-[70px] w-[70px] items-center justify-center rounded border border-border-light">
                    <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
