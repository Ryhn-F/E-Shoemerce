import { NextRequest, NextResponse } from "next/server";
import {
  getProductImages,
  addRandomImagesToProduct,
  ensureAllProductsHaveImages,
  getAvailableShoeImages,
} from "@/src/lib/actions/product-images";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const action = searchParams.get("action");

  try {
    // Get images for a specific product
    if (productId && !action) {
      const images = await getProductImages(productId);
      return NextResponse.json({
        success: true,
        productId,
        images,
        count: images.length,
      });
    }

    // Get available images from public directory
    if (action === "available") {
      const availableImages = getAvailableShoeImages();
      return NextResponse.json({
        success: true,
        availableImages,
        count: availableImages.length,
      });
    }

    // Ensure all products have images
    if (action === "ensure-all") {
      const result = await ensureAllProductsHaveImages();
      return NextResponse.json({
        success: true,
        message: "Completed ensuring all products have images",
        ...result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid request. Use ?productId=<id> to get product images, ?action=available for available images, or ?action=ensure-all to ensure all products have images",
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process request",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, action, count } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "productId is required",
        },
        { status: 400 }
      );
    }

    // Add random images to a product
    if (action === "add-random") {
      const imageCount = count || 3;
      const addedImages = await addRandomImagesToProduct(productId, imageCount);

      return NextResponse.json({
        success: true,
        message: `Added ${addedImages.length} images to product`,
        productId,
        addedImages,
        count: addedImages.length,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          'Invalid action. Use action: "add-random" with productId and optional count',
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process request",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
