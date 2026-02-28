import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/proxy";
import { ProjectsClient } from "@/components/admin/projectsClient";

export default async function ProjectsPage() {
  await requireAuth();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select()
    .order("sort_order", { ascending: true });

  return <ProjectsClient projects={projects ?? []} />;
}
