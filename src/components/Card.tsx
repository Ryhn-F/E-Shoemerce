"use client";

import Image from "next/image";
import { CardProps } from "./types";

export default function Card({
  title,
  category,
  price,
  image,
  imageAlt,
  colors = [],
  badge,
  className = "",
  onClick,
}: CardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`bg-light-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? "button" : "article"}
      aria-label={onClick ? `View ${title}` : undefined}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-light-200 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                badge === "best-seller"
                  ? "bg-orange text-light-100"
                  : badge === "new"
                  ? "bg-green text-light-100"
                  : badge === "sale"
                  ? "bg-red text-light-100"
                  : "bg-dark-900 text-light-100"
              }`}
            >
              {badge === "best-seller"
                ? "Best Seller"
                : badge.charAt(0).toUpperCase() + badge.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {category && (
          <p className="text-dark-700 text-caption font-medium mb-1">
            {category}
          </p>
        )}

        {/* Title */}
        <h3 className="text-dark-900 text-body-medium font-medium mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-dark-700 text-caption mr-2">
              {colors.length} Colour{colors.length !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-1">
              {colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-light-400"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  aria-label={`Color: ${color.name}`}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-dark-700 text-caption ml-1">
                  +{colors.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price */}
        {price && (
          <div className="text-dark-900 text-body-medium font-medium">
            {typeof price === 'string' ? <p>{price}</p> : price}
          </div>
        )}
      </div>
    </div>
  );
}
