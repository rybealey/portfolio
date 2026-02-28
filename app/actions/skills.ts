"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SkillFormState = { error?: string; success?: boolean } | null;

export async function createSkill(
  _prev: SkillFormState,
  formData: FormData
): Promise<SkillFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const skill = formData.get("skill") as string;
  const type = formData.get("type") as string;

  if (!skill || !type) {
    return { error: "Skill name and category are required." };
  }

  const { count } = await supabase
    .from("skills")
    .select("*", { count: "exact", head: true });

  const { error } = await supabase.from("skills").insert({
    skill,
    type,
    sort_order: (count ?? 0) + 1,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
  return { success: true };
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("skills").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
  return { success: true };
}

export async function deleteSkillCategory(type: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("skills").delete().eq("type", type);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
  return { success: true };
}
