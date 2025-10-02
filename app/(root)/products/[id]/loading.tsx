export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-light-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Gallery Skeleton */}
          <div className="order-1">
            <div className="space-y-4">
              {/* Desktop Layout: Thumbnails on left, Main image on right */}
              <div className="lg:flex lg:gap-4 lg:flex-row-reverse">
                {/* Main Image Skeleton */}
                <div className="lg:flex-1">
                  <div className="relative aspect-square bg-light-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Thumbnail Strip Skeleton */}
                <div className="lg:w-20 lg:flex-shrink-0 mt-4 lg:mt-0">
                  <div className="flex lg:flex-col gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-light-200 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Color Swatches Skeleton */}
              <div className="flex items-center gap-3 mt-4">
                <div className="w-12 h-4 bg-light-200 rounded animate-pulse"></div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-light-200 rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Skeleton */}
          <div className="order-2 lg:order-2">
            {/* Category Skeleton */}
            <div className="mb-4">
              <div className="w-24 h-4 bg-light-200 rounded animate-pulse"></div>
            </div>

            {/* Title Skeleton */}
            <div className="mb-4">
              <div className="w-3/4 h-8 bg-light-200 rounded animate-pulse mb-2"></div>
              <div className="w-1/2 h-8 bg-light-200 rounded animate-pulse"></div>
            </div>

            {/* Rating Skeleton */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-light-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
              <div className="w-8 h-4 bg-light-200 rounded animate-pulse"></div>
            </div>

            {/* Pricing Skeleton */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-6 bg-light-200 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-light-200 rounded animate-pulse"></div>
                <div className="w-24 h-6 bg-light-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Size Picker Skeleton */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-20 h-4 bg-light-200 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-light-200 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-light-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="space-y-4 mb-8">
              <div className="w-full h-12 bg-light-200 rounded-lg animate-pulse"></div>
              <div className="w-full h-12 bg-light-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Collapsible Sections Skeleton */}
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b border-light-300 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="w-32 h-4 bg-light-200 rounded animate-pulse"></div>
                    <div className="w-4 h-4 bg-light-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
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
      </div>
    </div>
  );
}
