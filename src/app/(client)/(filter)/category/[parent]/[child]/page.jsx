import Filters from "@/components/filters/Filters";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export async function generateMetadata({ params }) {
  const { parent, child } = await params;

  // Format both parent and child for better display
  const formattedParent = parent
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const formattedChild = child
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${formattedChild} | ${formattedParent} | Cartzi Shop`,
    description: `Explore the best ${formattedChild} in our ${formattedParent} collection at Cartzi. Find quality, comfort, and style in every piece.`,
  };
}

export default async function CategoryChildPage({ params, searchParams }) {
  const { parent, child } = await params;
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

  const formattedParent = parent.replace(/-/g, " ");
  const formattedChild = child.replace(/-/g, " ");

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold capitalize">{formattedChild}</h1>
      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${parent}`} className="capitalize">
              {formattedParent}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {formattedChild}
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
