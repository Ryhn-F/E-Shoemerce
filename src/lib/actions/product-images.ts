"use server";

import { db } from "../db";
import { productImages, products } from "../db/schema";
import { eq, and } from "drizzle-orm";
import fs from "fs";
import path from "path";

export interface ProductImageData {
  id: string;
  productId: string;
  variantId?: string | null;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
}

/**
 * Get all images for a specific product
 */
export async function getProductImages(
  productId: string
): Promise<ProductImageData[]> {
  try {
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(productImages.sortOrder);

    return images.map((img) => ({
      id: img.id,
      productId: img.productId,
      variantId: img.variantId,
      url: img.url,
      sortOrder: img.sortOrder,
      isPrimary: img.isPrimary,
      createdAt: img.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching product images:", error);
    return [];
  }
}

/**
 * Get primary image for a product
 */
export async function getProductPrimaryImage(
  productId: string
): Promise<string | null> {
  try {
    const images = await db
      .select()
      .from(productImages)
      .where(
        and(
          eq(productImages.productId, productId),
          eq(productImages.isPrimary, true)
        )
      )
      .limit(1);

    if (images.length > 0) {
      return images[0].url;
    }

    // If no primary image, get the first image
    const firstImage = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(productImages.sortOrder)
      .limit(1);

    return firstImage.length > 0 ? firstImage[0].url : null;
  } catch (error) {
    console.error("Error fetching primary image:", error);
    return null;
  }
}

/**
 * Add a new image to a product
 */
export async function addProductImage(
  productId: string,
  imageUrl: string,
  options: {
    variantId?: string;
    sortOrder?: number;
    isPrimary?: boolean;
  } = {}
): Promise<ProductImageData | null> {
  try {
    // Verify product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length === 0) {
      throw new Error("Product not found");
    }

    // If no sort order provided, get the next available order
    let sortOrder = options.sortOrder ?? 0;
    if (sortOrder === 0) {
      const existingImages = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, productId));

      sortOrder = existingImages.length;
    }

    // If this is set as primary, unset other primary images
    if (options.isPrimary) {
      await db
        .update(productImages)
        .set({ isPrimary: false })
        .where(eq(productImages.productId, productId));
    }

    const [newImage] = await db
      .insert(productImages)
      .values({
        productId,
        variantId: options.variantId || null,
        url: imageUrl,
        sortOrder,
        isPrimary: options.isPrimary || false,
      })
      .returning();

    return {
      id: newImage.id,
      productId: newImage.productId,
      variantId: newImage.variantId,
      url: newImage.url,
      sortOrder: newImage.sortOrder,
      isPrimary: newImage.isPrimary,
      createdAt: newImage.createdAt,
    };
  } catch (error) {
    console.error("Error adding product image:", error);
    return null;
  }
}

/**
 * Update image order and primary status
 */
export async function updateProductImage(
  imageId: string,
  updates: {
    sortOrder?: number;
    isPrimary?: boolean;
  }
): Promise<boolean> {
  try {
    // Get the image to find its product
    const [existingImage] = await db
      .select()
      .from(productImages)
      .where(eq(productImages.id, imageId))
      .limit(1);

    if (!existingImage) {
      throw new Error("Image not found");
    }

    // If setting as primary, unset other primary images for this product
    if (updates.isPrimary) {
      await db
        .update(productImages)
        .set({ isPrimary: false })
        .where(eq(productImages.productId, existingImage.productId));
    }

    await db
      .update(productImages)
      .set(updates)
      .where(eq(productImages.id, imageId));

    return true;
  } catch (error) {
    console.error("Error updating product image:", error);
    return false;
  }
}

/**
 * Delete a product image
 */
export async function deleteProductImage(imageId: string): Promise<boolean> {
  try {
    await db.delete(productImages).where(eq(productImages.id, imageId));

    return true;
  } catch (error) {
    console.error("Error deleting product image:", error);
    return false;
  }
}

/**
 * Get available images from public/shoes directory
 */
export async function getAvailableShoeImages(): string[] {
  const shoesDir = path.join(process.cwd(), "public", "shoes");
  try {
    const files = fs.readdirSync(shoesDir);
    return files.filter(
      (file) =>
        file.endsWith(".jpg") ||
        file.endsWith(".jpeg") ||
        file.endsWith(".png") ||
        file.endsWith(".webp") ||
        file.endsWith(".avif")
    );
  } catch (error) {
    console.warn("Could not read shoes directory:", error);
    return [];
  }
}

/**
 * Bulk add random images to a product from available images
 */
export async function addRandomImagesToProduct(
  productId: string,
  count: number = 3
): Promise<ProductImageData[]> {
  try {
    const availableImages = getAvailableShoeImages();
    if (availableImages.length === 0) {
      throw new Error("No images available in public/shoes directory");
    }

    // Get existing images to avoid duplicates
    const existingImages = await getProductImages(productId);
    const existingUrls = existingImages.map((img) => img.url);

    // Filter out already used images
    const unusedImages = availableImages.filter(
      (img) => !existingUrls.includes(`/shoes/${img}`)
    );

    if (unusedImages.length === 0) {
      throw new Error("No unused images available for this product");
    }

    // Select random images
    const selectedImages = unusedImages
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(count, unusedImages.length));

    const addedImages: ProductImageData[] = [];

    for (let i = 0; i < selectedImages.length; i++) {
      const imageUrl = `/shoes/${selectedImages[i]}`;
      const isPrimary = existingImages.length === 0 && i === 0; // First image is primary if no existing images

      const newImage = await addProductImage(productId, imageUrl, {
        sortOrder: existingImages.length + i,
        isPrimary,
      });

      if (newImage) {
        addedImages.push(newImage);
      }
    }

    return addedImages;
  } catch (error) {
    console.error("Error adding random images to product:", error);
    return [];
  }
}

/**
 * Ensure all products have at least one image
 */
export async function ensureAllProductsHaveImages(): Promise<{
  processed: number;
  imagesAdded: number;
  errors: string[];
}> {
  try {
    const allProducts = await db.select().from(products);
    const errors: string[] = [];
    let imagesAdded = 0;

    for (const product of allProducts) {
      try {
        const existingImages = await getProductImages(product.id);

        if (existingImages.length === 0) {
          const addedImages = await addRandomImagesToProduct(product.id, 2);
          imagesAdded += addedImages.length;

          if (addedImages.length > 0) {
            console.log(
              `✅ Added ${addedImages.length} images to "${product.name}"`
            );
          }
        }
      } catch (error) {
        const errorMsg = `Failed to add images to "${product.name}": ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    return {
      processed: allProducts.length,
      imagesAdded,
      errors,
    };
  } catch (error) {
    console.error("Error ensuring products have images:", error);
    return {
      processed: 0,
      imagesAdded: 0,
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}
