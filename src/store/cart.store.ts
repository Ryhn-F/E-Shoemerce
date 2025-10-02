"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
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
  salePrice?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

interface CartActions {
  addItem: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemByVariant: (productVariantId: string) => CartItem | undefined;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      error: null,

      // Actions
      addItem: (newItem) => {
        const existingItem = get().getItemByVariant(newItem.productVariantId);

        if (existingItem) {
          // Update quantity if item already exists
          set((state) => ({
            items: state.items.map((item) =>
              item.productVariantId === newItem.productVariantId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          }));
        } else {
          // Add new item
          const cartItem: CartItem = {
            ...newItem,
            id: crypto.randomUUID(),
          };
          set((state) => ({
            items: [...state.items, cartItem],
          }));
        }
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setItems: (items) => {
        set({ items });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.salePrice || item.price);
          return total + price * item.quantity;
        }, 0);
      },

      getItemByVariant: (productVariantId) => {
        return get().items.find(
          (item) => item.productVariantId === productVariantId
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
