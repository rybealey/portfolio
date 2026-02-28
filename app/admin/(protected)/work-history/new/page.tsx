import { requireAuth } from "@/lib/auth/proxy";
import { WorkHistoryForm } from "@/components/admin/workHistoryForm";

export default async function NewWorkHistoryPage() {
  await requireAuth();
  return <WorkHistoryForm />;
}
