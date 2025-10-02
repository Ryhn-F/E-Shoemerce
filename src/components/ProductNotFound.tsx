import Link from "next/link";
import { ProductNotFoundProps } from "@/src/lib/types/product";

export default function ProductNotFound({
  className = "",
}: ProductNotFoundProps) {
  return (
    <div
      className={`min-h-screen bg-light-100 flex items-center justify-center ${className}`}
    >
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-light-300 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-dark-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>

          <h1 className="text-heading-2 font-bold text-dark-900 mb-4">
            Product Not Found
          </h1>

          <p className="text-body text-dark-700 mb-8 leading-relaxed">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed. It might have been discontinued or the link you followed is
            outdated.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/products"
            className="inline-block bg-dark-900 text-light-100 px-8 py-3 rounded-lg hover:bg-dark-800 transition-colors duration-200 font-medium"
          >
            Browse All Products
          </Link>

          <div className="text-center">
            <Link
              href="/"
              className="text-dark-700 hover:text-dark-900 transition-colors duration-200 text-body underline"
            >
              Return to Homepage
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-light-300">
          <p className="text-caption text-dark-600">
            Need help?{" "}
            <Link href="/contact" className="text-dark-900 hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
