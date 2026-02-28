import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/proxy";
import { WorkHistoryClient } from "@/components/admin/workHistoryClient";

export default async function WorkHistoryPage() {
  await requireAuth();
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("work_history")
    .select()
    .order("sort_order", { ascending: true });

  return <WorkHistoryClient entries={entries ?? []} />;
}
