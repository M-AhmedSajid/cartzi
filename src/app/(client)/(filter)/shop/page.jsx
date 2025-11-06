import Filters from "@/components/filters/Filters";

export default async function ShopPage({ searchParams }) {
  const awaitedSearchParams = await searchParams;
  const appliedFilters = {
    color: awaitedSearchParams?.color?.split(",") || [],
    size: awaitedSearchParams?.size?.split(",") || [],
    material: awaitedSearchParams?.material?.split(",") || [],
  };
  const range = [
    Number(awaitedSearchParams?.min),
    Number(awaitedSearchParams?.max),
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <Filters
        searchParams={searchParams}
        appliedFilters={appliedFilters}
        range={range}
      />
    </div>
  );
}
