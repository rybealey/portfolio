import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/proxy";
import { createClient } from "@/lib/supabase/server";
import { WorkHistoryForm } from "@/components/admin/workHistoryForm";

export default async function EditWorkHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from("work_history")
    .select()
    .eq("id", id)
    .single();

  if (!entry) {
    notFound();
  }

  return <WorkHistoryForm workHistory={entry} />;
}
