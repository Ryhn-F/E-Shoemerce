import Link from "next/link";
import { getEnrichedProducts } from "@/src/lib/mock-data";
import Card from "@/src/components/Card";

export default function TestProductsPage() {
  const products = getEnrichedProducts();

  return (
    <div className="min-h-screen bg-light-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-heading-2 font-bold text-dark-900 mb-8">
          Test Products ({products.length})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const defaultVariant = product.variants[0];
            const primaryImage = defaultVariant?.images?.[0];
            const price = defaultVariant?.salePrice || defaultVariant?.price;

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="block"
              >
                <Card
                  title={product.name}
                  category={`${product.gender?.label} ${product.category?.name}`}
                  price={`$${price}`}
                  image={primaryImage?.url || "/shoes/shoe-1.jpg"}
                  imageAlt={product.name}
                  colors={[]}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
