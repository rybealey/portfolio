"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProjectFormState = { error?: string; success?: boolean } | null;

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const excerpt = formData.get("excerpt") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;
  const status = formData.get("status") as string;
  const role = formData.get("role") as string;
  const timeline = formData.get("timeline") as string;
  const tools = formData.get("tools") as string;
  const team = parseInt(formData.get("team") as string, 10) || 1;
  const dateCompleted = formData.get("date_completed") as string;
  const coverImage = (formData.get("cover_image") as string) || null;
  const galleryRaw = formData.get("gallery_images") as string;
  const galleryImages: string[] = galleryRaw ? JSON.parse(galleryRaw) : [];

  if (!name || !type || !slug || !excerpt) {
    return { error: "Name, type, slug, and excerpt are required." };
  }

  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { error } = await supabase.from("projects").insert({
    name,
    type,
    excerpt,
    description: description || "",
    slug,
    status: status || "draft",
    role: role || "",
    timeline: timeline || "",
    tools: tools || "",
    team,
    cover_image: coverImage,
    gallery_images: galleryImages,
    date_completed: dateCompleted || new Date().toISOString().split("T")[0],
    sort_order: (count ?? 0) + 1,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const excerpt = formData.get("excerpt") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;
  const status = formData.get("status") as string;
  const role = formData.get("role") as string;
  const timeline = formData.get("timeline") as string;
  const tools = formData.get("tools") as string;
  const team = parseInt(formData.get("team") as string, 10) || 1;
  const dateCompleted = formData.get("date_completed") as string;
  const coverImage = (formData.get("cover_image") as string) || null;
  const galleryRaw = formData.get("gallery_images") as string;
  const galleryImages: string[] = galleryRaw ? JSON.parse(galleryRaw) : [];

  if (!id || !name || !type || !slug || !excerpt) {
    return { error: "Name, type, slug, and excerpt are required." };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      name,
      type,
      excerpt,
      description: description || "",
      slug,
      status: status || "draft",
      role: role || "",
      timeline: timeline || "",
      tools: tools || "",
      team,
      cover_image: coverImage,
      gallery_images: galleryImages,
      date_completed: dateCompleted || new Date().toISOString().split("T")[0],
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Fetch project to get media paths for cleanup
  const { data: project } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", projectId)
    .single();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  // Clean up Storage files for this project
  if (project?.slug) {
    const { data: files } = await supabase.storage
      .from("project-media")
      .list(project.slug);

    if (files && files.length > 0) {
      const paths = files.map((f) => `${project.slug}/${f.name}`);
      await supabase.storage.from("project-media").remove(paths);
    }
  }

  revalidatePath("/admin/projects");
  return { success: true };
}

export async function toggleProjectStatus(
  projectId: string,
  newStatus: "published" | "draft"
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("projects")
    .update({ status: newStatus })
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}
