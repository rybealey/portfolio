"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type WorkHistoryFormState = { error?: string; success?: boolean } | null;

export async function createWorkHistory(
  _prev: WorkHistoryFormState,
  formData: FormData
): Promise<WorkHistoryFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const jobTitle = formData.get("job_title") as string;
  const employer = formData.get("employer") as string;
  const jobDescription = formData.get("job_description") as string;
  const startDate = formData.get("start_date") as string;
  const endDate = (formData.get("end_date") as string) || null;

  if (!jobTitle || !employer || !startDate) {
    return { error: "Job title, employer, and start date are required." };
  }

  const { count } = await supabase
    .from("work_history")
    .select("*", { count: "exact", head: true });

  const { error } = await supabase.from("work_history").insert({
    job_title: jobTitle,
    employer,
    job_description: jobDescription || "",
    start_date: startDate,
    end_date: endDate,
    sort_order: (count ?? 0) + 1,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/work-history");
  revalidatePath("/");
  redirect("/admin/work-history");
}

export async function updateWorkHistory(
  _prev: WorkHistoryFormState,
  formData: FormData
): Promise<WorkHistoryFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string;
  const jobTitle = formData.get("job_title") as string;
  const employer = formData.get("employer") as string;
  const jobDescription = formData.get("job_description") as string;
  const startDate = formData.get("start_date") as string;
  const endDate = (formData.get("end_date") as string) || null;

  if (!id || !jobTitle || !employer || !startDate) {
    return { error: "Job title, employer, and start date are required." };
  }

  const { error } = await supabase
    .from("work_history")
    .update({
      job_title: jobTitle,
      employer,
      job_description: jobDescription || "",
      start_date: startDate,
      end_date: endDate,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/work-history");
  revalidatePath("/");
  redirect("/admin/work-history");
}

export async function deleteWorkHistory(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("work_history")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/work-history");
  revalidatePath("/");
  return { success: true };
}
