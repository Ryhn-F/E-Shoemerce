// NOTE: This is the original server-side AlsoLikeSection component
// It's been replaced by DynamicAlsoLikeSection for partial page rendering
// Kept for reference and potential fallback usage

import Link from "next/link";
import { getRecommendedProducts } from "@/src/lib/actions/product";
import { AlsoLikeSectionProps } from "@/src/lib/types/product";
import Card from "./Card";

export default async function AlsoLikeSection({
  productId,
}: AlsoLikeSectionProps) {
  const recommendations = await getRecommendedProducts(productId);

  // Hide section if no recommendations
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-16" aria-labelledby="recommendations-heading">
      <h2
        id="recommendations-heading"
        className="text-heading-3 font-bold mb-8"
      >
        You Might Also Like
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="block"
          >
            <Card
              title={product.name}
              category={product.category.name}
              price={
                product.salePrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-body-medium font-medium text-red">
                      ${product.salePrice}
                    </span>
                    <span className="text-caption text-dark-600 line-through">
                      ${product.price}
                    </span>
                  </div>
                ) : (
                  `$${product.price}`
                )
              }
              image={product.mainImage || "/placeholder-image.jpg"}
              imageAlt={product.name}
              badge={product.salePrice ? "sale" : undefined}
              className="hover:shadow-lg transition-shadow duration-300"
            />
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-caption text-dark-600">
          Showing {recommendations.length} recommended product
          {recommendations.length !== 1 ? "s" : ""}
        </p>
      </div>
    </section>
  );
}
