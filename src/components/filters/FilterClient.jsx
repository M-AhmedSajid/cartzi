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

const FilterClient = ({ filters, searchParams, products }) => {
  return (
    <>
      <FilterSidebar filters={filters} searchParams={searchParams} />
      <div className="col-span-full md:col-span-3">
        <div className="flex items-center justify-between p-5 text-center w-full border border-l-0 bg-card rounded-r-lg">
          <p className="text-lg font-medium">0 Products</p>
          <Select name="sort" defaultValue="featured">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="bestseller">Best Selling</SelectItem>
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
