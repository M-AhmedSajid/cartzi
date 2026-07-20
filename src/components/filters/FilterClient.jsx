"use client";
import FilterSidebar from "./FilterSidebar";
import { FilterPagination } from "./FilterPagination";
import ProductGrid from "./ProductGrid";
import { SortSelect } from "./SortSelect";
import { ActiveFilterChips } from "./Chips";

const FilterClient = ({ searchParams, data, filtersData, disabledFilters }) => {
  const currentPage = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 mt-6">
      <FilterSidebar
        searchParams={searchParams}
        filtersData={filtersData}
        products={data.products}
        disabledFilters={disabledFilters}
      />
      <div className="col-span-full md:col-span-3">
        <SortSelect products={data} />
        <ActiveFilterChips minPriceData={filtersData.minPrice} maxPriceData={filtersData.maxPrice} />
        <div className="pt-4 md:pl-4">
          <ProductGrid products={data.products} />
        </div>
        <FilterPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default FilterClient;
