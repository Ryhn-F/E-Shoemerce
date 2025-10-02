"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import {
  parseFilters,
  createFilterURL,
  addFilter,
  removeFilter,
  updateGenderFilter,
  updatePriceRange,
  clearAllFilters,
} from "@/src/lib/utils/query";
import { mockGenders, mockSizes, mockColors } from "@/src/lib/mock-data";

interface FiltersProps {
  className?: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: Array<{ value: string; label: string; count?: number }>;
}

export default function Filters({ className = "" }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["gender", "size", "color", "price"])
  );

  const currentFilters = parseFilters(searchParams);

  // Simple approach: just use current filters and handle updates directly
  const activeFilters = currentFilters;

  const filterGroups: FilterGroup[] = [
    {
      id: "gender",
      label: "Gender",
      options: mockGenders.map((gender) => ({
        value: gender.slug,
        label: gender.label,
      })),
    },
    {
      id: "size",
      label: "Size",
      options: mockSizes.map((size) => ({
        value: size.slug,
        label: size.name,
      })),
    },
    {
      id: "color",
      label: "Color",
      options: mockColors.map((color) => ({
        value: color.slug,
        label: color.name,
      })),
    },
  ];

  const priceRanges = [
    { value: "0-50", label: "Under $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-150", label: "$100 - $150" },
    { value: "150-200", label: "$150 - $200" },
    { value: "200+", label: "$200+" },
  ];

  const updateURL = (newFilters: ReturnType<typeof parseFilters>) => {
    const newURL = createFilterURL(newFilters);
    router.replace(newURL, { scroll: false });
  };

  const handleGenderChange = (value: string, checked: boolean) => {
    const newFilters = updateGenderFilter(
      activeFilters,
      checked ? value : null
    );
    updateURL(newFilters);
  };

  const handleMultiSelectFilterChange = (
    filterType: "size" | "color",
    value: string,
    checked: boolean
  ) => {
    // Create a new filters object based on active state
    const newFilters = { ...activeFilters };

    if (checked) {
      // Add the value if it's not already there
      if (!newFilters[filterType].includes(value)) {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
    } else {
      // Remove the value
      newFilters[filterType] = newFilters[filterType].filter(
        (v) => v !== value
      );
    }

    // Reset page to 1
    newFilters.page = 1;

    updateURL(newFilters);
  };

  const handlePriceRangeChange = (value: string, checked: boolean) => {
    const newFilters = updatePriceRange(activeFilters, checked ? value : null);
    updateURL(newFilters);
  };

  const handleClearAll = () => {
    const newFilters = clearAllFilters();
    updateURL(newFilters);
  };

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const hasActiveFilters =
    activeFilters.gender !== null ||
    activeFilters.size.length > 0 ||
    activeFilters.color.length > 0 ||
    activeFilters.priceRange !== null;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-heading-3 font-medium text-dark-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-caption text-dark-700 hover:text-dark-900 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Groups */}
      {filterGroups.map((group) => (
        <div key={group.id} className="border-b border-light-300 pb-4">
          <button
            onClick={() => toggleGroup(group.id)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-body-medium font-medium text-dark-900">
              {group.label}
            </h3>
            {expandedGroups.has(group.id) ? (
              <ChevronUp className="w-4 h-4 text-dark-700" />
            ) : (
              <ChevronDown className="w-4 h-4 text-dark-700" />
            )}
          </button>

          {expandedGroups.has(group.id) && (
            <div className="mt-3 space-y-2">
              {group.id === "gender" ? (
                // Gender - Single select with radio buttons
                <>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      checked={activeFilters.gender === null}
                      onChange={() => handleGenderChange("", false)}
                      className="w-4 h-4 text-dark-900 border-light-400 focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
                    />
                    <span className="ml-3 text-body text-dark-900 group-hover:text-dark-700 transition-colors">
                      All
                    </span>
                  </label>
                  {group.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="gender"
                        checked={activeFilters.gender === option.value}
                        onChange={(e) =>
                          handleGenderChange(option.value, e.target.checked)
                        }
                        className="w-4 h-4 text-dark-900 border-light-400 focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
                      />
                      <span className="ml-3 text-body text-dark-900 group-hover:text-dark-700 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </>
              ) : (
                // Size and Color - Multi-select with checkboxes
                group.options.map((option) => {
                  // More robust way to determine if checkbox is checked
                  let isChecked = false;
                  if (group.id === "size") {
                    isChecked = activeFilters.size.includes(option.value);
                  } else if (group.id === "color") {
                    isChecked = activeFilters.color.includes(option.value);
                  }

                  return (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          handleMultiSelectFilterChange(
                            group.id as "size" | "color",
                            option.value,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-dark-900 border-light-400 rounded focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
                      />
                      <span className="ml-3 text-body text-dark-900 group-hover:text-dark-700 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          )}
        </div>
      ))}

      {/* Price Range */}
      <div className="border-b border-light-300 pb-4">
        <button
          onClick={() => toggleGroup("price")}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-body-medium font-medium text-dark-900">Price</h3>
          {expandedGroups.has("price") ? (
            <ChevronUp className="w-4 h-4 text-dark-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-dark-700" />
          )}
        </button>

        {expandedGroups.has("price") && (
          <div className="mt-3 space-y-2">
            {priceRanges.map((range) => (
              <label
                key={range.value}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={activeFilters.priceRange === range.value}
                  onChange={(e) =>
                    handlePriceRangeChange(range.value, e.target.checked)
                  }
                  className="w-4 h-4 text-dark-900 border-light-400 focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
                />
                <span className="ml-3 text-body text-dark-900 group-hover:text-dark-700 transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-light-400 rounded-lg text-body-medium text-dark-900 hover:bg-light-200 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-dark-900 text-light-100 text-footnote px-2 py-0.5 rounded-full">
              {(activeFilters.gender ? 1 : 0) +
                activeFilters.size.length +
                activeFilters.color.length +
                (activeFilters.priceRange ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${className}`}>
        <div className="bg-light-100 p-6 rounded-lg">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-dark-900 bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-80 max-w-[80vw] bg-light-100 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-light-300">
              <h2 className="text-heading-3 font-medium text-dark-900">
                Filters
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-light-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-dark-700" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
