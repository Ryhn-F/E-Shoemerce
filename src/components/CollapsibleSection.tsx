"use client";

import { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  children,
  defaultExpanded = false,
  icon,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleExpanded();
      }
    },
    [toggleExpanded]
  );

  const contentId = `collapsible-content-${title
    .replace(/\s+/g, "-")
    .toLowerCase()}`;

  return (
    <div className="border-b border-light-300 last:border-b-0">
      {/* Header */}
      <button
        type="button"
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-light-200 transition-colors focus:outline-none focus:bg-light-200"
        aria-expanded={isExpanded ? "true" : "false"}
        aria-controls={contentId}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-dark-700">{icon}</span>}
          <h3 className="text-body-medium font-medium text-dark-900">
            {title}
          </h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-dark-700 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content */}
      <div
        id={contentId}
        className={`collapsible-content transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isExpanded ? "true" : "false"}
      >
        <div ref={contentRef} className="pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}
