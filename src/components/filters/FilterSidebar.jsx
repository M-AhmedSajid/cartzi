"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { FiFilter as Filter } from "react-icons/fi";
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
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export default function FilterSidebar({ filters, filtersData, searchParams }) {
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
            className="w-[85%] sm:w-100 overflow-y-auto gap-0"
          >
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterContent
              filters={filters}
              filtersData={filtersData}
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
          filtersData={filtersData}
          searchParams={searchParams}
          desktop={true}
          setFilterOpen={setFilterOpen}
        />
      </div>
    </>
  );
}

function FilterContent({ filters, filtersData, desktop, setFilterOpen }) {
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
    Number(params.get("min")) || filtersData.minPrice,
    Number(params.get("max")) || filtersData.maxPrice,
  ]);

  const updateSearchParams = (newState, newRange = range) => {
    const url = new URL(window.location.href);

    // Handle checkboxes and lists
    Object.entries(newState).forEach(([key, values]) => {
      if (!values || values.length === 0) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, values.join(","));
      }
    });

    url.searchParams.set("page", "1");

    // Handle min/max only if changed from defaults
    const [minVal, maxVal] = newRange;

    if (minVal !== filtersData.minPrice) {
      url.searchParams.set("min", String(minVal));
    } else {
      url.searchParams.delete("min");
    }

    if (maxVal !== filtersData.maxPrice) {
      url.searchParams.set("max", String(maxVal));
    } else {
      url.searchParams.delete("max");
    }

    router.push(`${url.pathname}?${url.searchParams.toString()}`);
  };

  // Checkbox/option changes
  const handleChange = (name, value, checked) => {
    const currentList = new Set(formState[name] || []);
    if (checked) currentList.add(value);
    else currentList.delete(value);

    const updatedState = { ...formState, [name]: [...currentList] };

    setFormState(updatedState);

    if (desktop) {
      updateSearchParams(updatedState);
    }
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

  const groupedCategories = filtersData?.categories
    // Remove "New Arrivals"
    .filter((cat) => !["New Arrivals"].includes(cat.name))
    // Remove parent categories (those that appear as a parent for others)
    .filter(
      (cat) => !filtersData.categories.some((c) => c.parent?._id === cat._id),
    )
    // Remove categories that don't have a parent (prevents "Others")
    .filter((cat) => cat.parent?.name)
    // Group remaining ones by their parent name or "Others"
    .reduce((acc, cat) => {
      const parentName = cat.parent?.name;
      if (!acc[parentName]) acc[parentName] = [];
      acc[parentName].push(cat);
      return acc;
    }, {});

  const groupedCategoriesOrdered = Object.fromEntries(
    Object.entries(groupedCategories).sort(([a], [b]) => {
      if (a === "Accessories") return -1;
      if (b === "Accessories") return 1;
      return a.localeCompare(b);
    }),
  );

  const handleReset = () => {
    setFormState({});
    setFilterOpen(false);
    setRange([filtersData.minPrice, filtersData.maxPrice]);
    const url = new URL(window.location.href);
    url.search = "";
    router.push(url.pathname);
  };

  useEffect(() => {
    const obj = {};

    for (const [key, val] of params.entries()) {
      obj[key] = val.split(",");
    }

    setFormState(obj);

    setRange([
      Number(params.get("min")) || filtersData.minPrice,
      Number(params.get("max")) || filtersData.maxPrice,
    ]);
  }, [params, filtersData.minPrice, filtersData.maxPrice]);

  return (
    <form onSubmit={desktop ? (e) => e.preventDefault() : handleSubmit}>
      {desktop && <h2 className="text-lg font-semibold px-4">Filters</h2>}

      <Accordion type="multiple" defaultValue={["category", "price", "stock"]}>
        {/* CATEGORY */}
        <AccordionItem value="category" className="px-4">
          <AccordionTrigger>Category</AccordionTrigger>

          <AccordionContent>
            <Accordion type="multiple" className="space-y-2">
              {Object.entries(groupedCategoriesOrdered)
                .reverse()
                .map(([parent, categories]) => (
                  <AccordionItem key={parent} value={parent}>
                    <AccordionTrigger className="text-sm font-medium py-2">
                      {parent}
                    </AccordionTrigger>

                    <AccordionContent className="space-y-2 pl-3">
                      {categories.map((category) => (
                        <div
                          key={category._id}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={`category-${parent + "-" + category.slug}`}
                            checked={
                              formState.category?.includes(
                                parent + "-" + category.slug,
                              ) || false
                            }
                            onCheckedChange={(checked) =>
                              handleChange(
                                "category",
                                parent + "-" + category.slug,
                                checked,
                              )
                            }
                          />

                          <Label
                            htmlFor={`category-${parent + "-" + category.slug}`}
                            className="cursor-pointer flex-1"
                          >
                            {category.name}
                            <span className="text-muted-foreground">
                              ({category.count})
                            </span>
                          </Label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
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
                  min={filtersData.minPrice}
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
                  max={filtersData.maxPrice}
                  value={range[1]}
                  onChange={(e) =>
                    handlePriceChange([range[0], Number(e.target.value)])
                  }
                />
              </div>
            </div>
            <Slider
              min={filtersData.minPrice}
              max={filtersData.maxPrice}
              step={10}
              value={range}
              onValueChange={setRange}
              onValueCommit={(val) => {
                if (desktop) updateSearchParams(formState, val);
              }}
            />
            <p className="text-sm text-muted-foreground">
              ${range[0]} — ${range[1]}
            </p>
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

        {/* SIZE */}
        <AccordionItem value="size" className="px-4">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2">
            {filtersData?.sizes?.map(
              (size) =>
                size && (
                  <div key={size.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={size.name}
                      checked={formState.size?.includes(size.name) || false}
                      onCheckedChange={(checked) =>
                        handleChange("size", size.name, checked)
                      }
                    />
                    <Label htmlFor={size.name} className="text-sm">
                      {size.name}
                      <span className="text-muted-foreground">
                        ({size.count})
                      </span>
                    </Label>
                  </div>
                ),
            )}
          </AccordionContent>
        </AccordionItem>

        {/* COLOR */}
        <AccordionItem value="color">
          <AccordionTrigger className="px-4">Color</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 pt-3 px-4">
            {filtersData.colors?.map((color) => (
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
                <TooltipContent>
                  {color.name} ({color.count})
                </TooltipContent>
              </Tooltip>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* MATERIAL */}
        <AccordionItem value="material" className="px-4">
          <AccordionTrigger>Material</AccordionTrigger>
          <AccordionContent className="space-y-2 max-h-60 overflow-x-auto">
            {filtersData.materials?.map((mat) => (
              <div key={mat._id} className="flex items-center space-x-2">
                <Checkbox
                  id={mat.name}
                  checked={formState.material?.includes(mat.name) || false}
                  onCheckedChange={(checked) =>
                    handleChange("material", mat.name, checked)
                  }
                />
                <Label htmlFor={mat.name} className="text-sm">
                  {mat.name} ({mat.count})
                </Label>
              </div>
            ))}
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
