// Shared type definitions for Product Details Page

export interface ProductVariantWithDetails {
  id: string;
  sku: string;
  price: string;
  salePrice: string | null;
  inStock: number;
  weight?: number | null;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  } | null;
  color: {
    id: string;
    name: string;
    hexCode: string;
    slug: string;
  };
  size: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    sortOrder: number;
    isPrimary: boolean;
  }>;
}

export interface ProductWithDetails {
  id: string;
  name: string;
  description: string | null;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
  gender: { id: string; label: string; slug: string };
  variants: ProductVariantWithDetails[];
  defaultVariantId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  price: string;
  salePrice: string | null;
  mainImage: string | null;
  category: { name: string };
  brand: { name: string };
}

// Helper types for component props
export interface ProductGalleryVariant {
  id: string;
  color?: { name: string; hexCode: string; slug: string };
  images?: Array<{ url: string; isPrimary: boolean; sortOrder: number }>;
}

export interface ProductSize {
  id: string;
  name: string;
  slug: string;
}

export interface ProductColor {
  id: string;
  name: string;
  hexCode: string;
  slug: string;
}

// Props interfaces for components
export interface ProductInfoProps {
  product: ProductWithDetails;
}

export interface ProductReviewsProps {
  productId: string;
}

export interface AlsoLikeSectionProps {
  productId: string;
}

export interface ProductNotFoundProps {
  className?: string;
}

// Utility types
export type ProductWithDetailsOrNull = ProductWithDetails | null;
export type ReviewsArray = ProductReview[];
export type RecommendationsArray = RecommendedProduct[];
