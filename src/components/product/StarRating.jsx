"use client";
import { Star } from "lucide-react";

const StarRating = ({ rating = 0, outOf = 5, size = "size-4" }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: outOf }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < Math.round(rating)
              ? "fill-yellow-500 text-yellow-500"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-xs/5 text-muted-foreground ml-1 hidden sm:inline">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
