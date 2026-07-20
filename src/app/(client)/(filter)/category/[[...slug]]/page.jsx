import { CategoryPills } from "@/components/filters/CategoryPills";
import FilterClient from "@/components/filters/FilterClient";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { parseSearchParams } from "@/lib/products";
import { getFiltersData, getProducts } from "@/sanity/helpers/filters";
import { notFound } from "next/navigation";

// Helper to format slugs for titles/breadcrumbs
const formatSlug = (str = "") =>
  str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return { title: "Categories | Cartzi Shop" };
  }

  const [parent, child] = slug;
  const formattedParent = formatSlug(parent);

  if (child) {
    const formattedChild = formatSlug(child);
    return {
      title: `${formattedChild} | ${formattedParent} | Cartzi Shop`,
      description: `Explore the best ${formattedChild} in our ${formattedParent} collection at Cartzi.`,
    };
  }

  return {
    title: `${formattedParent} | Cartzi Shop`,
    description: `Discover the best ${formattedParent} in our Cartzi store.`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;

  // 1. Guard clause: Ensure we have at least a parent slug
  if (!slug || slug.length === 0) {
    notFound();
  }

  const [parent, child] = slug;
  const filters = parseSearchParams(await searchParams);

  // 2. Set category filter according to your Sanity query pattern
  filters.category = [child ? `${parent}-${child}` : `${parent}`];

  const data = await getProducts(filters);
  const filtersData = await getFiltersData();

  const formattedParent = formatSlug(parent);
  const formattedChild = child ? formatSlug(child) : null;
  const pageTitle = formattedChild || formattedParent;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Dynamic Breadcrumbs */}
      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          {child ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/category/${parent}`}
                  className="capitalize"
                >
                  {formattedParent}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {formattedChild}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {formattedParent}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold capitalize mt-4">{pageTitle}</h1>

      {/* Category Pills handle sub-categories */}
      <CategoryPills
        parent={parent}
        filtersData={filtersData}
        currentSlug={child || parent}
      />

      <FilterClient
        searchParams={searchParams}
        data={data}
        filtersData={filtersData}
        disabledFilters={["category"]}
      />
    </div>
  );
}
