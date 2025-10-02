import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getProduct } from "@/src/lib/actions/product";
import ProductNotFound from "@/src/components/ProductNotFound";
import CachedProductSection from "@/src/components/CachedProductSection";
import ProductReviews from "@/src/components/ProductReviews";
import ReviewsSkeleton from "@/src/components/ReviewsSkeleton";
import RecommendationsSkeleton from "@/src/components/RecommendationsSkeleton";

// Dynamic import for AlsoLikeSection to enable partial page rendering
const DynamicAlsoLikeSection = dynamic(
  () => import("@/src/components/DynamicAlsoLikeSection"),
  {
    loading: () => <RecommendationsSkeleton />,
    ssr: true, // Client-side only for fresh recommendations
  }
);

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Configure ISR - cache for 1 hour, then revalidate in background
export const revalidate = 3600; // Cache for 1 hour

// Generate static params for popular products (optional - improves performance)
export async function generateStaticParams() {
  try {
    // You can fetch popular product IDs here for pre-generation
    // For now, return empty array to generate on-demand
    return [];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen bg-light-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cached Product Section - Static with ISR */}
        <CachedProductSection product={product} />

        {/* Reviews Section - SSR with Suspense */}
        <Suspense fallback={<ReviewsSkeleton />}>
          <ProductReviews productId={product.id} />
        </Suspense>

        {/* Also Like Section - Dynamic with fresh data */}
        <DynamicAlsoLikeSection productId={product.id} />
      </div>
    </div>
  );
}
