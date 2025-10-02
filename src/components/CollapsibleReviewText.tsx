"use client";

import { useState } from "react";

interface CollapsibleReviewTextProps {
  content: string;
  maxLength?: number;
}

export default function CollapsibleReviewText({
  content,
  maxLength = 200,
}: CollapsibleReviewTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLong = content.length > maxLength;
  const displayText =
    isExpanded || !isLong ? content : `${content.substring(0, maxLength)}...`;

  if (!isLong) {
    return <p>{content}</p>;
  }

  return (
    <div>
      <p>{displayText}</p>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-dark-900 hover:text-dark-700 text-caption font-medium mt-2 underline transition-colors"
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
