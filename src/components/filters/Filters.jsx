import React from "react";
import { getFilteredProducts, getFiltersData } from "@/sanity/helpers/filters";
import FilterClient from "./FilterClient";

const Filters = async ({ searchParams, appliedFilters, range }) => {
  const filters = await getFiltersData();

  const products = await getFilteredProducts(appliedFilters, range);
  console.log(products);
  

  return (
    <div className="py-10 grid grid-cols-1 md:grid-cols-4">
      <FilterClient
        filters={filters}
        searchParams={searchParams}
        products={products}
      />
    </div>
  );
};

export default Filters;
