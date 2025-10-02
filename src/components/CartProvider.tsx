"use client";

import { useEffect } from "react";
import { useCartStore } from "@/src/store/cart.store";
import { getCart } from "@/src/lib/actions/cart";

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setItems, setLoading } = useCartStore();

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const result = await getCart();
        if (result.success && result.items) {
          // Convert server items to store format
          const storeItems = result.items.map((item) => ({
            id: item.id,
            productVariantId: item.productVariantId,
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            variantSku: item.variantSku,
            colorName: item.colorName,
            colorValue: item.colorValue,
            sizeName: item.sizeName,
            price: item.price,
            salePrice: item.salePrice || undefined,
            quantity: item.quantity,
          }));
          setItems(storeItems);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [setItems, setLoading]);

  return <>{children}</>;
}
