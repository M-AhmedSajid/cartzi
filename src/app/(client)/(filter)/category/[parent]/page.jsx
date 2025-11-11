import Filters from "@/components/filters/Filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export async function generateMetadata({ params }) {
  const { parent } = await params;
  const formattedParent =
    parent.charAt(0).toUpperCase() + parent.slice(1).replace(/-/g, " ");
  return {
    title: `${formattedParent} | Cartzi Shop`,
    description: `Discover the best ${formattedParent} in our Cartzi store.`,
  };
}

export default async function CategoryParentPage({ params, searchParams }) {
  const { parent } = await params;

  const awaitedSearchParams = await searchParams;
  const appliedFilters = {
    color: awaitedSearchParams?.color?.split(",") || [],
    size: awaitedSearchParams?.size?.split(",") || [],
    material: awaitedSearchParams?.material?.split(",") || [],
    stock: awaitedSearchParams?.stock || null,
    discount: awaitedSearchParams?.discount || null,
    sort: awaitedSearchParams?.sort || null,
  };
  const range = [
    Number(awaitedSearchParams?.min),
    Number(awaitedSearchParams?.max),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold capitalize">
        {parent.replace(/-/g, " ")}
      </h1>
      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {parent.replace(/-/g, " ")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Filters
        searchParams={searchParams}
        appliedFilters={appliedFilters}
        range={range}
      />
    </div>
  );
}
