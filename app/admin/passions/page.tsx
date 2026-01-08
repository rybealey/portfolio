import { getAllPassions } from '@/lib/passions-db';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import DeletePassionButton from '@/components/DeletePassionButton';

async function PassionsList() {
  const passions = getAllPassions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Passions</h1>
            <p className="text-muted-foreground mt-1">
              Manage your passions page content
            </p>
          </div>
          <Link
            href="/admin/passions/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Passion
          </Link>
        </div>

        {/* Passions List */}
        {passions.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No passions yet.</p>
            <Link
              href="/admin/passions/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create your first passion
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {passions.map((passion) => (
              <div
                key={passion.id}
                className="border border-border rounded-lg p-6 bg-card"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {passion.icon && (
                        <span className="text-2xl">{passion.icon}</span>
                      )}
                      <h2 className="text-xl font-semibold">{passion.title}</h2>
                      <span className="text-xs text-muted-foreground">
                        Order: {passion.order}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {passion.description}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/admin/passions/${passion.id}/edit`}
                      className="p-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <DeletePassionButton id={passion.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default function PassionsAdminPage() {
  return <PassionsList />;
}

