import { cache } from "react";
import ProductDetail from "./ProductDetail";

interface ProductDetailType {
  id: string;
  name: string;
  description: string;
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; slug: string };
  gender?: { id: string; label: string; slug: string };
  variants: Array<{
    id: string;
    sku: string;
    price: string;
    salePrice?: string | null;
    color?: { id: string; name: string; hexCode: string; slug: string };
    size?: { id: string; name: string; slug: string };
    inStock: number;
    images?: Array<{ url: string; isPrimary: boolean; sortOrder: number }>;
  }>;
  defaultVariantId: string;
  createdAt: Date;
}

interface CachedProductDetailProps {
  product: ProductDetailType;
}

// This component is cached and will not re-render on refresh
const CachedProductDetail = cache(({ product }: CachedProductDetailProps) => {
  return <ProductDetail product={product} />;
});

export default CachedProductDetail;
