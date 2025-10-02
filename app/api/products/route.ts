import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    // Try database first, fallback to mock data
    try {
      console.log("[API] Starting database connection...");

      if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL not found");
      }

      const sql = neon(process.env.DATABASE_URL);
      console.log("[API] Database connection successful");

      // Get all published products
      console.log("[API] Querying products...");
      const allProducts = await sql`
        SELECT p.*, c.name as category_name, c.slug as category_slug,
        b.name as brand_name, b.slug as brand_slug,
        g.label as gender_label, g.slug as gender_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN brands b ON p.brand_id = b.id
        JOIN genders g ON p.gender_id = g.id
        WHERE p.is_published = true
        ORDER BY p.created_at DESC
      `;

      console.log(
        `[API] Found ${allProducts.length} published products in database`
      );
      console.log(
        `[API] First product:`,
        allProducts[0]
          ? { id: allProducts[0].id, name: allProducts[0].name }
          : "none"
      );

      if (allProducts.length === 0) {
        console.warn("[API] No published products in database");
        return NextResponse.json("[API] No published products in database");
      }

      // Enrich products with variants and images
      const enrichedProducts = await Promise.all(
        allProducts.map(async (product) => {
          // Get variants with colors and sizes
          const variants = await sql`
            SELECT v.*, c.name as color_name, c.hex_code, c.slug as color_slug,
            s.name as size_name, s.slug as size_slug, s.sort_order as size_sort_order
            FROM product_variants v
            JOIN colors c ON v.color_id = c.id
            JOIN sizes s ON v.size_id = s.id
            WHERE v.product_id = ${product.id}
            ORDER BY s.sort_order
          `;

          // Get images
          const images = await sql`
            SELECT * FROM product_images 
            WHERE product_id = ${product.id}
            ORDER BY sort_order ASC
          `;

          // Find the main image (primary or first image)
          const mainImage = images.find((img) => img.is_primary) || images[0];

          // Ensure we have a fallback image if no images exist
          const fallbackImage = "/shoes/placeholder.svg";

          // Calculate price range from variants
          const prices = variants.map((v) => parseFloat(v.price));
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price:
              minPrice === maxPrice
                ? minPrice.toFixed(2)
                : `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`,
            mainImage: mainImage?.url || fallbackImage,
            category: {
              id: product.category_id,
              name: product.category_name,
              slug: product.category_slug,
            },
            brand: {
              id: product.brand_id,
              name: product.brand_name,
              slug: product.brand_slug,
            },
            gender: {
              id: product.gender_id,
              label: product.gender_label,
              slug: product.gender_slug,
            },
            variants: variants.map((variant) => ({
              id: variant.id,
              sku: variant.sku,
              price: variant.price,
              salePrice: variant.sale_price,
              inStock: variant.in_stock,
              color: {
                id: variant.color_id,
                name: variant.color_name,
                hexCode: variant.hex_code,
                slug: variant.color_slug,
              },
              size: {
                id: variant.size_id,
                name: variant.size_name,
                slug: variant.size_slug,
              },
            })),
            images: images.map((img) => ({
              id: img.id,
              url: img.url,
              sortOrder: img.sort_order,
              isPrimary: img.is_primary,
            })),
            isPublished: product.is_published,
            createdAt: product.created_at,
            updatedAt: product.updated_at,
          };
        })
      );

      return NextResponse.json(enrichedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
