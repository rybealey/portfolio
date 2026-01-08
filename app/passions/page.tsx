import { getAllPassions } from '@/lib/passions-db';

export default function PassionsPage() {
  const passions = getAllPassions().sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-background">
      <div id="main-content" className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Passions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Things I&apos;m passionate about and enjoy doing in my free time.
          </p>
        </header>

        {/* Passions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {passions.map((passion) => {
            return (
              <div
                key={passion.id}
                className="group relative p-6 sm:p-8 rounded-xl border border-border bg-card hover:border-accent-foreground/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
              >
                {/* Icon */}
                {passion.icon && (
                  <div className="mb-6 text-5xl transform group-hover:scale-110 transition-transform duration-300">
                    {passion.icon}
                  </div>
                )}
                
                {/* Title */}
                <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {passion.title}
                </h2>
                
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-base">
                  {passion.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Empty State Message */}
        {passions.length === 0 && (
          <div className="text-center py-24">
            <p className="text-xl text-muted-foreground">Passions coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

