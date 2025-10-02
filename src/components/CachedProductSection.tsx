import { ProductWithDetails } from "@/src/lib/types/product";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductMeta from "./ProductMeta";

interface CachedProductSectionProps {
  product: ProductWithDetails;
}

export default function CachedProductSection({
  product,
}: CachedProductSectionProps) {
  // Transform variants for ProductGallery component
  const galleryVariants = product.variants.map((variant) => ({
    id: variant.id,
    color: variant.color,
    images: variant.images,
  }));

  return (
    <>
      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Product Gallery */}
        <div className="order-1">
          {galleryVariants.length > 0 &&
          galleryVariants.some((v) => v.images && v.images.length > 0) ? (
            <ProductGallery
              variants={galleryVariants}
              defaultVariantId={
                product.defaultVariantId || galleryVariants[0].id
              }
            />
          ) : (
            <div className="aspect-square bg-light-200 rounded-lg flex items-center justify-center">
              <p className="text-dark-600">No images available</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="order-2">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Product Meta */}
      <ProductMeta product={product} />
    </>
  );
}
