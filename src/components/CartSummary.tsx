"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/auth";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  onCheckout?: () => void;
}

export default function CartSummary({
  subtotal,
  itemCount,
  onCheckout,
}: CartSummaryProps) {
  const router = useRouter();
  const { user } = useAuth();

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) {
      // Redirect to auth page for guest users
      router.push("/auth?callbackUrl=/cart");
      return;
    }

    // Proceed with checkout for authenticated users
    if (onCheckout) {
      onCheckout();
    } else {
      // Default checkout behavior - redirect to checkout page
      router.push("/checkout");
    }
  };

  return (
    <div className="bg-light-100 rounded-lg p-6 h-fit">
      <h2 className="text-heading-3 font-medium text-dark-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-body">
          <span className="text-dark-700">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="text-dark-900 font-medium">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-body">
          <span className="text-dark-700">Shipping</span>
          <span className="text-dark-900 font-medium">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-body">
          <span className="text-dark-700">Tax</span>
          <span className="text-dark-900 font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-light-300 pt-3">
          <div className="flex justify-between text-body-medium font-medium">
            <span className="text-dark-900">Total</span>
            <span className="text-dark-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {subtotal < 100 && (
        <div className="mb-4 p-3 bg-orange/10 border border-orange/20 rounded-md">
          <p className="text-caption text-orange">
            Add ${(100 - subtotal).toFixed(2)} more for free shipping
          </p>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={itemCount === 0}
        className="w-full bg-dark-900 text-light-100 py-3 px-6 rounded-md font-medium hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {!user ? "Sign In to Checkout" : "Proceed to Checkout"}
      </button>

      <div className="mt-4 text-center">
        <button
          onClick={() => router.push("/products")}
          className="text-dark-700 hover:text-dark-900 text-body underline transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
