import { requireAuth } from "@/lib/auth/proxy";
import { createClient } from "@/lib/supabase/server";
import { SkillsClient } from "@/components/admin/skillsClient";

export default async function SkillsPage() {
  await requireAuth();
  const supabase = await createClient();

  const { data: skills } = await supabase
    .from("skills")
    .select()
    .order("sort_order", { ascending: true });

  return <SkillsClient skills={skills ?? []} />;
}
