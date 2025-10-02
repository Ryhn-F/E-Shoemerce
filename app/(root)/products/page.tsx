import { Suspense } from "react";
import Link from "next/link";
import { parseFilters } from "@/src/lib/utils/query";
import { mockGenders, mockSizes, mockColors } from "@/src/lib/mock-data";

// Fetch products from API
async function fetchProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store", // Always fetch fresh data for now
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
import Card from "@/src/components/Card";
import Filters from "@/src/components/Filters";
import Sort from "@/src/components/Sort";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Configure ISR for products listing
export const revalidate = 1800; // Cache for 30 minutes

// Helper function to apply filters and sorting
function filterAndSortProducts(
  products: any[],
  filters: ReturnType<typeof parseFilters>
) {
  let filteredProducts = [...products];

  // Apply gender filter
  if (filters.gender) {
    filteredProducts = filteredProducts.filter(
      (product) => product.gender?.slug === filters.gender
    );
  }

  // Apply size filter
  if (filters.size.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.variants.some((variant: any) =>
        filters.size.includes(variant.size?.slug || "")
      )
    );
  }

  // Apply color filter
  if (filters.color.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.variants.some((variant: any) =>
        filters.color.includes(variant.color?.slug || "")
      )
    );
  }

  // Apply price range filter
  if (filters.priceRange) {
    filteredProducts = filteredProducts.filter((product) => {
      const price = parseFloat(
        product.variants[0]?.salePrice || product.variants[0]?.price || "0"
      );

      switch (filters.priceRange) {
        case "0-50":
          return price < 50;
        case "50-100":
          return price >= 50 && price < 100;
        case "100-150":
          return price >= 100 && price < 150;
        case "150-200":
          return price >= 150 && price < 200;
        case "200+":
          return price >= 200;
        default:
          return true;
      }
    });
  }

  // Apply sorting
  switch (filters.sort) {
    case "newest":
      filteredProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "price_asc":
      filteredProducts.sort((a, b) => {
        const priceA = parseFloat(
          a.variants[0]?.salePrice || a.variants[0]?.price || "0"
        );
        const priceB = parseFloat(
          b.variants[0]?.salePrice || b.variants[0]?.price || "0"
        );
        return priceA - priceB;
      });
      break;
    case "price_desc":
      filteredProducts.sort((a, b) => {
        const priceA = parseFloat(
          a.variants[0]?.salePrice || a.variants[0]?.price || "0"
        );
        const priceB = parseFloat(
          b.variants[0]?.salePrice || b.variants[0]?.price || "0"
        );
        return priceB - priceA;
      });
      break;
    case "featured":
    default:
      // Keep original order for featured
      break;
  }

  return filteredProducts;
}

// Helper function to get active filter labels
function getActiveFilterLabels(filters: ReturnType<typeof parseFilters>) {
  const labels: Array<{ type: string; value: string; label: string }> = [];

  // Gender filter
  if (filters.gender) {
    const gender = mockGenders.find((g) => g.slug === filters.gender);
    if (gender) {
      labels.push({
        type: "gender",
        value: filters.gender,
        label: gender.label,
      });
    }
  }

  // Size filters
  filters.size.forEach((sizeSlug) => {
    const size = mockSizes.find((s) => s.slug === sizeSlug);
    if (size) {
      labels.push({
        type: "size",
        value: sizeSlug,
        label: `Size: ${size.name}`,
      });
    }
  });

  // Color filters
  filters.color.forEach((colorSlug) => {
    const color = mockColors.find((c) => c.slug === colorSlug);
    if (color) {
      labels.push({ type: "color", value: colorSlug, label: color.name });
    }
  });

  // Price range filter
  if (filters.priceRange) {
    const priceLabels: Record<string, string> = {
      "0-50": "Under $50",
      "50-100": "$50 - $100",
      "100-150": "$100 - $150",
      "150-200": "$150 - $200",
      "200+": "$200+",
    };
    labels.push({
      type: "priceRange",
      value: filters.priceRange,
      label: priceLabels[filters.priceRange] || filters.priceRange,
    });
  }

  return labels;
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = new URLSearchParams();

  // Convert the searchParams to URLSearchParams
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => urlSearchParams.append(key, v));
    } else if (value) {
      urlSearchParams.set(key, value);
    }
  });

  const filters = parseFilters(urlSearchParams);

  // Fetch products from API
  const allProducts = await fetchProducts();
  const products = filterAndSortProducts(allProducts, filters);
  const activeFilters = getActiveFilterLabels(filters);

  return (
    <div className="min-h-screen bg-light-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-2 font-bold text-dark-900 mb-2">
            New Arrivals ({products.length})
          </h1>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map((filter, index) => (
                <span
                  key={`${filter.type}-${filter.value}-${index}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-caption bg-dark-900 text-light-100"
                >
                  {filter.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Suspense fallback={<div>Loading filters...</div>}>
              <Filters />
            </Suspense>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-body text-dark-700">
                Showing {products.length} result
                {products.length !== 1 ? "s" : ""}
              </p>
              <Suspense fallback={<div>Loading sort...</div>}>
                <Sort />
              </Suspense>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const defaultVariant = product.variants[0];
                  const primaryImage =
                    product.images.find((img: any) => img.isPrimary) ||
                    product.images[0];
                  const price =
                    defaultVariant?.salePrice || defaultVariant?.price;
                  const originalPrice = defaultVariant?.salePrice
                    ? defaultVariant.price
                    : null;

                  // Get available colors for this product
                  const availableColors = product.variants
                    .map((variant: any) => variant.color)
                    .filter(
                      (color: any, index: any, self: any) =>
                        color &&
                        self.findIndex((c: unknown) => c?.id === color.id) ===
                          index
                    )
                    .map((color: unknown) => ({
                      name: color.name,
                      value: color.hexCode,
                    }));

                  // Determine badge
                  let badge: "best-seller" | "new" | "sale" | undefined;
                  if (defaultVariant?.salePrice) {
                    badge = "sale";
                  } else if (
                    new Date(product.createdAt) >
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ) {
                    badge = "new";
                  }

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="block"
                    >
                      <Card
                        key={product.id}
                        title={product.name}
                        category={`${product.gender?.label} ${product.category?.name}`}
                        price={
                          originalPrice ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-body-medium font-medium text-dark-900">
                                  ${price}
                                </span>
                                <span className="text-body text-dark-700 line-through">
                                  ${originalPrice}
                                </span>
                              </div>
                            </div>
                          ) : (
                            `$${price}`
                          )
                        }
                        image={
                          primaryImage?.url ||
                          product.mainImage ||
                          "/shoes/shoe-1.jpg"
                        }
                        imageAlt={product.name}
                        colors={availableColors}
                        badge={badge}
                      />
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <h3 className="text-heading-3 font-medium text-dark-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-body text-dark-700 mb-6">
                    Try adjusting your filters or search criteria to find what
                    you&apos;re looking for.
                  </p>
                  <Link
                    href="/products"
                    className="inline-block px-6 py-3 bg-dark-900 text-light-100 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    Clear All Filters
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage(props: ProductsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-light-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-900 mx-auto mb-4"></div>
            <p className="text-body text-dark-700">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsContent {...props} />
    </Suspense>
  );
}
