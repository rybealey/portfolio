import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Use in protected admin pages/layouts.
 * Reads the session from the local cookie (no network round-trip).
 * Redirects to /admin (login) if no valid session is found.
 */
export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/admin");

  return session.user;
}

/**
 * Use in login/register pages.
 * Redirects to /admin/dashboard if the user is already authenticated.
 */
export async function redirectIfAuthenticated() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) redirect("/admin/dashboard");
}
