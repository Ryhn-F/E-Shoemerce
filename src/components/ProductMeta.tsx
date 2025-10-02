import { ProductInfoProps } from "@/src/lib/types/product";

export default function ProductMeta({ product }: ProductInfoProps) {
  // Get variant information for specifications
  const hasMultipleVariants = product.variants.length > 1;
  const firstVariant = product.variants[0];

  const specifications = [
    {
      label: "Brand",
      value: product.brand.name,
    },
    {
      label: "Category",
      value: product.category.name,
    },
    {
      label: "Gender",
      value: product.gender.label,
    },
    {
      label: "Available Colors",
      value: `${new Set(product.variants.map((v) => v.color.name)).size} color${
        new Set(product.variants.map((v) => v.color.name)).size !== 1 ? "s" : ""
      }`,
    },
    {
      label: "Available Sizes",
      value: `${new Set(product.variants.map((v) => v.size.name)).size} size${
        new Set(product.variants.map((v) => v.size.name)).size !== 1 ? "s" : ""
      }`,
    },
    {
      label: "Total Variants",
      value: `${product.variants.length} variant${
        product.variants.length !== 1 ? "s" : ""
      }`,
    },
  ];

  // Add weight and dimensions if available
  if (firstVariant.weight) {
    specifications.push({
      label: "Weight",
      value: `${firstVariant.weight} lbs`,
    });
  }

  if (firstVariant.dimensions) {
    const dims = firstVariant.dimensions;
    if (dims.length && dims.width && dims.height) {
      specifications.push({
        label: "Dimensions",
        value: `${dims.length}" × ${dims.width}" × ${dims.height}"`,
      });
    }
  }

  const formatDate = (value: Date | string | number) => {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return ""; // or a fallback
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mt-12 space-y-8">
      {/* Product Details */}
      <section aria-labelledby="details-heading">
        <h2 id="details-heading" className="text-heading-3 font-bold mb-6">
          Product Details
        </h2>

        <div className="bg-light-50 rounded-lg p-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {specifications.map((spec, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between"
              >
                <dt className="text-body-medium font-medium text-dark-900 mb-1 sm:mb-0">
                  {spec.label}:
                </dt>
                <dd className="text-body text-dark-700">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Variant Information */}
      {hasMultipleVariants && (
        <section aria-labelledby="variants-heading">
          <h2 id="variants-heading" className="text-heading-3 font-bold mb-6">
            Available Options
          </h2>

          <div className="space-y-4">
            {/* Colors */}
            <div>
              <h3 className="text-body-medium font-medium text-dark-900 mb-3">
                Colors
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(product.variants.map((v) => v.color.name))
                ).map((colorName) => {
                  const color = product.variants.find(
                    (v) => v.color.name === colorName
                  )?.color;
                  return (
                    <div
                      key={colorName}
                      className="flex items-center gap-2 bg-light-100 rounded-full px-3 py-1"
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-light-400"
                        style={{ backgroundColor: color?.hexCode }}
                        aria-hidden="true"
                      />
                      <span className="text-caption text-dark-800">
                        {colorName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-body-medium font-medium text-dark-900 mb-3">
                Sizes
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(product.variants.map((v) => v.size.name))
                ).map((sizeName) => (
                  <div
                    key={sizeName}
                    className="bg-light-100 rounded px-3 py-1"
                  >
                    <span className="text-caption text-dark-800">
                      {sizeName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Care Instructions */}
      <section aria-labelledby="care-heading">
        <h2 id="care-heading" className="text-heading-3 font-bold mb-6">
          Care Instructions
        </h2>

        <div className="bg-light-50 rounded-lg p-6">
          <ul className="space-y-2 text-body text-dark-800">
            <li>• Machine wash cold with like colors</li>
            <li>• Do not bleach</li>
            <li>• Tumble dry low</li>
            <li>• Do not iron directly on design</li>
            <li>• Do not dry clean</li>
          </ul>
        </div>
      </section>

      {/* Product Information */}
      <section aria-labelledby="info-heading">
        <h2 id="info-heading" className="text-heading-3 font-bold mb-6">
          Product Information
        </h2>

        <div className="bg-light-50 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-body-medium font-medium text-dark-900 mb-2">
              Added to Catalog
            </h3>
            <p className="text-body text-dark-700">
              {formatDate(product.createdAt)}
            </p>
          </div>

          {product.updatedAt.getTime() !== product.createdAt.getTime() && (
            <div>
              <h3 className="text-body-medium font-medium text-dark-900 mb-2">
                Last Updated
              </h3>
              <p className="text-body text-dark-700">
                {formatDate(product.updatedAt)}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-body-medium font-medium text-dark-900 mb-2">
              SKU Range
            </h3>
            <p className="text-body text-dark-700 font-mono">
              {product.variants.map((v) => v.sku).join(", ")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
