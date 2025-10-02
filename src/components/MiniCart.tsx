"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/src/store/cart.store";

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const cartRef = useRef<HTMLDivElement>(null);
  const { items, getTotalItems, getTotalPrice } = useCartStore();

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-0 z-50 lg:absolute lg:inset-auto lg:right-0 lg:top-full lg:w-96">
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div
        ref={cartRef}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl lg:relative lg:h-auto lg:max-h-96 lg:rounded-lg lg:border lg:border-light-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-light-300">
          <h3 className="text-body-medium font-medium text-dark-900">
            Cart ({totalItems})
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-light-200 rounded-md transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto max-h-64">
          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-dark-500 mb-4" />
              <p className="text-body text-dark-700 mb-4">Your cart is empty</p>
              <Link
                href="/products"
                onClick={onClose}
                className="text-dark-900 hover:text-dark-700 underline"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-light-200 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-caption font-medium text-dark-900 truncate">
                      {item.productName}
                    </h4>
                    <p className="text-footnote text-dark-700">
                      {item.colorName} • {item.sizeName}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-footnote text-dark-500">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-caption font-medium text-dark-900">
                        $
                        {(
                          parseFloat(item.salePrice || item.price) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {items.length > 3 && (
                <p className="text-caption text-dark-500 text-center">
                  +{items.length - 3} more items
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {totalItems > 0 && (
          <div className="border-t border-light-300 p-4 space-y-3">
            <div className="flex justify-between text-body-medium font-medium">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full text-center py-2 px-4 border border-dark-900 text-dark-900 rounded-md hover:bg-dark-900 hover:text-light-100 transition-colors"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full text-center py-2 px-4 bg-dark-900 text-light-100 rounded-md hover:bg-dark-700 transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
