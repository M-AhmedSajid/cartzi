"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { LuX } from "react-icons/lu";

export function ActiveFilterChips({minPriceData, maxPriceData}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Identify which URL parameters represent active filters we want to show
  // We exclude generic things like "sort" or "page"
  const filterKeys = ["category", "size", "color", "material", "stock", "discount"];

  // 2. Gather all active filters into an array of objects
  const activeFilters = [];

  filterKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      // Split comma-separated values (e.g., "blue,red" -> ["blue", "red"])
      value.split(",").forEach((val) => {
        activeFilters.push({ key, val });
      });
    }
  });

  // Handle Price separately since it has a min/max range
  const minPrice = searchParams.get("min");
  const maxPrice = searchParams.get("max");
  if (minPrice || maxPrice) {
    activeFilters.push({
      key: "price",
      val: `${minPrice ? `$${minPrice}` : `$${minPriceData}`} - ${maxPrice ? `$${maxPrice}` : `$${maxPriceData}`}`,
      isPriceRange: true, // Tag to handle removal logic uniquely
    });
  }

  // 3. Logic to remove a single filter and update the URL cleanly
  const removeFilter = (key, valueToRemove, isPriceRange = false) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (isPriceRange) {
      params.delete("min");
      params.delete("max");
    } else {
      const currentValues = params.get(key)?.split(",") || [];
      const updatedValues = currentValues.filter((v) => v !== valueToRemove);

      if (updatedValues.length > 0) {
        params.set(key, updatedValues.join(","));
      } else {
        params.delete(key);
      }
    }

    router.push(`?${params.toString()}`);
  };

  // 4. Logic to clear all active filters at once
  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    filterKeys.forEach((key) => params.delete(key));
    params.delete("min");
    params.delete("max");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex overflow-x-auto md:flex-wrap items-center gap-2 px-5 py-2 bg-card border md:border-l-0 md:border-t-0 rounded-lg md:rounded-none md:rounded-br-lg mt-3 md:mt-0">
      <span className="text-sm font-medium text-muted-foreground min-w-max">Active Filters:</span>
      
      {activeFilters.map(({ key, val, isPriceRange }) => (
        <Badge
          key={`${key}-${val}`}
          onClick={() => removeFilter(key, val, isPriceRange)}
          variant="outline"
          className="pl-2.5 pr-1 py-1 gap-1 text-xs font-normal rounded-full transition-all hover:bg-accent/25 cursor-pointer"
        >
          {/* Format the label nicely */}
          <span className="capitalize">
            {key === "stock" ? "In Stock Only" : key === "discount" ? "On Sale" : val}
          </span>
            <LuX className="size-3" />
        </Badge>
      ))}

      {/* "Clear All" utility button */}
      <button
        onClick={clearAllFilters}
        className="text-xs text-muted-foreground hover:text-destructive font-medium underline underline-offset-4 ml-1 transition-colors min-w-max cursor-pointer"
      >
        Clear all
      </button>
    </div>
  );
}