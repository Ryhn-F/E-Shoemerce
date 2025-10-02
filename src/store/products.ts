import { create } from "zustand";

// Define the product type to match our API response
type Product = {
  id: string;
  name: string;
  description: string | null;
  category?: { name: string; slug: string };
  brand?: { name: string; slug: string };
  variants?: Array<{
    id: string;
    price: string;
    salePrice?: string | null;
    inStock: number;
    images?: Array<{ url: string; isPrimary: boolean }>;
  }>;
};

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
