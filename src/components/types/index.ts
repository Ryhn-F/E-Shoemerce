// Navigation interfaces
export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "x";
  href: string;
  icon: string;
}

// Navbar component interface
export interface NavbarProps {
  cartItemCount?: number;
  onSearchClick?: () => void;
  onCartClick?: () => void;
}

// Card component interfaces
export interface ProductColor {
  name: string;
  value: string; // hex color code
}

export type BadgeType = "best-seller" | "new" | "sale";

export interface CardProps {
  title: string;
  category?: string;
  price?: string | React.ReactNode;
  image: string;
  imageAlt: string;
  colors?: ProductColor[];
  badge?: BadgeType;
  className?: string;
  onClick?: () => void;
}

// Footer component interfaces
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  className?: string;
}

// Product data model
export interface ProductData {
  id: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  colors: ProductColor[];
  badge?: BadgeType;
}
