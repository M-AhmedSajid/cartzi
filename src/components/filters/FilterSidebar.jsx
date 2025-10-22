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
import { applyFilters } from "@/actions";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

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
      <div className="hidden md:block w-64 shrink-0 border h-fit bg-card rounded-lg py-4 shadow-sm">
        <FilterContent
          filters={filters}
          searchParams={searchParams}
          desktop={true}
        />
      </div>
    </>
  );
}

const FilterContent = ({ filters, searchParams, desktop }) => {
  const [range, setRange] = useState([filters.minPrice, filters.maxPrice]);

  const groupedCategories = filters.categories.reduce((acc, cat) => {
    const parentName = cat.parent?.name || "Others";
    if (!acc[parentName]) acc[parentName] = [];
    acc[parentName].push(cat);
    return acc;
  }, {});
  return (
    <form onSubmit={applyFilters}>
      {desktop && <h2 className="text-lg font-semibold px-4">Filters</h2>}

      <Accordion type="multiple" defaultValue={["category", "price", "stock"]}>
        {/* CATEGORY */}
        <AccordionItem value="category" className="px-4">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {Object.entries(groupedCategories)
              .reverse()
              .map(([parentName, subcategories]) => (
                <Accordion key={parentName} type="single" collapsible>
                  <AccordionItem value={parentName}>
                    <div className="flex items-center gap-2">
                      <Checkbox name="category" value={parentName} />
                      <AccordionTrigger className="py-1">
                        <span className="font-medium text-sm">
                          {parentName}
                        </span>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="space-y-2 pl-6">
                      {subcategories.map((cat) => (
                        <div key={cat._id} className="flex items-center gap-3">
                          <Checkbox
                            id={cat.slug}
                            name="category"
                            value={cat.slug}
                          />
                          <Label htmlFor={cat.slug} className="text-sm">
                            {cat.name}
                          </Label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
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
                  onChange={(e) => setRange([Number(e.target.value), range[1]])}
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
                  onChange={(e) => setRange([range[0], Number(e.target.value)])}
                />
              </div>
            </div>

            <Slider
              min={filters.minPrice}
              max={filters.maxPrice}
              step={10}
              value={range}
              onValueChange={setRange}
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
                size !== null && (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox id={size} name="size" value={size} />
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
                className="size-6 rounded-full border cursor-pointer"
                style={{
                  backgroundColor: color.hex,
                  borderColor:
                    color.hex.toLowerCase() === "#ffffff" ? "#ccc" : color.hex,
                }}
              >
                <input
                  type="checkbox"
                  name="color"
                  value={color._id}
                  className="sr-only peer"
                />
                <span className="hidden peer-checked:block ring-2 ring-offset-2 ring-primary size-6 rounded-full" />
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
                <Checkbox id={mat._id} name="material" value={mat._id} />
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
              <Checkbox id="in-stock" name="stock" value="in-stock" />
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
              <Checkbox id="on-sale" name="discount" value="on-sale" />
              <Label htmlFor="on-sale" className="text-sm">
                On Sale
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />
      <div className="px-4 mt-4 space-y-3">
        <Button type="submit" variant="default" className="w-full">
          Apply Filters
        </Button>
        <Link href="/shop" className="block">
          <Button type="button" variant="outline" className="w-full">
            Reset
          </Button>
        </Link>
      </div>
    </form>
  );
};
