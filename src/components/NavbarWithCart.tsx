"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/src/store/cart.store";
import Navbar from "./Navbar";
import MiniCart from "./MiniCart";

export default function NavbarWithCart() {
  const router = useRouter();
  const { getTotalItems } = useCartStore();
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  const handleCartClick = () => {
    // Toggle mini cart on desktop, go to cart page on mobile
    if (window.innerWidth >= 1024) {
      setIsMiniCartOpen(!isMiniCartOpen);
    } else {
      router.push("/cart");
    }
  };

  const handleSearchClick = () => {
    // Implement search functionality
    console.log("Search clicked");
  };

  return (
    <div className="relative">
      <Navbar
        cartItemCount={getTotalItems()}
        onCartClick={handleCartClick}
        onSearchClick={handleSearchClick}
      />
      <MiniCart
        isOpen={isMiniCartOpen}
        onClose={() => setIsMiniCartOpen(false)}
      />
    </div>
  );
}
