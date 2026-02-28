import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/proxy";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/newProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select()
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return <ProjectForm project={project} />;
}
