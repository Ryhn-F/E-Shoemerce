import Image from "next/image";
import Link from "next/link";

// Updated interface to match the enriched product data from API
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    category?: { name: string; slug: string };
    brand?: { name: string; slug: string };
    variants?: Array<{
      id: string;
      price: string;
      salePrice?: string | null;
      inStock: number;
      images?: Array<{ url: string; isPrimary: boolean }>;
    }>;
    mainImage?: string;
    price?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // Get the primary image from the first variant or use mainImage from API
  const primaryImage =
    product.mainImage ||
    product.variants?.[0]?.images?.find((img) => img.isPrimary)?.url ||
    product.variants?.[0]?.images?.[0]?.url ||
    "/shoes/placeholder.svg";

  // Get price from the first variant or use price from API
  const price = product.price || product.variants?.[0]?.price || "0.00";
  const salePrice = product.variants?.[0]?.salePrice;
  const stock = product.variants?.[0]?.inStock || 0;

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-64 bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {salePrice ? (
                <>
                  <span className="text-2xl font-bold text-red-600">
                    ${salePrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${price}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  ${price}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">Stock: {stock}</span>
          </div>
          {product.category && (
            <div className="mt-3">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {product.category.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
