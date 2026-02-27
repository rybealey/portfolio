import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Use in protected admin pages/layouts.
 * Authenticates the user by contacting the Supabase Auth server (not just cookies).
 * Redirects to /admin (login) if no valid user is found.
 */
export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin");

  return user;
}

/**
 * Use in login/register pages.
 * Redirects to /admin/dashboard if the user is already authenticated.
 */
export async function redirectIfAuthenticated() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/admin/dashboard");
}
