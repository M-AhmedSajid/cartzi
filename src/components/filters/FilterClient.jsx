"use client";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const FilterClient = ({ filters, searchParams, products }) => {
  const router = useRouter();
  const params = useSearchParams();
  const sort = params.get("sort");
  return (
    <>
      <FilterSidebar filters={filters} searchParams={searchParams} />
      <div className="col-span-full md:col-span-3">
        <div className="flex items-center justify-between p-5 text-center w-full border border-l-0 bg-card rounded-r-lg">
          <p className="text-base font-medium">
            {products?.length} Product{products?.length !== 1 && "s"}
          </p>
          <Select
            name="sort"
            value={sort || "newest"}
            onValueChange={(value) => {
              const currentParams = Object.fromEntries([...params.entries()]);
              currentParams.sort = value;
              const queryString = new URLSearchParams(currentParams).toString();
              router.push(`?${queryString}`);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="p-3">
          <ProductGrid products={products} />
        </div>
      </div>
    </>
  );
};

export default FilterClient;
