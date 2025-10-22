import React from "react";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import { getFiltersData } from "@/sanity/helpers/filters";

const Filters = async ({ searchParams }) => {
  const filters = await getFiltersData();  
  return (
    <div className="py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
      <FilterSidebar filters={filters} searchParams={searchParams} />
      <ProductGrid />
    </div>
  );
};

export default Filters;
