import { db } from "./db";
import {
  brands,
  categories,
  collections,
  genders,
  colors,
  sizes,
  products,
  productVariants,
  productImages,
  productCollections,
  reviews,
  user,
} from "./db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

// Seed data
const seedGenders = [
  { label: "Men", slug: "men" },
  { label: "Women", slug: "women" },
  { label: "Kids", slug: "kids" },
  { label: "Unisex", slug: "unisex" },
];

const seedColors = [
  { name: "Black", slug: "black", hexCode: "#000000" },
  { name: "White", slug: "white", hexCode: "#FFFFFF" },
  { name: "Red", slug: "red", hexCode: "#FF0000" },
  { name: "Blue", slug: "blue", hexCode: "#0000FF" },
  { name: "Green", slug: "green", hexCode: "#008000" },
  { name: "Gray", slug: "gray", hexCode: "#808080" },
  { name: "Navy", slug: "navy", hexCode: "#000080" },
  { name: "Brown", slug: "brown", hexCode: "#A52A2A" },
  { name: "Pink", slug: "pink", hexCode: "#FFC0CB" },
  { name: "Orange", slug: "orange", hexCode: "#FFA500" },
];

const seedSizes = [
  { name: "6", slug: "6", sortOrder: 1 },
  { name: "6.5", slug: "6-5", sortOrder: 2 },
  { name: "7", slug: "7", sortOrder: 3 },
  { name: "7.5", slug: "7-5", sortOrder: 4 },
  { name: "8", slug: "8", sortOrder: 5 },
  { name: "8.5", slug: "8-5", sortOrder: 6 },
  { name: "9", slug: "9", sortOrder: 7 },
  { name: "9.5", slug: "9-5", sortOrder: 8 },
  { name: "10", slug: "10", sortOrder: 9 },
  { name: "10.5", slug: "10-5", sortOrder: 10 },
  { name: "11", slug: "11", sortOrder: 11 },
  { name: "11.5", slug: "11-5", sortOrder: 12 },
  { name: "12", slug: "12", sortOrder: 13 },
];

const seedBrands = [
  { name: "Nike", slug: "nike", logoUrl: "/brands/nike-logo.png" },
];

const seedCategories = [
  { name: "Running", slug: "running", parentId: null },
  { name: "Basketball", slug: "basketball", parentId: null },
  { name: "Lifestyle", slug: "lifestyle", parentId: null },
  { name: "Training", slug: "training", parentId: null },
  { name: "Skateboarding", slug: "skateboarding", parentId: null },
];

const seedCollections = [
  { name: "Air Max Collection", slug: "air-max-collection" },
  { name: "Jordan Collection", slug: "jordan-collection" },
  { name: "Dunk Collection", slug: "dunk-collection" },
  { name: "React Collection", slug: "react-collection" },
];

const seedUsers = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    emailVerified: true,
    image: null,
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    emailVerified: true,
    image: null,
  },
  {
    name: "Mike Chen",
    email: "mike.chen@example.com",
    emailVerified: true,
    image: null,
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.com",
    emailVerified: true,
    image: null,
  },
  {
    name: "Alex Rodriguez",
    email: "alex.rodriguez@example.com",
    emailVerified: true,
    image: null,
  },
];

const nikeProducts = [
  {
    name: "Nike Air Max 270",
    description:
      "The Nike Air Max 270 delivers visible cushioning under every step with the largest heel Air unit yet.",
    categorySlug: "running",
    genderSlug: "unisex",
    colors: ["black", "white", "blue"],
    sizes: ["8", "9", "10", "11", "12"],
    basePrice: "150.00",
    collections: ["air-max-collection"],
  },
  {
    name: "Nike Air Force 1 '07",
    description:
      "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best.",
    categorySlug: "lifestyle",
    genderSlug: "unisex",
    colors: ["white", "black", "red"],
    sizes: ["7", "8", "9", "10", "11"],
    basePrice: "110.00",
    collections: [],
  },
  {
    name: "Nike React Infinity Run Flyknit 3",
    description:
      "A running shoe designed to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.",
    categorySlug: "running",
    genderSlug: "unisex",
    colors: ["black", "white", "gray"],
    sizes: ["8", "9", "10", "11"],
    basePrice: "160.00",
    collections: ["react-collection"],
  },
  {
    name: "Nike Dunk Low",
    description:
      "Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp overlays and original team colors.",
    categorySlug: "lifestyle",
    genderSlug: "unisex",
    colors: ["white", "black", "green", "red"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    basePrice: "100.00",
    collections: ["dunk-collection"],
  },
  {
    name: "Nike Blazer Mid '77 Vintage",
    description:
      "The Nike Blazer Mid '77 Vintage returns with a timeless design that's easy to wear.",
    categorySlug: "lifestyle",
    genderSlug: "unisex",
    colors: ["white", "black", "navy"],
    sizes: ["8", "9", "10", "11"],
    basePrice: "100.00",
    collections: [],
  },
  {
    name: "Nike ZoomX Vaporfly NEXT% 2",
    description:
      "The Nike ZoomX Vaporfly NEXT% 2 is built for racing and designed for speed.",
    categorySlug: "running",
    genderSlug: "unisex",
    colors: ["white", "black", "orange"],
    sizes: ["8", "9", "10", "11"],
    basePrice: "250.00",
    collections: [],
  },
  {
    name: "Nike Air Jordan 1 Low",
    description:
      "Inspired by the original that debuted in 1985, the Air Jordan 1 Low offers a clean, classic look that's familiar yet always fresh.",
    categorySlug: "lifestyle",
    genderSlug: "unisex",
    colors: ["white", "black", "red", "blue"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    basePrice: "90.00",
    collections: ["jordan-collection"],
  },
  {
    name: "Nike Air Max 90",
    description:
      "Nothing as fly, nothing as comfortable, nothing as proven. The Nike Air Max 90 stays true to its OG running roots.",
    categorySlug: "lifestyle",
    genderSlug: "unisex",
    colors: ["white", "black", "gray", "red"],
    sizes: ["8", "9", "10", "11", "12"],
    basePrice: "120.00",
    collections: ["air-max-collection"],
  },
  {
    name: "Nike Pegasus 39",
    description:
      "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals.",
    categorySlug: "running",
    genderSlug: "unisex",
    colors: ["black", "white", "blue", "gray"],
    sizes: ["7", "8", "9", "10", "11"],
    basePrice: "130.00",
    collections: [],
  },
  {
    name: "Nike SB Dunk Low Pro",
    description:
      "The Nike SB Dunk Low Pro has been a skate icon for years. This version maintains the classic look you love.",
    categorySlug: "skateboarding",
    genderSlug: "unisex",
    colors: ["black", "white", "green", "brown"],
    sizes: ["8", "9", "10", "11"],
    basePrice: "95.00",
    collections: ["dunk-collection"],
  },
  {
    name: "Nike Air Max 97",
    description:
      "The Nike Air Max 97 takes inspiration from Japanese bullet trains and water droplets.",
    categorySlug: "lifestyle",
    genderSlug: "unisex",
    colors: ["white", "black", "gray"],
    sizes: ["8", "9", "10", "11", "12"],
    basePrice: "170.00",
    collections: ["air-max-collection"],
  },
  {
    name: "Nike Metcon 8",
    description:
      "The Nike Metcon 8 is built for versatility, whether you're lifting, doing cardio or cross-training.",
    categorySlug: "training",
    genderSlug: "unisex",
    colors: ["black", "white", "red"],
    sizes: ["8", "9", "10", "11"],
    basePrice: "130.00",
    collections: [],
  },
  {
    name: "Nike Air Jordan 4 Retro",
    description:
      "The Air Jordan 4 Retro brings back the iconic basketball shoe with premium materials and classic colorways.",
    categorySlug: "basketball",
    genderSlug: "unisex",
    colors: ["white", "black", "red"],
    sizes: ["8", "9", "10", "11", "12"],
    basePrice: "200.00",
    collections: ["jordan-collection"],
  },
  {
    name: "Nike Revolution 6",
    description:
      "The Nike Revolution 6 continues to evolve this running favorite with a soft, comfortable ride.",
    categorySlug: "running",
    genderSlug: "unisex",
    colors: ["black", "white", "gray", "navy"],
    sizes: ["7", "8", "9", "10", "11"],
    basePrice: "65.00",
    collections: [],
  },
  {
    name: "Nike Court Vision Low",
    description:
      "The Nike Court Vision Low brings a classic basketball look to your everyday wardrobe.",
    categorySlug: "lifestyle",
    genderSlug: "unisex",
    colors: ["white", "black"],
    sizes: ["8", "9", "10", "11"],
    basePrice: "75.00",
    collections: [],
  },
];

// Helper function to get available shoe images
function getAvailableShoeImages(): string[] {
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

// Helper function to generate SKU
function generateSKU(
  productName: string,
  colorName: string,
  sizeName: string
): string {
  const productCode = productName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 6)
    .toUpperCase();
  const colorCode = colorName.substring(0, 2).toUpperCase();
  const sizeCode = sizeName.replace(".", "");
  return `${productCode}-${colorCode}-${sizeCode}`;
}

// Helper function to add delay between operations
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Skip clearing data due to Neon connection issues
    console.log(
      "⚠️ Skipping data clearing due to database connection issues..."
    );

    // Seed base data
    console.log("📊 Seeding base data...");

    // Get existing genders first
    let insertedGenders = [];
    try {
      insertedGenders = await db.select().from(genders);
    } catch (error) {
      console.warn("⚠️ Could not fetch existing genders, will try to insert");
    }

    // Insert genders one by one to avoid Neon bulk insert issues
    for (const gender of seedGenders) {
      const existing = insertedGenders.find((g) => g.slug === gender.slug);
      if (!existing) {
        try {
          const [inserted] = await db
            .insert(genders)
            .values(gender)
            .returning();
          insertedGenders.push(inserted);
          console.log(`✅ Inserted gender: ${gender.label}`);
        } catch (error) {
          console.warn(
            `⚠️ Failed to insert gender ${gender.label}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else {
        console.log(`⚠️ Gender ${gender.label} already exists`);
      }
    }
    console.log(`✅ Processed ${insertedGenders.length} genders`);
    await delay(100); // Small delay to help with connection stability

    // Get existing colors first
    let insertedColors = [];
    try {
      insertedColors = await db.select().from(colors);
    } catch (error) {
      console.warn("⚠️ Could not fetch existing colors, will try to insert");
    }

    // Insert colors one by one
    for (const color of seedColors) {
      const existing = insertedColors.find((c) => c.slug === color.slug);
      if (!existing) {
        try {
          const [inserted] = await db.insert(colors).values(color).returning();
          insertedColors.push(inserted);
          console.log(`✅ Inserted color: ${color.name}`);
        } catch (error) {
          console.warn(
            `⚠️ Failed to insert color ${color.name}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else {
        console.log(`⚠️ Color ${color.name} already exists`);
      }
    }
    console.log(`✅ Processed ${insertedColors.length} colors`);
    await delay(100);

    // Get existing sizes first
    let insertedSizes = [];
    try {
      insertedSizes = await db.select().from(sizes);
    } catch (error) {
      console.warn("⚠️ Could not fetch existing sizes, will try to insert");
    }

    // Insert sizes one by one
    for (const size of seedSizes) {
      const existing = insertedSizes.find((s) => s.slug === size.slug);
      if (!existing) {
        try {
          const [inserted] = await db.insert(sizes).values(size).returning();
          insertedSizes.push(inserted);
          console.log(`✅ Inserted size: ${size.name}`);
        } catch (error) {
          console.warn(
            `⚠️ Failed to insert size ${size.name}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else {
        console.log(`⚠️ Size ${size.name} already exists`);
      }
    }
    console.log(`✅ Processed ${insertedSizes.length} sizes`);
    await delay(100);

    // Get existing brands first
    let insertedBrands = [];
    try {
      insertedBrands = await db.select().from(brands);
    } catch (error) {
      console.warn("⚠️ Could not fetch existing brands, will try to insert");
    }

    // Insert brands one by one
    for (const brand of seedBrands) {
      const existing = insertedBrands.find((b) => b.slug === brand.slug);
      if (!existing) {
        try {
          const [inserted] = await db.insert(brands).values(brand).returning();
          insertedBrands.push(inserted);
          console.log(`✅ Inserted brand: ${brand.name}`);
        } catch (error) {
          console.warn(
            `⚠️ Failed to insert brand ${brand.name}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else {
        console.log(`⚠️ Brand ${brand.name} already exists`);
      }
    }
    console.log(`✅ Processed ${insertedBrands.length} brands`);
    await delay(100);

    // Get existing categories first
    let insertedCategories = [];
    try {
      insertedCategories = await db.select().from(categories);
    } catch (error) {
      console.warn(
        "⚠️ Could not fetch existing categories, will try to insert"
      );
    }

    // Insert categories one by one
    for (const category of seedCategories) {
      const existing = insertedCategories.find((c) => c.slug === category.slug);
      if (!existing) {
        try {
          const [inserted] = await db
            .insert(categories)
            .values(category)
            .returning();
          insertedCategories.push(inserted);
          console.log(`✅ Inserted category: ${category.name}`);
        } catch (error) {
          console.warn(
            `⚠️ Failed to insert category ${category.name}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else {
        console.log(`⚠️ Category ${category.name} already exists`);
      }
    }
    console.log(`✅ Processed ${insertedCategories.length} categories`);
    await delay(100);

    // Get existing collections first
    let insertedCollections = [];
    try {
      insertedCollections = await db.select().from(collections);
    } catch (error) {
      console.warn(
        "⚠️ Could not fetch existing collections, will try to insert"
      );
    }

    // Insert collections one by one
    for (const collection of seedCollections) {
      const existing = insertedCollections.find(
        (c) => c.slug === collection.slug
      );
      if (!existing) {
        try {
          const [inserted] = await db
            .insert(collections)
            .values(collection)
            .returning();
          insertedCollections.push(inserted);
          console.log(`✅ Inserted collection: ${collection.name}`);
        } catch (error) {
          console.warn(
            `⚠️ Failed to insert collection ${collection.name}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else {
        console.log(`⚠️ Collection ${collection.name} already exists`);
      }
    }
    console.log(`✅ Processed ${insertedCollections.length} collections`);

    // Get existing users first
    let insertedUsers = [];
    try {
      insertedUsers = await db.select().from(user);
    } catch (error) {
      console.warn("⚠️ Could not fetch existing users, will try to insert");
    }

    // Insert users one by one
    for (const userData of seedUsers) {
      const existing = insertedUsers.find((u) => u.email === userData.email);
      if (!existing) {
        try {
          const [inserted] = await db.insert(user).values(userData).returning();
          insertedUsers.push(inserted);
          console.log(`✅ Inserted user: ${userData.email}`);
        } catch (error) {
          console.warn(
            `⚠️ Failed to insert user ${userData.email}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else {
        console.log(`⚠️ User ${userData.email} already exists`);
      }
    }
    console.log(`✅ Processed ${insertedUsers.length} users`);
    await delay(100);

    // Create lookup maps
    const genderMap = new Map(insertedGenders.map((g) => [g.slug, g.id]));
    const colorMap = new Map(insertedColors.map((c) => [c.slug, c.id]));
    const sizeMap = new Map(insertedSizes.map((s) => [s.name, s.id]));
    const brandMap = new Map(insertedBrands.map((b) => [b.slug, b.id]));
    const categoryMap = new Map(insertedCategories.map((c) => [c.slug, c.id]));
    const collectionMap = new Map(
      insertedCollections.map((c) => [c.slug, c.id])
    );

    // Get available images
    const availableImages = getAvailableShoeImages();
    console.log(`📸 Found ${availableImages.length} available images`);

    // Seed products and variants
    console.log("👟 Seeding products and variants...");

    for (let i = 0; i < nikeProducts.length; i++) {
      const productData = nikeProducts[i];

      console.log(`📦 Creating product: ${productData.name}`);

      // Insert product
      const [insertedProduct] = await db
        .insert(products)
        .values({
          name: productData.name,
          description: productData.description,
          categoryId: categoryMap.get(productData.categorySlug)!,
          genderId: genderMap.get(productData.genderSlug)!,
          brandId: brandMap.get("nike")!,
          isPublished: true,
        })
        .returning();

      // Create variants for each color and size combination
      const variants = [];
      for (const colorSlug of productData.colors) {
        for (const sizeName of productData.sizes) {
          const colorId = colorMap.get(colorSlug);
          const sizeId = sizeMap.get(sizeName);

          if (colorId && sizeId) {
            const sku = generateSKU(productData.name, colorSlug, sizeName);
            const priceVariation = Math.random() * 20 - 10; // ±$10 variation
            const finalPrice = (
              parseFloat(productData.basePrice) + priceVariation
            ).toFixed(2);

            variants.push({
              productId: insertedProduct.id,
              sku,
              price: finalPrice,
              salePrice:
                Math.random() > 0.7
                  ? (parseFloat(finalPrice) * 0.85).toFixed(2)
                  : null,
              colorId,
              sizeId,
              inStock: Math.floor(Math.random() * 50) + 5, // 5-54 stock
              weight: 1.2 + Math.random() * 0.8, // 1.2-2.0 lbs
              dimensions: {
                length: 12 + Math.random() * 2,
                width: 4 + Math.random() * 1,
                height: 5 + Math.random() * 1,
              },
            });
          }
        }
      }

      // Insert variants one by one to avoid bulk insert issues
      const insertedVariants: (typeof productVariants.$inferSelect)[] = [];
      for (const variant of variants) {
        try {
          const [inserted] = await db
            .insert(productVariants)
            .values(variant)
            .returning();
          insertedVariants.push(inserted);
        } catch (error: unknown) {
          console.warn(
            `  ⚠️ Failed to insert variant ${variant.sku}:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      }
      console.log(`  ✅ Created ${insertedVariants.length} variants`);

      // Set default variant (first one)
      if (insertedVariants.length > 0) {
        await db
          .update(products)
          .set({ defaultVariantId: insertedVariants[0].id })
          .where(eq(products.id, insertedProduct.id));
      }

      // Add product images
      const productImageCount = Math.min(3, availableImages.length);
      const selectedImages = availableImages
        .sort(() => 0.5 - Math.random())
        .slice(0, productImageCount);

      const imageInserts = selectedImages.map((imageName, index) => ({
        productId: insertedProduct.id,
        variantId: index === 0 ? insertedVariants[0]?.id : null, // First image for first variant
        url: `/shoes/${imageName}`,
        sortOrder: index,
        isPrimary: index === 0,
      }));

      // Insert images one by one
      let imageCount = 0;
      for (const imageInsert of imageInserts) {
        try {
          await db.insert(productImages).values(imageInsert);
          imageCount++;
        } catch (error: unknown) {
          console.warn(
            `  ⚠️ Failed to insert image:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      }
      if (imageCount > 0) {
        console.log(`  📸 Added ${imageCount} images`);
      }

      // Add to collections
      if (productData.collections.length > 0) {
        const collectionInserts = productData.collections
          .map((collectionSlug) => collectionMap.get(collectionSlug))
          .filter(Boolean)
          .map((collectionId) => ({
            productId: insertedProduct.id,
            collectionId: collectionId!,
          }));

        // Insert collection relationships one by one
        let collectionCount = 0;
        for (const collectionInsert of collectionInserts) {
          try {
            await db.insert(productCollections).values(collectionInsert);
            collectionCount++;
          } catch (error: unknown) {
            console.warn(
              `  ⚠️ Failed to insert collection relationship:`,
              error instanceof Error ? error.message : "Unknown error"
            );
          }
        }
        if (collectionCount > 0) {
          console.log(`  🏷️ Added to ${collectionCount} collections`);
        }
      }
    }

    // Seed reviews for products
    console.log("⭐ Seeding product reviews...");

    // Get all inserted products
    const allProducts = await db.select().from(products);

    const sampleReviews = [
      {
        rating: 5,
        comment:
          "Amazing shoes! Super comfortable and great quality. Highly recommend!",
      },
      {
        rating: 4,
        comment:
          "Really good shoes, fit perfectly and look great. Just wish they had more color options.",
      },
      {
        rating: 5,
        comment:
          "Best purchase I've made in a while. These shoes are incredibly comfortable for long walks.",
      },
      {
        rating: 4,
        comment:
          "Great quality and fast shipping. The shoes look exactly like the pictures.",
      },
      {
        rating: 3,
        comment:
          "Good shoes overall, but they run a bit small. Consider ordering half a size up.",
      },
      {
        rating: 5,
        comment:
          "Perfect for running! Great cushioning and support. Will definitely buy again.",
      },
      {
        rating: 4,
        comment:
          "Stylish and comfortable. Great for both casual wear and light exercise.",
      },
      {
        rating: 5,
        comment:
          "Exceeded my expectations! The build quality is excellent and they're very comfortable.",
      },
      {
        rating: 4,
        comment:
          "Nice shoes, good value for money. The design is clean and modern.",
      },
      {
        rating: 3,
        comment:
          "Decent shoes but took a while to break in. Comfortable now though.",
      },
    ];

    let totalReviews = 0;
    for (const product of allProducts) {
      // Add 2-5 random reviews per product
      const reviewCount = Math.floor(Math.random() * 4) + 2;
      const selectedReviews = sampleReviews
        .sort(() => 0.5 - Math.random())
        .slice(0, reviewCount);

      for (const reviewData of selectedReviews) {
        // Pick a random user
        const randomUser =
          insertedUsers[Math.floor(Math.random() * insertedUsers.length)];

        if (randomUser) {
          try {
            await db.insert(reviews).values({
              productId: product.id,
              userId: randomUser.id,
              rating: reviewData.rating,
              comment: reviewData.comment,
            });
            totalReviews++;
          } catch (error: unknown) {
            console.warn(
              `  ⚠️ Failed to insert review:`,
              error instanceof Error ? error.message : "Unknown error"
            );
          }
        }
      }
    }

    console.log(`✅ Added ${totalReviews} product reviews`);

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Legacy function for backward compatibility
export async function seedProducts() {
  return seedDatabase();
}
