import Link from "next/link";
import { getEnrichedProducts } from "@/src/lib/mock-data";
import Card from "./Card";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
}

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; slug: string };
  gender?: { id: string; label: string; slug: string };
  variants: Array<{
    id: string;
    sku: string;
    price: string;
    salePrice?: string | null;
    color?: { id: string; name: string; hexCode: string; slug: string };
    size?: { id: string; name: string; slug: string };
    inStock: number;
    images?: Array<{ url: string; isPrimary: boolean; sortOrder: number }>;
  }>;
  defaultVariantId: string;
  createdAt: Date;
}

// Helper function to get related products (SSR - will re-render on refresh)
// This function intentionally does NOT use caching to ensure fresh data on each request
function getRelatedProducts(
  currentProductId: string,
  categoryId?: string
): ProductDetail[] {
  const allProducts = getEnrichedProducts();

  // Add some randomization to simulate dynamic content
  const filteredProducts = allProducts
    .filter((p) => p.id !== currentProductId)
    .filter((p) => !categoryId || p.category?.id === categoryId);

  // Shuffle and take first 3 to simulate dynamic recommendations
  const shuffled = [...filteredProducts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// Force this component to be server-side rendered on every request
export const dynamic = "force-dynamic";

export default function RelatedProducts({
  currentProductId,
  categoryId,
}: RelatedProductsProps) {
  const relatedProducts = getRelatedProducts(currentProductId, categoryId);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-heading-3 font-medium text-dark-900 mb-8">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProducts.map((relatedProduct) => {
          const defaultVariant = relatedProduct.variants[0];

          // Apply image guard rules - find first valid image
          const validImages =
            defaultVariant?.images?.filter((img) => img.url) || [];
          const primaryImage =
            validImages.find((img) => img.isPrimary) || validImages[0];
          const imageUrl = primaryImage?.url || "/shoes/shoe-1.jpg";

          const price = defaultVariant?.salePrice || defaultVariant?.price;
          const originalPrice = defaultVariant?.salePrice
            ? defaultVariant.price
            : null;

          // Get available colors for this product
          const availableColors = relatedProduct.variants
            .map((variant) => variant.color)
            .filter(
              (color, index, self) =>
                color && self.findIndex((c) => c?.slug === color.slug) === index
            )
            .map((color) => ({
              name: color!.name,
              value: color!.hexCode,
            }));

          // Determine badge
          let badge: "best-seller" | "new" | "sale" | undefined;
          if (defaultVariant?.salePrice) {
            badge = "sale";
          } else if (
            new Date(relatedProduct.createdAt) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ) {
            badge = "new";
          }

          return (
            <Link
              key={relatedProduct.id}
              href={`/products/${relatedProduct.id}`}
              className="block"
            >
              <Card
                title={relatedProduct.name}
                category={`${relatedProduct.gender?.label} ${relatedProduct.category?.name}`}
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
                    `${price}`
                  )
                }
                image={imageUrl}
                imageAlt={relatedProduct.name}
                colors={availableColors}
                badge={badge}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
