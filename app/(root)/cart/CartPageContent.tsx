"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/src/store/cart.store";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/src/lib/actions/cart";
import CartItem from "@/src/components/CartItem";
import CartSummary from "@/src/components/CartSummary";

export default function CartPageContent() {
  const router = useRouter();
  const {
    items,
    isLoading,
    setItems,
    setLoading,
    updateQuantity,
    removeItem,
    clearCart: clearStoreCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const [isUpdating, setIsUpdating] = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCart();
      if (result.success && result.items) {
        // Convert server items to store format
        const storeItems = result.items.map((item) => ({
          id: item.id,
          productVariantId: item.productVariantId,
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          variantSku: item.variantSku,
          colorName: item.colorName,
          colorValue: item.colorValue,
          sizeName: item.sizeName,
          price: item.price,
          salePrice: item.salePrice || undefined,
          quantity: item.quantity,
        }));
        setItems(storeItems);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  }, [setItems, setLoading]);

  // Load cart data on mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    setIsUpdating(true);
    try {
      const result = await updateCartItem(itemId, quantity);
      if (result.success) {
        updateQuantity(itemId, quantity);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdating(true);
    try {
      const result = await removeCartItem(itemId);
      if (result.success) {
        removeItem(itemId);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    setIsUpdating(true);
    try {
      const result = await clearCart();
      if (result.success) {
        clearStoreCart();
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) {
    return <EmptyCart />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-light-200 rounded-md transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-heading-2 font-bold text-dark-900">
            Shopping Cart ({totalItems})
          </h1>
        </div>

        {totalItems > 0 && (
          <button
            onClick={handleClearCart}
            disabled={isUpdating}
            className="text-dark-500 hover:text-red text-body underline transition-colors disabled:opacity-50"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6">
            <div className="space-y-0">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  isUpdating={isUpdating}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div>
          <CartSummary subtotal={totalPrice} itemCount={totalItems} />
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  const router = useRouter();

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-light-200 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-dark-500" />
        </div>

        <h1 className="text-heading-2 font-bold text-dark-900 mb-4">
          Your cart is empty
        </h1>

        <p className="text-body text-dark-700 mb-8">
          Looks like you haven&apos;t added any items to your cart yet. Start
          shopping to fill it up!
        </p>

        <button
          onClick={() => router.push("/products")}
          className="bg-dark-900 text-light-100 px-8 py-3 rounded-md font-medium hover:bg-dark-700 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
}

function CartPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-light-300 rounded-md"></div>
        <div className="h-8 bg-light-300 rounded w-64"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-4 py-6 border-b border-light-300 last:border-b-0"
              >
                <div className="w-32 h-32 bg-light-300 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-light-300 rounded w-3/4"></div>
                  <div className="h-4 bg-light-300 rounded w-1/2"></div>
                  <div className="h-4 bg-light-300 rounded w-1/4"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-10 bg-light-300 rounded w-32"></div>
                    <div className="h-5 bg-light-300 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 h-fit">
          <div className="h-6 bg-light-300 rounded w-32 mb-4"></div>
          <div className="space-y-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-light-300 rounded w-20"></div>
                <div className="h-4 bg-light-300 rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="h-12 bg-light-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
