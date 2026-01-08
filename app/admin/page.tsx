export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to the admin panel
        </p>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-4xl">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p className="text-muted-foreground">
            Use the navigation menu on the left to manage your portfolio content.
          </p>
        </div>
      </div>
    </div>
  );
}

