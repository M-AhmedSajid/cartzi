import FilterClient from "@/components/filters/FilterClient";
import { parseSearchParams } from "@/lib/products";
import { getFiltersData, getProducts } from "@/sanity/helpers/filters";

export const metadata = {
  title: "Shop the Latest Clothing & Accessories | Cartzi",
  description:
    "Discover trendy clothing and accessories for men, women, and kids at Cartzi. Explore high-quality styles, affordable prices, and fast delivery. Shop now and refresh your wardrobe today!",
  keywords: [
    "clothing store",
    "online fashion shop",
    "affordable outfits",
    "trendy accessories",
    "mens fashion",
    "womens fashion",
    "kids clothing",
    "Cartzi store",
    "online shopping Pakistan",
    "stylish wear",
  ],
  openGraph: {
    title: "Shop the Latest Clothing & Accessories | Cartzi",
    description:
      "Trendy, affordable, and high-quality clothing & accessories for everyone. Shop now at Cartzi!",
    url: "https://cartzi.com/shop",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Shop the Latest Styles at Cartzi",
    description:
      "Discover affordable fashion that fits your vibe. Fast shipping & easy returns.",
  },
};

export default async function ShopPage({ searchParams }) {
  const filters = parseSearchParams(await searchParams);

  const data = await getProducts(filters);
  const filtersData = await getFiltersData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold capitalize">Shop</h1>
      <FilterClient
        filters={filters}
        searchParams={searchParams}
        data={data}
        filtersData={filtersData}
      />
    </div>
  );
}
