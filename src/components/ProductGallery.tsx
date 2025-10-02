"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { ImageOff, Check, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductVariant {
  id: string;
  color?: { name: string; hexCode: string; slug: string };
  images?: Array<{ url: string; isPrimary: boolean; sortOrder: number }>;
}

interface ProductGalleryProps {
  variants: ProductVariant[];
  defaultVariantId: string;
}

interface GalleryState {
  selectedVariantId: string;
  selectedImageIndex: number;
  validImages: string[];
}

export default function ProductGallery({
  variants,
  defaultVariantId,
}: ProductGalleryProps) {
  const [galleryState, setGalleryState] = useState<GalleryState>({
    selectedVariantId: defaultVariantId,
    selectedImageIndex: 0,
    validImages: [],
  });

  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Memoize current variant and images to prevent infinite loops
  const currentVariant = useMemo(() => {
    return (
      variants.find((v) => v.id === galleryState.selectedVariantId) ||
      variants[0]
    );
  }, [variants, galleryState.selectedVariantId]);

  const currentImages = useMemo(() => {
    return currentVariant?.images || [];
  }, [currentVariant]);

  // Memoize valid images calculation to prevent infinite loops
  const validImages = useMemo(() => {
    return currentImages
      .filter((img) => !imageErrors.has(img.url))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => img.url);
  }, [currentImages, imageErrors]);

  // Update valid images when variant changes or image errors change
  useEffect(() => {
    setGalleryState((prev) => ({
      ...prev,
      validImages,
      selectedImageIndex: Math.min(
        prev.selectedImageIndex,
        validImages.length - 1
      ),
    }));
  }, [validImages]);

  // Handle image loading errors
  const handleImageError = useCallback((imageUrl: string) => {
    setImageErrors((prev) => new Set([...prev, imageUrl]));
  }, []);

  // Handle variant selection (color swatch)
  const handleVariantSelect = useCallback((variantId: string) => {
    setGalleryState((prev) => ({
      ...prev,
      selectedVariantId: variantId,
      selectedImageIndex: 0,
    }));
  }, []);

  // Handle thumbnail selection
  const handleThumbnailSelect = useCallback((index: number) => {
    setGalleryState((prev) => ({
      ...prev,
      selectedImageIndex: index,
    }));
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (validImages.length <= 1) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setGalleryState((prev) => ({
            ...prev,
            selectedImageIndex:
              prev.selectedImageIndex > 0
                ? prev.selectedImageIndex - 1
                : validImages.length - 1,
          }));
          break;
        case "ArrowRight":
          event.preventDefault();
          setGalleryState((prev) => ({
            ...prev,
            selectedImageIndex:
              prev.selectedImageIndex < validImages.length - 1
                ? prev.selectedImageIndex + 1
                : 0,
          }));
          break;
      }
    },
    [validImages.length]
  );

  // Get variants with valid images for color swatches
  const variantsWithImages = variants.filter(
    (variant) =>
      variant.images && variant.images.some((img) => !imageErrors.has(img.url))
  );

  const currentImageUrl = validImages[galleryState.selectedImageIndex];

  return (
    <div className="space-y-4">
      {/* Desktop Layout: Thumbnails on left, Main image on right */}
      <div className="lg:flex lg:gap-4 lg:flex-row-reverse">
        {/* Main Image Display */}
        <div className="lg:flex-1">
          <div className="relative aspect-square bg-light-200 rounded-lg overflow-hidden">
            {currentImageUrl ? (
              <Image
                src={currentImageUrl}
                alt={currentVariant?.color?.name || "Product image"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                onError={() => handleImageError(currentImageUrl)}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <ImageOff className="w-16 h-16 text-dark-500 mx-auto mb-2" />
                  <p className="text-dark-700 text-body">No image available</p>
                </div>
              </div>
            )}

            {/* Navigation Arrows for Mobile */}
            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    handleThumbnailSelect(
                      galleryState.selectedImageIndex > 0
                        ? galleryState.selectedImageIndex - 1
                        : validImages.length - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-light-100 bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all lg:hidden"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-dark-900" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleThumbnailSelect(
                      galleryState.selectedImageIndex < validImages.length - 1
                        ? galleryState.selectedImageIndex + 1
                        : 0
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-light-100 bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all lg:hidden"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-dark-900" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thumbnail Strip - Desktop: Vertical, Mobile: Horizontal */}
        {validImages.length > 1 && (
          <div className="lg:w-20 lg:flex-shrink-0 mt-4 lg:mt-0">
            <div
              className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:overflow-x-visible scrollbar-hide pb-2 lg:pb-0 lg:max-h-96"
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="tablist"
              aria-label="Product images"
            >
              {validImages.map((imageUrl, index) => (
                <button
                  type="button"
                  key={`${galleryState.selectedVariantId}-${index}`}
                  onClick={() => handleThumbnailSelect(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleThumbnailSelect(index);
                    }
                  }}
                  className={`relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === galleryState.selectedImageIndex
                      ? "border-dark-900"
                      : "border-light-400 hover:border-dark-500"
                  }`}
                  role="tab"
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={imageUrl}
                    alt={`Product thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                    onError={() => handleImageError(imageUrl)}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Color Swatches */}
      {variantsWithImages.length > 1 && (
        <div className="flex items-center gap-3 mt-4">
          <span className="text-dark-700 text-caption font-medium">
            Colors:
          </span>
          <div className="flex gap-2">
            {variantsWithImages.map((variant) => (
              <button
                type="button"
                key={variant.id}
                onClick={() => handleVariantSelect(variant.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleVariantSelect(variant.id);
                  }
                }}
                className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                  variant.id === galleryState.selectedVariantId
                    ? "border-dark-900 scale-110"
                    : "border-light-400 hover:border-dark-500"
                }`}
                style={{
                  backgroundColor: variant.color?.hexCode || "#ccc",
                }}
                title={variant.color?.name}
                aria-label={`Select ${variant.color?.name} color`}
              >
                {variant.id === galleryState.selectedVariantId && (
                  <Check className="w-4 h-4 text-light-100 absolute inset-0 m-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Counter */}
      {validImages.length > 1 && (
        <div className="text-center lg:hidden">
          <span className="text-dark-700 text-caption">
            {galleryState.selectedImageIndex + 1} of {validImages.length}
          </span>
        </div>
      )}
    </div>
  );
}
