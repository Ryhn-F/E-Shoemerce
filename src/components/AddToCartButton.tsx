"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/src/store/cart.store";
import { addCartItem } from "@/src/lib/actions/cart";

interface AddToCartButtonProps {
  productVariantId: string;
  productId: string;
  productName: string;
  productImage: string;
  variantSku: string;
  colorName: string;
  colorValue: string;
  sizeName: string;
  price: string;
  salePrice?: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AddToCartButton({
  productVariantId,
  productId,
  productName,
  productImage,
  variantSku,
  colorName,
  colorValue,
  sizeName,
  price,
  salePrice,
  quantity = 1,
  disabled = false,
  className = "",
  size = "md",
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, getItemByVariant } = useCartStore();

  const existingItem = getItemByVariant(productVariantId);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Add to server
      const result = await addCartItem(productVariantId, quantity);

      if (result.success) {
        // Add to store
        addItem({
          productVariantId,
          productId,
          productName,
          productImage,
          variantSku,
          colorName,
          colorValue,
          sizeName,
          price,
          salePrice,
          quantity,
        });

        // Show success state
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200
        ${
          isAdded
            ? "bg-green text-white"
            : "bg-dark-900 text-light-100 hover:bg-dark-700"
        }
        ${sizeClasses[size]}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <div
            className={`animate-spin rounded-full border-2 border-white border-t-transparent ${iconSizes[size]}`}
          />
          Adding...
        </>
      ) : isAdded ? (
        <>
          <Check className={iconSizes[size]} />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingCart className={iconSizes[size]} />
          {existingItem
            ? `Add More (${existingItem.quantity} in cart)`
            : "Add to Cart"}
        </>
      )}
    </button>
  );
}
