"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileFormState = { error?: string; success?: boolean } | null;

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const about = (formData.get("about") as string) || null;
  const lookingForWork = formData.get("looking_for_work") === "on";
  const yearsExp = parseInt(formData.get("years_exp") as string) || 0;
  const projectCount = parseInt(formData.get("project_count") as string) || 0;
  const clientCount = parseInt(formData.get("client_count") as string) || 0;

  if (!id || !firstName || !lastName) {
    return { error: "First name and last name are required." };
  }

  const { error } = await supabase
    .from("profile")
    .update({
      first_name: firstName,
      last_name: lastName,
      about,
      looking_for_work: lookingForWork,
      years_exp: yearsExp,
      project_count: projectCount,
      client_count: clientCount,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // Store display name in Supabase auth user metadata
  await supabase.auth.updateUser({
    data: { full_name: `${firstName} ${lastName}` },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}
