import { Suspense } from "react";
import CartPageContent from "./CartPageContent";

export const metadata = {
  title: "Shopping Cart | Nike",
  description: "Review and manage items in your shopping cart",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-light-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<CartPageSkeleton />}>
          <CartPageContent />
        </Suspense>
      </div>
    </div>
  );
}

function CartPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-light-300 rounded w-48 mb-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-6 bg-white rounded-lg">
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
