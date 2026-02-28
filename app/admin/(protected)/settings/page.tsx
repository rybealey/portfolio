import { requireAuth } from "@/lib/auth/proxy";
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "@/components/admin/settingsClient";

export default async function SettingsPage() {
  await requireAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profile").select().single();

  return <SettingsClient profile={profile} />;
}
