import React, { memo } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

// Memoized Option Button Component
const OptionButton = memo(({ option, index, isSelected, onSelect }) => {
  // Function to render content with math support
  const renderMathContent = (text) => {
    if (!text) return null;
    
    // If there's no math delimiters in the text, return it as is to improve performance
    if (!text.includes('$')) {
      return text;
    }
    
    // Split text by math delimiters ($...$ or $$...$$)
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);
    
    return parts.map((part, idx) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        // Block math
        const mathContent = part.slice(2, -2);
        return <BlockMath key={idx} math={mathContent} />;
      } else if (part.startsWith("$") && part.endsWith("$")) {
        // Inline math (not starting with $$)
        const mathContent = part.slice(1, -1);
        return <InlineMath key={idx} math={mathContent} />;
      } else {
        // Regular text
        return <span key={idx}>{part}</span>;
      }
    });
  };

  return (
    <button
      key={index}
      onClick={() => onSelect(index)}
      className={`w-full text-left p-4 rounded-lg border transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
    >
      <div className="flex items-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
            isSelected
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
        >
          {String.fromCharCode(65 + index)}
        </div>
        <span className="text-gray-800 dark:text-gray-200">{renderMathContent(option)}</span>
      </div>
    </button>
  );
});

OptionButton.displayName = "OptionButton";

export default OptionButton;