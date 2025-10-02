"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  parseFilters,
  createFilterURL,
  updateSort,
} from "@/src/lib/utils/query";

interface SortProps {
  className?: string;
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function Sort({ className = "" }: SortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentFilters = parseFilters(searchParams);
  const currentSort = currentFilters.sort;
  const currentSortLabel =
    sortOptions.find((option) => option.value === currentSort)?.label ||
    "Featured";

  const updateURL = (newFilters: ReturnType<typeof parseFilters>) => {
    const newURL = createFilterURL(newFilters);
    router.replace(newURL, { scroll: false });
  };

  const handleSortChange = (sortValue: string) => {
    const newFilters = updateSort(currentFilters, sortValue);
    updateURL(newFilters);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-body text-dark-700 hidden sm:inline">
          Sort by:
        </span>

        {/* Desktop Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-light-400 rounded-lg text-body-medium text-dark-900 hover:bg-light-200 transition-colors min-w-[160px] justify-between"
          >
            <span>{currentSortLabel}</span>
            <ChevronDown
              className={`w-4 h-4 text-dark-700 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <>
              {/* Overlay for mobile */}
              <div
                className="fixed inset-0 z-10 lg:hidden"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 w-full bg-light-100 border border-light-400 rounded-lg shadow-lg z-20">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-3 text-body hover:bg-light-200 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      currentSort === option.value
                        ? "text-dark-900 font-medium bg-light-200"
                        : "text-dark-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
