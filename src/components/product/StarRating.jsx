"use client";
import { Star } from "lucide-react";

const StarRating = ({ rating = 0, outOf = 5 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: outOf }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
