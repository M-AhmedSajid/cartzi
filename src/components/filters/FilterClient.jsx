"use client";
import FilterSidebar from "./FilterSidebar";
import { FilterPagination } from "./FilterPagination";
import ProductGrid from "./ProductGrid";
import { SortSelect } from "./SortSelect";
import { ActiveFilterChips } from "./Chips";

const FilterClient = ({ filters, searchParams, data, filtersData }) => {
  const currentPage = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;

  return (
    <>
      <FilterSidebar
        filters={filters}
        searchParams={searchParams}
        filtersData={filtersData}
        products={data.products}
      />
      <div className="col-span-full md:col-span-3">
        <SortSelect products={data} />
        <ActiveFilterChips minPriceData={filtersData.minPrice} maxPriceData={filtersData.maxPrice} />
        <div className="pt-4 md:pl-4">
          <ProductGrid products={data.products} />
        </div>
        <FilterPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
};

export default FilterClient;
