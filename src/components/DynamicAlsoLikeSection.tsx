"use client";

import { useEffect, useState } from "react";
import { RecommendedProduct } from "@/src/lib/types/product";
import Link from "next/link";
import Card from "./Card";
import RecommendationsSkeleton from "./RecommendationsSkeleton";

interface DynamicAlsoLikeSectionProps {
  productId: string;
}

export default function DynamicAlsoLikeSection({
  productId,
}: DynamicAlsoLikeSectionProps) {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/products/${productId}/recommendations`,
          {
            // Disable caching for fresh recommendations
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load recommendations"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId]);

  if (loading) {
    return <RecommendationsSkeleton />;
  }

  if (error) {
    return (
      <section className="mt-16">
        <div className="text-center py-8">
          <p className="text-dark-600 mb-4">Failed to load recommendations</p>
          <button
            onClick={() => window.location.reload()}
            className="text-dark-900 hover:text-dark-700 underline"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

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
                  `${product.price}`
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
