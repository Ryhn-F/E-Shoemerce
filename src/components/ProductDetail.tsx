import { Heart, ShoppingBag, Star } from "lucide-react";
import ProductGallery from "./ProductGallery";
import SizePicker from "./SizePicker";
import CollapsibleSection from "./CollapsibleSection";
import { cache } from "react";

interface ProductDetailProps {
  product: {
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
  };
}

// Cached helper function to calculate discount percentage
const calculateDiscountPercentage = cache(
  (originalPrice: string, salePrice: string): number => {
    const original = parseFloat(originalPrice);
    const sale = parseFloat(salePrice);
    return Math.round(((original - sale) / original) * 100);
  }
);

export default function ProductDetail({ product }: ProductDetailProps) {
  const defaultVariant =
    product.variants.find((v) => v.id === product.defaultVariantId) ||
    product.variants[0];

  // Get available sizes for this product
  const availableSizes = product.variants
    .map((variant) => variant.size)
    .filter(
      (size, index, self) =>
        size && self.findIndex((s) => s?.slug === size.slug) === index
    )
    .filter(Boolean) as Array<{ id: string; name: string; slug: string }>;

  // Calculate pricing information
  const currentPrice =
    defaultVariant?.salePrice || defaultVariant?.price || "0";
  const originalPrice = defaultVariant?.salePrice ? defaultVariant.price : null;
  const discountPercentage =
    originalPrice && defaultVariant?.salePrice
      ? calculateDiscountPercentage(originalPrice, defaultVariant.salePrice)
      : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Product Gallery */}
      <div className="order-1">
        <ProductGallery
          variants={product.variants}
          defaultVariantId={product.defaultVariantId}
        />
      </div>

      {/* Product Information */}
      <div className="order-2 lg:order-2">
        {/* Breadcrumb / Category */}
        {product.category && (
          <div className="mb-4">
            <span className="text-dark-700 text-caption font-medium">
              {product.gender?.label} {product.category.name}
            </span>
          </div>
        )}

        {/* Product Title */}
        <h1 className="text-heading-2 font-bold text-dark-900 mb-4">
          {product.name}
        </h1>

        {/* Rating (placeholder) */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-orange text-orange" />
            ))}
          </div>
          <span className="text-dark-700 text-caption">(10)</span>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-heading-3 font-bold text-dark-900">
              ${currentPrice}
            </span>
            {originalPrice && (
              <>
                <span className="text-body text-dark-700 line-through">
                  ${originalPrice}
                </span>
                {discountPercentage && (
                  <span className="bg-green text-light-100 px-2 py-1 text-caption font-medium rounded">
                    Extra {discountPercentage}% off w/ code SPORT
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Size Picker */}
        {availableSizes.length > 0 && (
          <div className="mb-8">
            <SizePicker sizes={availableSizes} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button
            type="button"
            className="w-full bg-dark-900 text-light-100 py-4 px-6 rounded-lg font-medium hover:bg-dark-700 transition-colors flex items-center justify-center gap-2"
            aria-label="Add product to shopping bag"
          >
            <ShoppingBag className="w-5 h-5" />
            Add to Bag
          </button>
          <button
            type="button"
            className="w-full border border-dark-900 text-dark-900 py-4 px-6 rounded-lg font-medium hover:bg-light-200 transition-colors flex items-center justify-center gap-2"
            aria-label="Add product to favorites"
          >
            <Heart className="w-5 h-5" />
            Favorite
          </button>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          <CollapsibleSection title="Product Details" defaultExpanded>
            <div className="space-y-4">
              <p className="text-body text-dark-700">{product.description}</p>
              <ul className="space-y-2 text-body text-dark-700">
                <li>• Padded collar</li>
                <li>• Foam midsole</li>
                <li>• Shown: Dark Team Red/Platinum/White Platinum/White</li>
                <li>• Style: {defaultVariant?.sku}</li>
              </ul>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Shipping & Returns">
            <div className="space-y-4 text-body text-dark-700">
              <p>Free standard shipping on orders $50+</p>
              <p>Free 60-day returns for Nike Members</p>
              <p>Estimated delivery: 3-7 business days</p>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Reviews (10)">
            <div className="text-center py-8">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-orange text-orange" />
                ))}
              </div>
              <p className="text-body text-dark-700 mb-2">4.8 out of 5 stars</p>
              <p className="text-caption text-dark-500">Based on 10 reviews</p>
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
