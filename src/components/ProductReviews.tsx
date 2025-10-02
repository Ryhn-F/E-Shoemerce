import { Star } from "lucide-react";
import { getProductReviews } from "@/src/lib/actions/product";
import { ProductReviewsProps } from "@/src/lib/types/product";
import CollapsibleReviewText from "./CollapsibleReviewText";

interface ReviewCardProps {
  review: {
    id: string;
    author: string;
    rating: number;
    content: string;
    createdAt: string;
  };
}

function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-orange text-orange"
            : "fill-light-300 text-light-300"
        }`}
        aria-hidden="true"
      />
    ));
  };

  return (
    <article className="border-b border-light-300 pb-6 last:border-b-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-body-medium font-medium text-dark-900 mb-1">
            {review.author}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="flex items-center gap-1"
              role="img"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {renderStars(review.rating)}
            </div>
            <span className="text-caption text-dark-700">
              {review.rating} out of 5 stars
            </span>
          </div>
        </div>
        <time
          className="text-caption text-dark-600"
          dateTime={review.createdAt}
        >
          {formatDate(review.createdAt)}
        </time>
      </div>

      <div className="text-body text-dark-800 leading-relaxed">
        <CollapsibleReviewText content={review.content} />
      </div>
    </article>
  );
}

function ReviewsEmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-light-200 rounded-full flex items-center justify-center">
        <Star className="w-8 h-8 text-dark-400" />
      </div>
      <h3 className="text-body-large font-medium text-dark-900 mb-2">
        No Reviews Yet
      </h3>
      <p className="text-body text-dark-700">
        Be the first to share your thoughts about this product.
      </p>
    </div>
  );
}

export default async function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const reviews = await getProductReviews(productId);

  if (reviews.length === 0) {
    return (
      <section className="mt-16" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-heading-3 font-bold mb-8">
          Reviews
        </h2>
        <ReviewsEmptyState />
      </section>
    );
  }

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section className="mt-16" aria-labelledby="reviews-heading">
      <div className="flex items-center justify-between mb-8">
        <h2 id="reviews-heading" className="text-heading-3 font-bold">
          Reviews ({reviews.length})
        </h2>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1"
            role="img"
            aria-label={`Average rating: ${averageRating.toFixed(
              1
            )} out of 5 stars`}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={`w-5 h-5 ${
                  index < Math.round(averageRating)
                    ? "fill-orange text-orange"
                    : "fill-light-300 text-light-300"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-body-medium font-medium text-dark-900">
            {averageRating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviews.length >= 10 && (
        <div className="mt-8 text-center">
          <p className="text-caption text-dark-600">
            Showing the 10 most recent reviews
          </p>
        </div>
      )}
    </section>
  );
}
