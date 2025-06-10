// client/src/components/reviews/StarRating.jsx
import React from "react";
import { Star } from "lucide-react";

const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onRatingChange,
}) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6",
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(starRating)}
            disabled={!interactive}
            className={`
              ${
                interactive
                  ? "cursor-pointer hover:scale-110 transition-transform"
                  : "cursor-default"
              }
              ${interactive ? "p-1" : ""}
            `}
          >
            <Star
              className={`
                ${sizeClasses[size]}
                ${
                  isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }
                ${interactive && !isFilled ? "hover:text-yellow-400" : ""}
              `}
            />
          </button>
        );
      })}

      {showValue && (
        <span className="text-sm font-medium text-gray-700 ml-2">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
