"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const StarRating = ({
  rating = 0,
  outOf = 5,
  size = "size-4",
  className,
  interactive = false,
  setRating, // pass from parent if you want to control state outside
}) => {
  const [hovered, setHovered] = useState(null);

  const displayRating = hovered ?? rating;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: outOf }).map((_, i) => {
        const starIndex = i + 1;
        return (
          <Star
            key={i}
            onMouseEnter={() => interactive && setHovered(starIndex)}
            onMouseLeave={() => interactive && setHovered(null)}
            onClick={() => interactive && setRating?.(starIndex)}
            className={cn(
              size,
              "cursor-pointer transition-colors",
              starIndex <= Math.round(displayRating)
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-300"
            )}
          />
        );
      })}
      {!interactive && (
        <span
          className={cn(
            className,
            "text-xs/5 text-muted-foreground ml-1 inline"
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
