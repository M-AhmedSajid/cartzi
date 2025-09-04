"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const VariantsSelection = ({ variants, onChange }) => {
  // Deduplicate colors directly from variants
  const colors = useMemo(() => variants || [], [variants]);

  // Pick first color that has at least one size in stock
  const [selectedColor, setSelectedColor] = useState(() => {
    return colors.find((c) => c.sizes?.some((s) => s.stock > 0)) || colors[0];
  });

  // Sizes available for the selected color
  const sizesForColor = useMemo(() => {
    if (!selectedColor) return [];
    return (
      selectedColor.sizes?.map((s) => ({
        id: s.sku,
        name: s.size,
        inStock: s.stock > 0,
        variant: { ...s, color: selectedColor.color },
      })) || []
    );
  }, [selectedColor]);

  const [selectedSize, setSelectedSize] = useState(null);

  // Reset selected size when color changes
  useEffect(() => {
    if (sizesForColor.length > 0) {
      const firstAvailable =
        sizesForColor.find((s) => s.inStock) || sizesForColor[0];
      setSelectedSize(firstAvailable);
    } else {
      setSelectedSize(null);
    }
  }, [selectedColor, sizesForColor]);

  // Selected variant = color + size combo
  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return {
      sku: selectedSize.id,
      size: selectedSize.name,
      stock: selectedSize.variant.stock,
      priceOverride: selectedSize.variant.priceOverride,
      color: selectedColor.color,
      images: selectedColor.images,
    };
  }, [selectedColor, selectedSize]);

  // Notify parent
  useEffect(() => {
    if (onChange) onChange(selectedVariant);
  }, [selectedVariant, onChange]);

  const colorLength = colors.filter((c) =>
    c.sizes?.some((s) => s.stock > 0)
  ).length;

  return (
    <div className="space-y-3">
      {/* Color Selection */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Color: {selectedColor?.color?.name}
        </span>
        <span className="text-sm text-gray-500">
          {colorLength} color{colorLength !== 1 && "s"} available
        </span>
      </div>
      <div className="flex space-x-3">
        {colors.map((color) => {
          const inStock = color.sizes?.some((s) => s.stock > 0);
          return (
            <Tooltip key={color.color.name}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={() => inStock && setSelectedColor(color)}
                  className={`rounded-full border-2 relative 
                    ${!inStock ? "opacity-50 cursor-not-allowed" : ""}
                    ${
                      selectedColor?.color?.name === color.color.name
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "ring-transparent"
                    }
                  `}
                  style={{ backgroundColor: color.color.hex }}
                  disabled={!inStock}
                >
                  {!inStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-gray-500 rotate-45"></div>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{color.color.name}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Size Selection */}
      <p className="text-sm font-medium text-foreground">Size</p>
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {sizesForColor.map((size) => (
          <Button
            size="lg"
            key={size.id}
            variant={selectedSize?.id === size.id ? "default" : "outline"}
            onClick={() => size.inStock && setSelectedSize(size)}
            className={`${
              selectedSize?.id === size.id && "hover:bg-primary"
            } flex-col gap-0 h-12 disabled:hover:bg-transparent`}
            disabled={!size.inStock}
          >
            {size.name}
            {!size.inStock && (
              <span className="block text-xs">Out of stock</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default VariantsSelection;
