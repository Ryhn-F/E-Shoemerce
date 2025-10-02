"use server";

import { neon } from "@neondatabase/serverless";
import {
  ProductWithDetails,
  ProductVariantWithDetails,
  ProductReview,
  RecommendedProduct,
  ProductWithDetailsOrNull,
  ReviewsArray,
  RecommendationsArray,
} from "@/src/lib/types/product";
/**

 * Fetch complete product data with variants, images, and metadata
 */
export async function getProduct(
  productId: string
): Promise<ProductWithDetailsOrNull> {
  try {
    console.log(`[getProduct] Starting for productId: ${productId}`);

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not found");
    }

    const sql = neon(process.env.DATABASE_URL);
    console.log("[getProduct] Database connection ready");

    // First, get the basic product info with related data
    console.log("[getProduct] Querying product...");
    const productResult = await sql`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
      b.name as brand_name, b.slug as brand_slug,
      g.label as gender_label, g.slug as gender_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN brands b ON p.brand_id = b.id
      JOIN genders g ON p.gender_id = g.id
      WHERE p.id = ${productId} AND p.is_published = true
      LIMIT 1
    `;

    console.log(
      `[getProduct] Query result: ${productResult.length} products found`
    );

    if (productResult.length === 0) {
      console.log("[getProduct] No product found, returning null");
      return null;
    }

    const productData = productResult[0];

    // Get variants with colors and sizes
    const variants = await sql`
      SELECT v.*, c.name as color_name, c.hex_code, c.slug as color_slug,
             s.name as size_name, s.slug as size_slug, s.sort_order as size_sort_order
      FROM product_variants v
      JOIN colors c ON v.color_id = c.id
      JOIN sizes s ON v.size_id = s.id
      WHERE v.product_id = ${productId}
      ORDER BY s.sort_order
    `;

    // Get images for each variant
    const variantImages = await sql`
      SELECT * FROM product_images 
      WHERE product_id = ${productId}
      ORDER BY sort_order
    `;

    // Group images by variant
    const imagesByVariant = variantImages.reduce((acc, image) => {
      const variantId = image.variant_id || "general";
      if (!acc[variantId]) {
        acc[variantId] = [];
      }
      acc[variantId].push(image);
      return acc;
    }, {} as Record<string, typeof variantImages>);

    // Transform variants with their images
    const transformedVariants: ProductVariantWithDetails[] = variants.map(
      (variant) => ({
        id: variant.id,
        sku: variant.sku,
        price: variant.price,
        salePrice: variant.sale_price,
        inStock: variant.in_stock,
        weight: variant.weight,
        dimensions: variant.dimensions,
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
        images: (
          imagesByVariant[variant.id] ||
          imagesByVariant["general"] ||
          []
        ).map((image) => ({
          id: image.id,
          url: image.url,
          sortOrder: image.sort_order,
          isPrimary: image.is_primary,
        })),
      })
    );

    const transformedProduct: ProductWithDetails = {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      category: {
        id: productData.category_id,
        name: productData.category_name,
        slug: productData.category_slug,
      },
      brand: {
        id: productData.brand_id,
        name: productData.brand_name,
        slug: productData.brand_slug,
      },
      gender: {
        id: productData.gender_id,
        label: productData.gender_label,
        slug: productData.gender_slug,
      },
      variants: transformedVariants,
      defaultVariantId: productData.default_variant_id,
      createdAt: productData.created_at,
      updatedAt: productData.updated_at,
    };

    return transformedProduct;
  } catch (error) {
    console.error(`[getProduct] Error fetching product ${productId}:`, error);
    console.error("[getProduct] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    return null;
  }
} /**

 * Fetch approved reviews for a product
 */
export async function getProductReviews(
  productId: string
): Promise<ReviewsArray> {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not found");
    }

    const sql = neon(process.env.DATABASE_URL);

    // Fetch reviews with user information
    const productReviews = await sql`
      SELECT r.id, r.rating, r.comment, r.created_at,
             u.name as user_name, u.email as user_email
      FROM reviews r
      JOIN "user" u ON r.user_id = u.id
      WHERE r.product_id = ${productId}
      ORDER BY r.created_at DESC
      LIMIT 10
    `;

    // Transform to expected format
    const transformedReviews: ProductReview[] = productReviews.map(
      (review) => ({
        id: review.id,
        author:
          review.user_name || review.user_email.split("@")[0] || "Anonymous",
        rating: review.rating,
        content: review.comment || "",
        createdAt: new Date(review.created_at).toISOString(),
      })
    );

    return transformedReviews;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    // Return empty array on error to prevent blocking the UI
    return [];
  }
} /**
 *
 Fetch related products for recommendations
 */
export async function getRecommendedProducts(
  productId: string
): Promise<RecommendationsArray> {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not found");
    }

    const sql = neon(process.env.DATABASE_URL);

    // First, get the current product's category
    const currentProduct = await sql`
      SELECT category_id FROM products WHERE id = ${productId} LIMIT 1
    `;

    if (currentProduct.length === 0) {
      return [];
    }

    const { category_id } = currentProduct[0];

    // Find related products with same category
    const relatedProducts = await sql`
      SELECT p.id, p.name, c.name as category_name, b.name as brand_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN brands b ON p.brand_id = b.id
      WHERE p.id != ${productId} 
        AND p.is_published = true 
        AND p.category_id = ${category_id}
      LIMIT 6
    `;

    if (relatedProducts.length === 0) {
      return [];
    }

    // Get first variant for each product for pricing
    const productIds = relatedProducts.map((p) => p.id);

    // Get variants for pricing (get first variant for each product)
    const variants = await sql`
      SELECT DISTINCT ON (product_id) product_id, price, sale_price
      FROM product_variants
      WHERE product_id = ANY(${productIds})
      ORDER BY product_id, created_at
    `;

    // Get primary images for each product
    const images = await sql`
      SELECT product_id, url
      FROM product_images
      WHERE product_id = ANY(${productIds}) AND is_primary = true
    `;

    // Create maps for quick lookup
    const imageMap = images.reduce((acc, img) => {
      acc[img.product_id] = img.url;
      return acc;
    }, {} as Record<string, string>);

    const priceMap = variants.reduce((acc, variant) => {
      if (!acc[variant.product_id]) {
        acc[variant.product_id] = {
          price: variant.price,
          salePrice: variant.sale_price,
        };
      }
      return acc;
    }, {} as Record<string, { price: string; salePrice: string | null }>);

    // Transform to expected format, filtering out products without images
    const transformedRecommendations: RecommendedProduct[] = relatedProducts
      .filter((product) => imageMap[product.id])
      .map((product) => ({
        id: product.id,
        name: product.name,
        price: priceMap[product.id]?.price || "0.00",
        salePrice: priceMap[product.id]?.salePrice || null,
        mainImage: imageMap[product.id] || null,
        category: { name: product.category_name },
        brand: { name: product.brand_name },
      }));

    return transformedRecommendations;
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    // Return empty array on error to prevent blocking the UI
    return [];
  }
}
