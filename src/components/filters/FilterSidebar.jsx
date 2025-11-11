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
import { useEffect, useState } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export default function FilterSidebar({ filters, searchParams }) {
  const pathname = usePathname();
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <>
      {/* MOBILE FILTER BUTTON */}
      <div className="flex items-center justify-between md:hidden mb-4 gap-5">
        <Breadcrumb className="md:hidden overflow-auto">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {pathname.split("/")[3] ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/${pathname.split("/")[2]}`}
                    className="capitalize"
                  >
                    {pathname.split("/")[2]}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">
                    {pathname.split("/")[3]}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {pathname.split("/")[2]}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
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
            <FilterContent
              filters={filters}
              searchParams={searchParams}
              setFilterOpen={setFilterOpen}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block border h-fit bg-card rounded-lg rounded-tr-none py-4">
        <FilterContent
          filters={filters}
          searchParams={searchParams}
          desktop={true}
          setFilterOpen={setFilterOpen}
        />
      </div>
    </>
  );
}

function FilterContent({ filters, searchParams, desktop, setFilterOpen }) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const [pendingUpdate, setPendingUpdate] = useState(null);

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

  const updateSearchParams = (newState, newRange = range) => {
    setPendingUpdate({ newState, newRange });
  };

  useEffect(() => {
    if (!pendingUpdate) return;

    const { newState, newRange } = pendingUpdate;
    const url = new URL(window.location.href);

    // Handle checkboxes and lists
    Object.entries(newState).forEach(([key, values]) => {
      if (!values || values.length === 0) url.searchParams.delete(key);
      else url.searchParams.set(key, values.join(","));
    });

    // Handle min/max only if changed from defaults
    const [minVal, maxVal] = newRange;
    const defaultMin = filters.minPrice;
    const defaultMax = filters.maxPrice;

    if (minVal !== defaultMin) url.searchParams.set("min", minVal);
    else url.searchParams.delete("min");

    if (maxVal !== defaultMax) url.searchParams.set("max", maxVal);
    else url.searchParams.delete("max");

    router.push(url.pathname + "?" + url.searchParams.toString());
    setPendingUpdate(null);
  }, [pendingUpdate, router, filters.minPrice, filters.maxPrice]);

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
    // Remove "New Arrivals"
    .filter((cat) => !["New Arrivals"].includes(cat.name))
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

  const handleReset = () => {
    setFormState({});
    setFilterOpen(false);
    setRange([filters.minPrice, filters.maxPrice]);
    const url = new URL(window.location.href);
    url.search = "";
    router.push(url.pathname);
  };

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
              .filter(([parentName, subcategories]) => {
                const parentSlug = subcategories[0]?.parent?.slug;
                const activeParent = pathname.split("/")[2];
                // if pathname parent exists, only show that parent; else show all
                return !activeParent || parentSlug === activeParent;
              })
              .map(([parentName, subcategories]) => {
                const parentSlug = subcategories[0]?.parent?.slug;

                return (
                  <Accordion
                    key={parentName}
                    type="single"
                    defaultValue={
                      pathname.split("/")[2] === parentSlug ? parentName : null
                    }
                    collapsible
                  >
                    <AccordionItem value={parentName}>
                      {/* PARENT CATEGORY LINK */}
                      <AccordionTrigger className="py-1">
                        <Link
                          href={`/category/${parentSlug}`}
                          className={`text-sm hover:text-primary transition ${
                            pathname.split("/")[2] &&
                            pathname.split("/")[2] === parentSlug
                              ? "underline font-bold"
                              : "font-medium"
                          }`}
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
                              className={`block text-sm hover:text-primary transition ${
                                pathname.split("/")[3] &&
                                pathname.split("/")[3] === cat.slug
                                  ? "font-bold"
                                  : "text-muted-foreground"
                              }`}
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
        <AccordionItem value="color">
          <AccordionTrigger className="px-4">Color</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 pt-3 px-4">
            {filters.colors?.map((color) => (
              <Tooltip key={color._id}>
                <TooltipTrigger asChild>
                  <label
                    className={`size-6 rounded-full border-2 cursor-pointer relative ${formState.color?.includes(color.name) ? "ring-2 ring-offset-1 ring-primary" : "ring-transparent"}`}
                    style={{
                      backgroundColor: color.hex,
                    }}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formState.color?.includes(color.name) || false}
                      onChange={(e) =>
                        handleChange("color", color.name, e.target.checked)
                      }
                    />
                  </label>
                </TooltipTrigger>
                <TooltipContent>{color.name}</TooltipContent>
              </Tooltip>
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
                  id={mat.name}
                  checked={formState.material?.includes(mat.name) || false}
                  onCheckedChange={(checked) =>
                    handleChange("material", mat.name, checked)
                  }
                />
                <Label htmlFor={mat.name} className="text-sm">
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

      <div className="px-4 space-y-3 border-t py-4 md:pb-0 sticky md:block md:bottom-auto bottom-0 bg-background md:bg-transparent shadow-[0_-4px_6px_-1px_rgba(0_0_0/0.1)] md:shadow-none rounded-t-2xl md:rounded-none">
        {!desktop && (
          <Button
            type="submit"
            variant="default"
            className="w-full"
            onClick={() => setFilterOpen(false)}
          >
            Apply Filters
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="w-full"
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
