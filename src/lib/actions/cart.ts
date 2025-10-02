"use server";

import { neon } from "@neondatabase/serverless";
import { auth } from "../auth/config";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const sql = neon(process.env.DATABASE_URL!);

export interface CartItemWithDetails {
  id: string;
  productVariantId: string;
  productId: string;
  productName: string;
  productImage: string;
  variantSku: string;
  colorName: string;
  colorValue: string;
  sizeName: string;
  price: string;
  salePrice?: string | null;
  quantity: number;
  inStock: number;
}

export async function getCart(): Promise<{
  success: boolean;
  items?: CartItemWithDetails[];
  error?: string;
}> {
  try {
    const headersList = await headers();
    let session = await auth.api.getSession({
      headers: headersList,
    });

    // If Better Auth session fails, try manual token lookup (same as addCartItem)
    if (!session?.user) {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const betterAuthCookie = cookieStore.get("better-auth.session_token");

        if (betterAuthCookie?.value) {
          const rawToken = betterAuthCookie.value;
          const sessionToken = decodeURIComponent(rawToken);
          const tokenPart = sessionToken.split(".")[0];

          const dbSession = await sql`
            SELECT s.id, s."userId", u.id as user_id, u.email, u.name
            FROM auth_session s
            JOIN auth_user u ON s."userId" = u.id
            WHERE s.token = ${tokenPart} AND s."expiresAt" > NOW()
            LIMIT 1
          `;

          if (dbSession.length > 0) {
            session = {
              user: {
                id: dbSession[0].userId,
                email: dbSession[0].email,
                name: dbSession[0].name,
              },
            };
          }
        }
      } catch (error) {
        console.log("getCart - Manual auth failed:", error);
      }
    }

    let cartId: string | null = null;

    if (session?.user) {
      // Get or create user cart
      const userCarts = await sql`
        SELECT id FROM carts WHERE user_id = ${session.user.id} LIMIT 1
      `;

      if (userCarts.length === 0) {
        // Create cart for user
        const newCart = await sql`
          INSERT INTO carts (user_id) 
          VALUES (${session.user.id}) 
          RETURNING id
        `;
        cartId = newCart[0].id;
      } else {
        cartId = userCarts[0].id;
      }
    } else {
      // For now, return empty cart for non-authenticated users
      // TODO: Implement proper guest cart functionality

      return { success: true, items: [] };
    }

    if (!cartId) {
      return { success: true, items: [] };
    }

    // Get cart items with product details using SQL joins
    const items = await sql`
      SELECT 
        ci.id,
        ci.product_variant_id as "productVariantId",
        ci.quantity,
        pv.product_id as "productId",
        p.name as "productName",
        pv.sku as "variantSku",
        pv.price,
        pv.sale_price as "salePrice",
        pv.in_stock as "inStock",
        c.name as "colorName",
        c.hex_code as "colorValue",
        s.name as "sizeName"
      FROM cart_items ci
      INNER JOIN product_variants pv ON ci.product_variant_id = pv.id
      INNER JOIN products p ON pv.product_id = p.id
      INNER JOIN colors c ON pv.color_id = c.id
      INNER JOIN sizes s ON pv.size_id = s.id
      WHERE ci.cart_id = ${cartId}
      ORDER BY ci.created_at DESC
    `;

    // Get product images for each item
    const itemsWithImages: CartItemWithDetails[] = await Promise.all(
      items.map(async (item: Record<string, unknown>) => {
        const images = await sql`
          SELECT url 
          FROM product_images 
          WHERE product_id = ${item.productId}
          ORDER BY sort_order 
          LIMIT 1
        `;

        return {
          id: item.id as string,
          productVariantId: item.productVariantId as string,
          productId: item.productId as string,
          productName: item.productName as string,
          productImage: images[0]?.url || "/placeholder-product.jpg",
          variantSku: item.variantSku as string,
          colorName: item.colorName as string,
          colorValue: item.colorValue as string,
          sizeName: item.sizeName as string,
          price: item.price as string,
          salePrice: item.salePrice as string | null,
          quantity: item.quantity as number,
          inStock: item.inStock as number,
        };
      })
    );

    return { success: true, items: itemsWithImages };
  } catch (error) {
    console.error("Error getting cart:", error);
    return { success: false, error: "Failed to get cart items" };
  }
}

export async function addCartItem(
  productVariantId: string,
  quantity: number = 1
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const headersList = await headers();
    console.log(
      "addCartItem - Headers:",
      Object.fromEntries(headersList.entries())
    );

    // Try different approaches to get the session
    let session = null;

    try {
      // Method 1: Direct session call
      session = await auth.api.getSession({
        headers: headersList,
      });
      console.log("addCartItem - Method 1 session:", !!session?.user);
    } catch (error) {
      console.log("addCartItem - Method 1 failed:", error);
    }

    if (!session?.user) {
      try {
        // Method 2: Using cookies directly
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();

        // Get the Better Auth session token
        const betterAuthCookie = cookieStore.get("better-auth.session_token");
        console.log(
          "addCartItem - Better Auth cookie:",
          !!betterAuthCookie?.value
        );

        if (betterAuthCookie?.value) {
          // Create new headers with the cookie
          const newHeaders = new Headers();
          newHeaders.set(
            "cookie",
            `better-auth.session_token=${betterAuthCookie.value}`
          );

          // Try to get session with explicit cookie
          session = await auth.api.getSession({
            headers: newHeaders,
          });
          console.log(
            "addCartItem - Method 2 session result:",
            !!session?.user
          );

          if (!session?.user) {
            // Method 3: Try with all cookies
            const allCookieString = cookieStore
              .getAll()
              .map((cookie) => `${cookie.name}=${cookie.value}`)
              .join("; ");

            const fullHeaders = new Headers();
            fullHeaders.set("cookie", allCookieString);

            session = await auth.api.getSession({
              headers: fullHeaders,
            });
            console.log(
              "addCartItem - Method 3 session result:",
              !!session?.user
            );

            if (!session?.user && betterAuthCookie?.value) {
              // Method 4: Direct database lookup using session token
              try {
                const rawToken = betterAuthCookie.value;
                const sessionToken = decodeURIComponent(rawToken);
                console.log(
                  "addCartItem - Raw token:",
                  rawToken.substring(0, 20) + "..."
                );
                console.log(
                  "addCartItem - Decoded token:",
                  sessionToken.substring(0, 20) + "..."
                );
                console.log("addCartItem - Raw token length:", rawToken.length);
                console.log(
                  "addCartItem - Decoded token length:",
                  sessionToken.length
                );

                // First, let's see what sessions exist in the database
                const allSessions = await sql`
                  SELECT s.id, s."userId", s.token, s."expiresAt", u.email
                  FROM auth_session s
                  JOIN auth_user u ON s."userId" = u.id
                  WHERE s."expiresAt" > NOW()
                  ORDER BY s."createdAt" DESC
                  LIMIT 5
                `;
                console.log(
                  "addCartItem - Active sessions in DB:",
                  allSessions.map((s) => ({
                    userId: s.userId,
                    email: s.email,
                    tokenStart: s.token.substring(0, 20) + "...",
                    expires: s.expiresAt,
                  }))
                );

                // Better Auth stores only part of the token in DB, so we need to match the first part
                const tokenPart = sessionToken.split(".")[0]; // Get the part before the first dot
                console.log(
                  "addCartItem - Token part for DB lookup:",
                  tokenPart
                );

                const dbSession = await sql`
                  SELECT s.id, s."userId", u.id as user_id, u.email, u.name
                  FROM auth_session s
                  JOIN auth_user u ON s."userId" = u.id
                  WHERE s.token = ${tokenPart} AND s."expiresAt" > NOW()
                  LIMIT 1
                `;

                console.log(
                  "addCartItem - Exact match result:",
                  dbSession.length
                );

                if (dbSession.length === 0) {
                  // Debug: Compare tokens character by character
                  const dbToken = allSessions[0]?.token;
                  if (dbToken) {
                    console.log("addCartItem - Token comparison:");
                    console.log("  Cookie token:", sessionToken);
                    console.log("  DB token:    ", dbToken);
                    console.log("  Tokens equal:", sessionToken === dbToken);
                    console.log("  Cookie length:", sessionToken.length);
                    console.log("  DB length:    ", dbToken.length);

                    // Find first difference
                    for (
                      let i = 0;
                      i < Math.max(sessionToken.length, dbToken.length);
                      i++
                    ) {
                      if (sessionToken[i] !== dbToken[i]) {
                        console.log(`  First difference at position ${i}:`);
                        console.log(
                          `    Cookie: '${
                            sessionToken[i]
                          }' (${sessionToken.charCodeAt(i)})`
                        );
                        console.log(
                          `    DB:     '${dbToken[i]}' (${dbToken.charCodeAt(
                            i
                          )})`
                        );
                        break;
                      }
                    }
                  }
                }

                if (dbSession.length > 0) {
                  console.log(
                    "addCartItem - Found user in DB:",
                    dbSession[0].email
                  );
                  // Create a mock session object
                  session = {
                    user: {
                      id: dbSession[0].userId,
                      email: dbSession[0].email,
                      name: dbSession[0].name,
                    },
                  };
                  console.log(
                    "addCartItem - Method 4 (DB) session result:",
                    !!session?.user
                  );
                } else {
                  console.log(
                    "addCartItem - No exact match found, checking for any issues..."
                  );
                }
              } catch (dbError) {
                console.log("addCartItem - DB lookup failed:", dbError);
              }
            }
          }
        }
      } catch (error) {
        console.log("addCartItem - Cookie check failed:", error);
      }
    }

    console.log("addCartItem - Final session:", {
      sessionExists: !!session,
      userExists: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
    });

    let cartId: string | null = null;

    if (session?.user) {
      // Get or create user cart
      const userCarts = await sql`
        SELECT id FROM carts WHERE user_id = ${session.user.id} LIMIT 1
      `;

      if (userCarts.length === 0) {
        const newCart = await sql`
          INSERT INTO carts (user_id) 
          VALUES (${session.user.id}) 
          RETURNING id
        `;
        cartId = newCart[0].id;
      } else {
        cartId = userCarts[0].id;
      }
    } else {
      // For now, require authentication to add items to cart
      // TODO: Implement proper guest cart functionality

      return { success: false, error: "Please sign in to add items to cart" };
    }

    if (!cartId) {
      return { success: false, error: "Failed to get cart" };
    }

    // Verify that the product variant exists
    const variantExists = await sql`
      SELECT id, sku FROM product_variants WHERE id = ${productVariantId} LIMIT 1
    `;

    if (variantExists.length === 0) {
      return { success: false, error: "Product variant not found" };
    }

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT id, quantity 
      FROM cart_items 
      WHERE cart_id = ${cartId} AND product_variant_id = ${productVariantId}
      LIMIT 1
    `;

    if (existingItem.length > 0) {
      // Update quantity
      await sql`
        UPDATE cart_items 
        SET quantity = ${
          existingItem[0].quantity + quantity
        }, updated_at = NOW()
        WHERE id = ${existingItem[0].id}
      `;
    } else {
      // Add new item
      await sql`
        INSERT INTO cart_items (cart_id, product_variant_id, quantity) 
        VALUES (${cartId}, ${productVariantId}, ${quantity})
      `;
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error adding cart item:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      productVariantId,
      quantity,
    });
    return {
      success: false,
      error: `Failed to add item to cart: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function updateCartItem(
  itemId: string,
  quantity: number
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (quantity <= 0) {
      return await removeCartItem(itemId);
    }

    await sql`
      UPDATE cart_items 
      SET quantity = ${quantity}, updated_at = NOW()
      WHERE id = ${itemId}
    `;

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { success: false, error: "Failed to update cart item" };
  }
}

export async function removeCartItem(itemId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await sql`DELETE FROM cart_items WHERE id = ${itemId}`;

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { success: false, error: "Failed to remove cart item" };
  }
}

export async function clearCart(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const headersList = await headers();
    let session = await auth.api.getSession({
      headers: headersList,
    });

    // If Better Auth session fails, try manual token lookup
    if (!session?.user) {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const betterAuthCookie = cookieStore.get("better-auth.session_token");

        if (betterAuthCookie?.value) {
          const rawToken = betterAuthCookie.value;
          const sessionToken = decodeURIComponent(rawToken);
          const tokenPart = sessionToken.split(".")[0];

          const dbSession = await sql`
            SELECT s.id, s."userId", u.id as user_id, u.email, u.name
            FROM auth_session s
            JOIN auth_user u ON s."userId" = u.id
            WHERE s.token = ${tokenPart} AND s."expiresAt" > NOW()
            LIMIT 1
          `;

          if (dbSession.length > 0) {
            session = {
              user: {
                id: dbSession[0].userId,
                email: dbSession[0].email,
                name: dbSession[0].name,
              },
            };
          }
        }
      } catch (error) {
        console.log("clearCart - Manual auth failed:", error);
      }
    }

    let cartId: string | null = null;

    if (session?.user) {
      const userCarts = await sql`
        SELECT id FROM carts WHERE user_id = ${session.user.id} LIMIT 1
      `;

      if (userCarts.length > 0) {
        cartId = userCarts[0].id;
      }
    } else {
      // For now, no cart clearing for non-authenticated users
    }

    if (cartId) {
      await sql`DELETE FROM cart_items WHERE cart_id = ${cartId}`;
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}
