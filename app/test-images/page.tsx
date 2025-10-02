import { Suspense } from "react";

async function getProducts() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
      }/api/products`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getAvailableImages() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
      }/api/products/images?action=available`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch available images");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching available images:", error);
    return { availableImages: [], count: 0 };
  }
}

function ProductCard({ product }: { product: any }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/shoes/placeholder.svg";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
        {product.name}
      </h3>
      <p className="text-gray-600 text-xs mb-2">{product.brand?.name}</p>
      <p className="font-bold text-sm">${product.price}</p>

      {product.images && product.images.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            {product.images.length} images
          </p>
          <div className="flex gap-1 mt-1">
            {product.images.slice(0, 3).map((img: any, idx: number) => (
              <div
                key={idx}
                className="w-8 h-8 bg-gray-100 rounded overflow-hidden"
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            ))}
            {product.images.length > 3 && (
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  +{product.images.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ImageGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
      {images.map((image, idx) => (
        <div
          key={idx}
          className="aspect-square bg-gray-100 rounded overflow-hidden"
        >
          <img
            src={`/shoes/${image}`}
            alt={`Shoe ${idx + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.opacity = "0.3";
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default async function TestImagesPage() {
  const [products, availableImagesData] = await Promise.all([
    getProducts(),
    getAvailableImages(),
  ]);

  const productsWithImages = Array.isArray(products)
    ? products.filter(
        (p: any) =>
          p.mainImage &&
          p.mainImage !== "/shoes/placeholder.svg" &&
          !p.mainImage.includes("placeholder")
      )
    : [];
  const productsWithoutImages = Array.isArray(products)
    ? products.filter(
        (p: any) =>
          !p.mainImage ||
          p.mainImage === "/shoes/placeholder.svg" ||
          p.mainImage.includes("placeholder")
      )
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Images Test</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Products</h3>
          <p className="text-2xl font-bold text-blue-600">
            {Array.isArray(products) ? products.length : 0}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">With Images</h3>
          <p className="text-2xl font-bold text-green-600">
            {productsWithImages.length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800">Without Images</h3>
          <p className="text-2xl font-bold text-red-600">
            {productsWithoutImages.length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Available Images</h3>
          <p className="text-2xl font-bold text-purple-600">
            {availableImagesData.count || 0}
          </p>
        </div>
      </div>

      {/* Available Images Gallery */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Available Images in /public/shoes
        </h2>
        {availableImagesData.availableImages &&
        availableImagesData.availableImages.length > 0 ? (
          <ImageGallery images={availableImagesData.availableImages} />
        ) : (
          <p className="text-gray-500">
            No images found in /public/shoes directory
          </p>
        )}
      </section>

      {/* Products with Images */}
      {productsWithImages.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Products with Images ({productsWithImages.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {productsWithImages.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Products without Images */}
      {productsWithoutImages.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">
            Products without Images ({productsWithoutImages.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {productsWithoutImages.map((product: unknown) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {productsWithoutImages.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 mb-2">
                <strong>Fix this:</strong> Run the image seeding script to add
                images to products without them.
              </p>
              <code className="bg-yellow-100 px-2 py-1 rounded text-sm">
                npx ts-node scripts/seed-product-images.ts
              </code>
              <p className="text-sm text-yellow-700 mt-2">
                Or visit:{" "}
                <a
                  href="/api/products/images?action=ensure-all"
                  className="underline"
                  target="_blank"
                >
                  /api/products/images?action=ensure-all
                </a>
              </p>
            </div>
          )}
        </section>
      )}

      {/* API Test Links */}
      <section className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">API Test Links:</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <a
              href="/api/products"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              /api/products - Get all products with images
            </a>
          </li>
          <li>
            <a
              href="/api/products/images?action=available"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              /api/products/images?action=available - Get available images
            </a>
          </li>
          <li>
            <a
              href="/api/products/images?action=ensure-all"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              /api/products/images?action=ensure-all - Ensure all products have
              images
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
