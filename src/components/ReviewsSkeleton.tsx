export default function ReviewsSkeleton() {
  return (
    <section className="mt-16" aria-label="Loading reviews">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 bg-light-300 rounded w-32 animate-pulse"></div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="w-5 h-5 bg-light-300 rounded animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-6 bg-light-300 rounded w-8 animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-6">
        {Array.from({ length: 3 }, (_, index) => (
          <article
            key={index}
            className="border-b border-light-300 pb-6 last:border-b-0"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="h-5 bg-light-300 rounded w-24 mb-2 animate-pulse"></div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, starIndex) => (
                      <div
                        key={starIndex}
                        className="w-4 h-4 bg-light-300 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                  <div className="h-4 bg-light-300 rounded w-20 animate-pulse"></div>
                </div>
              </div>
              <div className="h-4 bg-light-300 rounded w-16 animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-light-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-light-300 rounded w-4/5 animate-pulse"></div>
              <div className="h-4 bg-light-300 rounded w-3/5 animate-pulse"></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
