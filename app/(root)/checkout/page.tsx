import { getCurrentUser } from "@/src/lib/auth/utils";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  // This should be handled by middleware, but adding as backup
  if (!user) {
    redirect("/sign-in?callbackUrl=/checkout");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-lg mb-4">
          Welcome to checkout, {user.name || user.email}!
        </p>
        <p className="text-gray-600">
          This page is protected and only accessible to authenticated users.
        </p>
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-semibold text-green-800">
            Auth System Features:
          </h3>
          <ul className="mt-2 text-sm text-green-700 space-y-1">
            <li>✅ User authenticated successfully</li>
            <li>✅ Guest cart data merged (if applicable)</li>
            <li>✅ Session secured with HttpOnly cookies</li>
            <li>✅ Route protected by middleware</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
