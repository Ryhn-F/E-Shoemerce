"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CartItem as CartItemType } from "@/src/store/cart.store";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  isUpdating?: boolean;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}: CartItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsLoading(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await onRemove(item.id);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPrice = item.salePrice || item.price;
  const hasDiscount = !!item.salePrice;

  return (
    <div className="flex gap-4 py-6 border-b border-light-300 last:border-b-0">
      {/* Product Image */}
      <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-light-200 rounded-lg overflow-hidden">
        <Image
          src={item.productImage}
          alt={item.productName}
          width={128}
          height={128}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-body-medium font-medium text-dark-900 truncate">
              {item.productName}
            </h3>

            {/* Variant Details */}
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-2 text-caption text-dark-700">
                <span>Color:</span>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full border border-light-400"
                    data-color={item.colorValue}
                  />
                  <span>{item.colorName}</span>
                </div>
              </div>
              <div className="text-caption text-dark-700">
                Size: {item.sizeName}
              </div>
              <div className="text-caption text-dark-500">
                SKU: {item.variantSku}
              </div>
            </div>

            {/* Price */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-body-medium font-medium text-dark-900">
                ${parseFloat(currentPrice).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-caption text-dark-500 line-through">
                  ${parseFloat(item.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={isLoading || isUpdating}
            className="p-2 text-dark-500 hover:text-red transition-colors disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border border-light-400 rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isLoading || isUpdating}
              className="p-2 hover:bg-light-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="px-4 py-2 text-body-medium font-medium min-w-[3rem] text-center">
              {item.quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isLoading || isUpdating}
              className="p-2 hover:bg-light-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-body-medium font-medium text-dark-900">
            ${(parseFloat(currentPrice) * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
