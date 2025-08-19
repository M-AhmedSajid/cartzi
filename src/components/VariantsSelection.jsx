"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const VariantsSelection = ({ variants, onChange }) => {
  const colors = useMemo(() => {
    return Array.from(new Map(variants.map((v) => [v.color.name, v])).values());
  }, [variants]);

  const [selectedColor, setSelectedColor] = useState(
    colors.find((c) => c.stock > 0) || colors[0]
  );

  const sizesForColor = useMemo(() => {
    return variants
      .filter((v) => v.color.name === selectedColor.color.name)
      .map((v) => ({
        id: v.sku,
        name: v.size,
        inStock: v.stock > 0,
        variant: v,
      }));
  }, [selectedColor, variants]);

  const [selectedSize, setSelectedSize] = useState(
    sizesForColor.find((s) => s.inStock) || sizesForColor[0]
  );

  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return variants.find(
      (v) =>
        v.color.name === selectedColor.color.name &&
        v.size === selectedSize.name
    );
  }, [selectedColor, selectedSize, variants]);

  // Call parent onChange whenever selectedVariant changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedVariant);
    }
  }, [selectedVariant, onChange]);

  const colorLength = colors.filter((c) =>
    variants.some((v) => v.color.name === c.color.name && v.stock > 0)
  ).length;

  return (
    <div className="space-y-3">
      {/* Color Selection */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Color: {selectedColor?.color.name}
        </span>
        <span className="text-sm text-gray-500">
          {colorLength} color{colorLength !== 1 && "s"} available
        </span>
      </div>
      <div className="flex space-x-3">
        {colors.map((color) => {
          const inStock = variants.some(
            (v) => v.color.name === color.color.name && v.stock > 0
          );
          return (
            <Tooltip key={color.sku || color.color.name}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={() => inStock && setSelectedColor(color)}
                  className={`rounded-full border-2 relative 
                    ${!inStock ? "opacity-50 cursor-not-allowed" : ""}
                    ${selectedColor.color.name === color.color.name ? "ring-2 ring-offset-2 ring-primary" : "ring-transparent"}
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
            variant={`${selectedSize?.id === size.id ? "default" : "outline"}`}
            onClick={() => size.inStock && setSelectedSize(size)}
            className={`${selectedSize?.id === size.id && "hover:bg-primary"} flex-col gap-0 h-12`}
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
