import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-light-200 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-heading-2 font-bold text-dark-900 mb-4">
          Product Not Found
        </h1>
        <p className="text-body text-dark-700 mb-6">
          The product you{`&apos;`}re looking for doesn{`&apos;`}t exist or has
          been removed.
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-dark-900 text-light-100 rounded-lg hover:bg-dark-700 transition-colors font-medium"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  );
}
