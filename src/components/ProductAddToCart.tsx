"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

interface ProductVariant {
  id: string;
  sku: string;
  price: string;
  salePrice?: string;
  colorId: string;
  colorName: string;
  colorValue: string;
  sizeId: string;
  sizeName: string;
  inStock: number;
}

interface ProductAddToCartProps {
  productId: string;
  productName: string;
  productImage: string;
  variants: ProductVariant[];
  selectedColorId?: string;
  selectedSizeId?: string;
}

export default function ProductAddToCart({
  productId,
  productName,
  productImage,
  variants,
  selectedColorId,
  selectedSizeId,
}: ProductAddToCartProps) {
  const [quantity, setQuantity] = useState(1);

  // Find the selected variant
  const selectedVariant = variants.find(
    (variant) =>
      variant.colorId === selectedColorId && variant.sizeId === selectedSizeId
  );

  const isOutOfStock = selectedVariant ? selectedVariant.inStock === 0 : true;
  const isVariantSelected = selectedColorId && selectedSizeId;

  if (!isVariantSelected) {
    return (
      <div className="space-y-4">
        <div className="text-center p-4 bg-light-200 rounded-md">
          <p className="text-body text-dark-700">
            Please select a color and size to add to cart
          </p>
        </div>
      </div>
    );
  }

  if (isOutOfStock) {
    return (
      <div className="space-y-4">
        <div className="text-center p-4 bg-red/10 border border-red/20 rounded-md">
          <p className="text-body text-red">
            This variant is currently out of stock
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="text-body-medium font-medium">
          Quantity:
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="border border-light-400 rounded-md px-3 py-2 text-body"
        >
          {Array.from(
            { length: Math.min(selectedVariant!.inStock, 10) },
            (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            )
          )}
        </select>
        <span className="text-caption text-dark-500">
          {selectedVariant!.inStock} available
        </span>
      </div>

      {/* Add to Cart Button */}
      <AddToCartButton
        productVariantId={selectedVariant!.id}
        productId={productId}
        productName={productName}
        productImage={productImage}
        variantSku={selectedVariant!.sku}
        colorName={selectedVariant!.colorName}
        colorValue={selectedVariant!.colorValue}
        sizeName={selectedVariant!.sizeName}
        price={selectedVariant!.price}
        salePrice={selectedVariant!.salePrice}
        quantity={quantity}
        size="lg"
        className="w-full"
      />
    </div>
  );
}
