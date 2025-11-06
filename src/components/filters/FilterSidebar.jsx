"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import { useState } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterSidebar({ filters, searchParams }) {
  return (
    <>
      {/* MOBILE FILTER BUTTON */}
      <div className="flex items-center justify-end md:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[85%] sm:w-[400px] overflow-y-auto gap-0"
          >
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mb-5">
              <FilterContent filters={filters} searchParams={searchParams} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block border h-fit bg-card rounded-lg rounded-tr-none py-4">
        <FilterContent
          filters={filters}
          searchParams={searchParams}
          desktop={true}
        />
      </div>
    </>
  );
}

function FilterContent({ filters, searchParams, desktop }) {
  const router = useRouter();
  const params = useSearchParams();

  // Initialize from URL params
  const [formState, setFormState] = useState(() => {
    const obj = {};
    for (const [key, val] of params.entries()) {
      obj[key] = val.split(",");
    }
    return obj;
  });

  const [range, setRange] = useState([
    Number(params.get("min")) || filters.minPrice,
    Number(params.get("max")) || filters.maxPrice,
  ]);

  // Helper to update URL with filters
  const updateSearchParams = (newState, newRange = range) => {
    const url = new URL(window.location.href);
    Object.entries(newState).forEach(([key, values]) => {
      if (!values || values.length === 0) url.searchParams.delete(key);
      else url.searchParams.set(key, values.join(","));
    });

    url.searchParams.set("min", newRange[0]);
    url.searchParams.set("max", newRange[1]);
    router.push(url.pathname + "?" + url.searchParams.toString());
  };

  // Checkbox/option changes
  const handleChange = (name, value, checked) => {
    setFormState((prev) => {
      const current = new Set(prev[name] || []);
      if (checked) current.add(value);
      else current.delete(value);

      const updated = { ...prev, [name]: [...current] };

      if (desktop) updateSearchParams(updated);
      return updated;
    });
  };

  // Price changes
  const handlePriceChange = (val) => {
    setRange(val);
    if (desktop) updateSearchParams(formState, val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSearchParams(formState, range);
  };

  const groupedCategories = filters.categories
    // Remove "New Arrivals" and "Featured"
    .filter((cat) => !["New Arrivals", "Featured"].includes(cat.name))
    // Remove parent categories (those that appear as a parent for others)
    .filter((cat) => !filters.categories.some((c) => c.parent?._id === cat._id))
    // Group remaining ones by their parent name or "Others"
    .reduce((acc, cat) => {
      const parentName = cat.parent?.name || "Others";
      if (!acc[parentName]) acc[parentName] = [];
      acc[parentName].push(cat);
      return acc;
    }, {});

  const groupedCategoriesOrdered = Object.fromEntries(
    Object.entries(groupedCategories).sort(([a], [b]) => {
      if (a === "Others") return -1;
      if (b === "Others") return 1;
      return a.localeCompare(b);
    })
  );

  return (
    <form onSubmit={desktop ? (e) => e.preventDefault() : handleSubmit}>
      {desktop && <h2 className="text-lg font-semibold px-4">Filters</h2>}

      <Accordion type="multiple" defaultValue={["category", "price", "stock"]}>
        {/* CATEGORY */}
        <AccordionItem value="category" className="px-4">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {Object.entries(groupedCategoriesOrdered)
              .reverse()
              .map(([parentName, subcategories]) => {
                const parentSlug = subcategories[0]?.parent?.slug; // assuming all subs share same parent

                return (
                  <Accordion key={parentName} type="single" collapsible>
                    <AccordionItem value={parentName}>
                      {/* PARENT CATEGORY LINK */}
                      <AccordionTrigger className="py-1">
                        <Link
                          href={`/category/${parentSlug}`}
                          className="text-sm font-medium hover:text-primary transition"
                        >
                          {parentName}
                        </Link>
                      </AccordionTrigger>

                      {/* SUBCATEGORIES AS LINKS */}
                      <AccordionContent className="space-y-1 pl-6">
                        {subcategories.map((cat) => {
                          const parentPath = parentSlug
                            ? `/category/${parentSlug}/${cat.slug}`
                            : `/category/${cat.slug}`;
                          return (
                            <Link
                              key={cat._id}
                              href={parentPath}
                              className="block text-sm text-muted-foreground hover:text-primary transition"
                            >
                              {cat.name}
                            </Link>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
          </AccordionContent>
        </AccordionItem>

        {/* PRICE RANGE */}
        <AccordionItem value="price">
          <AccordionTrigger className="px-4">Price Range</AccordionTrigger>
          <AccordionContent className="pt-3 space-y-4 px-4">
            <div className="flex items-center gap-2">
              <div className="flex flex-col w-1/2">
                <Label htmlFor="min" className="text-xs text-muted-foreground">
                  Min
                </Label>
                <Input
                  id="min"
                  type="number"
                  min={filters.minPrice}
                  max={range[1]}
                  value={range[0]}
                  onChange={(e) =>
                    handlePriceChange([Number(e.target.value), range[1]])
                  }
                />
              </div>
              <div className="flex flex-col w-1/2">
                <Label htmlFor="max" className="text-xs text-muted-foreground">
                  Max
                </Label>
                <Input
                  id="max"
                  type="number"
                  min={range[0]}
                  max={filters.maxPrice}
                  value={range[1]}
                  onChange={(e) =>
                    handlePriceChange([range[0], Number(e.target.value)])
                  }
                />
              </div>
            </div>
            <Slider
              min={filters.minPrice}
              max={filters.maxPrice}
              step={10}
              value={range}
              onValueChange={handlePriceChange}
            />
            <p className="text-sm text-muted-foreground">
              ${range[0]} — ${range[1]}
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* SIZE */}
        <AccordionItem value="size" className="px-4">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent className="grid grid-cols-3 gap-2">
            {filters?.sizes?.map(
              (size) =>
                size && (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={size}
                      checked={formState.size?.includes(size) || false}
                      onCheckedChange={(checked) =>
                        handleChange("size", size, checked)
                      }
                    />
                    <Label htmlFor={size} className="text-sm">
                      {size}
                    </Label>
                  </div>
                )
            )}
          </AccordionContent>
        </AccordionItem>

        {/* COLOR */}
        <AccordionItem value="color" className="px-4">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2">
            {filters.colors?.map((color) => (
              <label
                key={color._id}
                className="size-6 rounded-full border cursor-pointer relative"
                style={{
                  backgroundColor: color.hex,
                  borderColor:
                    color.hex.toLowerCase() === "#ffffff" ? "#ccc" : color.hex,
                }}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formState.color?.includes(color._id) || false}
                  onChange={(e) =>
                    handleChange("color", color._id, e.target.checked)
                  }
                />
                {formState.color?.includes(color._id) && (
                  <span className="absolute inset-0 ring-2 ring-offset-2 ring-primary rounded-full" />
                )}
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* MATERIAL */}
        <AccordionItem value="material" className="px-4">
          <AccordionTrigger>Material</AccordionTrigger>
          <AccordionContent className="space-y-2 max-h-60 overflow-x-auto">
            {filters.materials?.map((mat) => (
              <div key={mat._id} className="flex items-center space-x-2">
                <Checkbox
                  id={mat._id}
                  checked={formState.material?.includes(mat._id) || false}
                  onCheckedChange={(checked) =>
                    handleChange("material", mat._id, checked)
                  }
                />
                <Label htmlFor={mat._id} className="text-sm">
                  {mat.name}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* AVAILABILITY */}
        <AccordionItem value="stock" className="px-4">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <Checkbox
                id="in-stock"
                checked={formState.stock?.includes("in-stock") || false}
                onCheckedChange={(checked) =>
                  handleChange("stock", "in-stock", checked)
                }
              />
              <Label htmlFor="in-stock" className="text-sm">
                In Stock Only
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* DISCOUNT */}
        <AccordionItem value="discount" className="px-4">
          <AccordionTrigger>Discounts</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="on-sale"
                checked={formState.discount?.includes("on-sale") || false}
                onCheckedChange={(checked) =>
                  handleChange("discount", "on-sale", checked)
                }
              />
              <Label htmlFor="on-sale" className="text-sm">
                On Sale
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator className="my-4" />

      <div className="px-4 mt-4 space-y-3">
        {!desktop && (
          <Button type="submit" variant="default" className="w-full">
            Apply Filters
          </Button>
        )}
        <Link href="/shop" className="block">
          <Button type="button" variant="outline" className="w-full">
            Reset
          </Button>
        </Link>
      </div>
    </form>
  );
}
