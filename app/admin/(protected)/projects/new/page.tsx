import { requireAuth } from "@/lib/auth/proxy";
import { ProjectForm } from "@/components/admin/newProjectForm";

export default async function NewProjectPage() {
  await requireAuth();
  return <ProjectForm />;
}
