import AdminLayoutClient from '@/components/AdminLayoutClient';

// Authentication is handled by middleware
// This layout just wraps children with the client component for conditional sidebar rendering
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
