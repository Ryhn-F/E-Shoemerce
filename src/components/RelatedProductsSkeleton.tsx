export default function RelatedProductsSkeleton() {
  return (
    <section>
      <div className="w-48 h-6 bg-light-200 rounded animate-pulse mb-8"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-square bg-light-200 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-3/4 h-4 bg-light-200 rounded animate-pulse"></div>
              <div className="w-1/2 h-4 bg-light-200 rounded animate-pulse"></div>
              <div className="w-1/4 h-4 bg-light-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
