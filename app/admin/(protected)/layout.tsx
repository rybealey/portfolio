import { requireAuth } from "@/lib/auth/proxy";
import { Sidebar, TopBar } from "@/components/admin/sidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  const fullName = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Admin";
  const email = user.email ?? "";

  return (
    <div className="flex h-screen overflow-hidden bg-bg-dark font-sans">
      <Sidebar userName={fullName} userEmail={email} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
