"use client";

import { useState } from "react";
import { ProductInfoProps } from "@/src/lib/types/product";
import SizePicker from "./SizePicker";
import { addCartItem } from "@/src/lib/actions/cart";
import { useCartStore } from "@/src/store/cart.store";

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();
  // Get unique colors from variants
  const availableColors = product.variants.reduce((colors, variant) => {
    const existingColor = colors.find((c) => c.id === variant.color.id);
    if (!existingColor) {
      colors.push(variant.color);
    }
    return colors;
  }, [] as (typeof product.variants)[0]["color"][]);

  // Get unique sizes from variants
  const availableSizes = product.variants.reduce((sizes, variant) => {
    const existingSize = sizes.find((s) => s.id === variant.size.id);
    if (!existingSize) {
      sizes.push(variant.size);
    }
    return sizes;
  }, [] as (typeof product.variants)[0]["size"][]);

  // Get price range
  const prices = product.variants.map((v) => parseFloat(v.price));
  const salePrices = product.variants
    .filter((v) => v.salePrice)
    .map((v) => parseFloat(v.salePrice!));

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minSalePrice = salePrices.length > 0 ? Math.min(...salePrices) : null;
  const maxSalePrice = salePrices.length > 0 ? Math.max(...salePrices) : null;

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const renderPricing = () => {
    const hasVariablePricing = minPrice !== maxPrice;
    const hasSale = minSalePrice !== null;

    if (hasSale) {
      return (
        <div className="flex items-center gap-3">
          <span className="text-heading-3 font-bold text-red">
            {hasVariablePricing && minSalePrice !== maxSalePrice
              ? `${formatPrice(minSalePrice!)} - ${formatPrice(maxSalePrice!)}`
              : formatPrice(minSalePrice!)}
          </span>
          <span className="text-body-large text-dark-600 line-through">
            {hasVariablePricing
              ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
              : formatPrice(minPrice)}
          </span>
        </div>
      );
    }

    return (
      <span className="text-heading-3 font-bold text-dark-900">
        {hasVariablePricing
          ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
          : formatPrice(minPrice)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Product Title and Category */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-caption text-dark-700 font-medium">
            {product.category.name}
          </span>
          <span className="text-caption text-dark-500">•</span>
          <span className="text-caption text-dark-700">
            {product.brand.name}
          </span>
          <span className="text-caption text-dark-500">•</span>
          <span className="text-caption text-dark-700">
            {product.gender.label}
          </span>
        </div>

        <h1 className="text-heading-2 font-bold text-dark-900 mb-4">
          {product.name}
        </h1>
      </div>

      {/* Pricing */}
      <div className="pb-6 border-b border-light-300">{renderPricing()}</div>

      {/* Color Selection */}
      {availableColors.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-body-medium font-medium text-dark-900">Color</h3>
          <div className="flex gap-3">
            {availableColors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setSelectedColorId(color.id)}
                className={`relative w-10 h-10 rounded-full border-2 transition-colors ${
                  selectedColorId === color.id
                    ? "border-dark-900 ring-2 ring-dark-900 ring-offset-2"
                    : "border-light-400 hover:border-dark-900"
                }`}
                style={{ backgroundColor: color.hexCode }}
                title={color.name}
                aria-label={`Select ${color.name} color`}
              >
                <span className="sr-only">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <SizePicker
          sizes={availableSizes}
          selectedSize={selectedSizeId || undefined}
          onSizeSelect={setSelectedSizeId}
        />
      )}

      {/* Stock Status */}
      <div className="text-caption text-dark-700">
        {product.variants.some((v) => v.inStock > 0) ? (
          <span className="text-green font-medium">In Stock</span>
        ) : (
          <span className="text-red font-medium">Out of Stock</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-6">
        <button
          type="button"
          onClick={async () => {
            if (selectedSizeId && selectedColorId) {
              const selectedVariant = product.variants.find(
                (v) =>
                  v.size.id === selectedSizeId && v.color.id === selectedColorId
              );

              if (selectedVariant) {
                setIsAddingToCart(true);
                try {
                  console.log(
                    "Adding to server cart with variant ID:",
                    selectedVariant.id
                  );

                  // Add to server cart
                  const result = await addCartItem(selectedVariant.id, 1);

                  console.log("Server cart result:", result);

                  if (result.success) {
                    console.log(
                      "Successfully added to server cart, now adding to client store"
                    );
                    // Add to client store
                    addItem({
                      productVariantId: selectedVariant.id,
                      productId: product.id,
                      productName: product.name,
                      productImage:
                        selectedVariant.images?.[0]?.url ||
                        "/placeholder-product.jpg",
                      variantSku: selectedVariant.sku,
                      colorName: selectedVariant.color.name,
                      colorValue: selectedVariant.color.hexCode,
                      sizeName: selectedVariant.size.name,
                      price: selectedVariant.price,
                      salePrice: selectedVariant.salePrice || undefined,
                      quantity: 1,
                    });

                    // Show success state
                    setIsAdded(true);
                    setTimeout(() => setIsAdded(false), 2000);
                  } else {
                    console.error(
                      "Failed to add to server cart:",
                      result.error
                    );
                  }
                } catch (error) {
                  console.error("Error adding to cart:", error);
                } finally {
                  setIsAddingToCart(false);
                }
              } else {
                console.error("No variant found for selected size and color");
              }
            } else {
              console.log(
                "Missing selections - Size:",
                selectedSizeId,
                "Color:",
                selectedColorId
              );
            }
          }}
          className={`w-full py-4 px-6 rounded-lg font-medium transition-colors disabled:bg-dark-400 disabled:cursor-not-allowed ${
            isAdded
              ? "bg-green text-white"
              : "bg-dark-900 text-light-100 hover:bg-dark-800"
          }`}
          disabled={
            isAddingToCart ||
            !selectedSizeId ||
            !selectedColorId ||
            !product.variants.find(
              (v) =>
                v.size.id === selectedSizeId &&
                v.color.id === selectedColorId &&
                v.inStock > 0
            )
          }
        >
          {isAddingToCart ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Adding to Cart...
            </div>
          ) : isAdded ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Added to Cart!
            </div>
          ) : !selectedSizeId || !selectedColorId ? (
            "Select Size & Color"
          ) : (
            "Add to Cart"
          )}
        </button>

        <button
          type="button"
          className="w-full border border-dark-900 text-dark-900 py-4 px-6 rounded-lg font-medium hover:bg-light-200 transition-colors"
        >
          Add to Wishlist
        </button>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="pt-6 border-t border-light-300">
          <h3 className="text-body-medium font-medium text-dark-900 mb-3">
            Description
          </h3>
          <p className="text-body text-dark-800 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
