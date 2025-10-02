"use client";

import { useState, useCallback } from "react";

interface Size {
  id: string;
  name: string;
  slug: string;
}

interface SizePickerProps {
  sizes: Size[];
  selectedSize?: string;
  onSizeSelect?: (sizeId: string) => void;
}

export default function SizePicker({
  sizes,
  selectedSize,
  onSizeSelect,
}: SizePickerProps) {
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(
    selectedSize || null
  );

  const handleSizeSelect = useCallback(
    (sizeId: string) => {
      setSelectedSizeId(sizeId);
      onSizeSelect?.(sizeId);
    },
    [onSizeSelect]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, sizeId: string) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSizeSelect(sizeId);
      }
    },
    [handleSizeSelect]
  );

  if (sizes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Size Label and Guide */}
      <div className="flex items-center justify-between">
        <h3 className="text-body-medium font-medium text-dark-900">
          Select Size
        </h3>
        <button
          type="button"
          className="text-dark-700 text-caption underline hover:text-dark-900 transition-colors"
        >
          Size Guide
        </button>
      </div>

      {/* Size Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {sizes.map((size) => (
          <button
            type="button"
            key={size.id}
            onClick={() => handleSizeSelect(size.id)}
            onKeyDown={(e) => handleKeyDown(e, size.id)}
            className={`
              relative h-12 border rounded-lg transition-all duration-200 
              flex items-center justify-center text-body-medium font-medium
              focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2
              ${
                selectedSizeId === size.id
                  ? "bg-dark-900 text-light-100 border-dark-900"
                  : "bg-light-100 text-dark-900 border-light-400 hover:border-dark-900 hover:bg-light-200"
              }
            `}
            aria-pressed={selectedSizeId === size.id ? "true" : "false"}
            aria-label={`Size ${size.name}`}
          >
            {size.name}
          </button>
        ))}
      </div>

      {/* Selected Size Display */}
      {selectedSizeId && (
        <div className="text-caption text-dark-700">
          Selected: Size {sizes.find((s) => s.id === selectedSizeId)?.name}
        </div>
      )}
    </div>
  );
}
