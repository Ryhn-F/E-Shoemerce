export default function RecommendationsSkeleton() {
  return (
    <section className="mt-16" aria-label="Loading recommendations">
      <div className="h-8 bg-light-300 rounded w-48 mb-8 animate-pulse"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="bg-light-100 rounded-lg overflow-hidden shadow-sm"
          >
            {/* Image skeleton */}
            <div className="aspect-square bg-light-300 animate-pulse"></div>

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Category */}
              <div className="h-3 bg-light-300 rounded w-16 animate-pulse"></div>

              {/* Title */}
              <div className="space-y-2">
                <div className="h-4 bg-light-300 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-light-300 rounded w-3/4 animate-pulse"></div>
              </div>

              {/* Price */}
              <div className="h-5 bg-light-300 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="h-4 bg-light-300 rounded w-32 mx-auto animate-pulse"></div>
      </div>
    </section>
  );
}
