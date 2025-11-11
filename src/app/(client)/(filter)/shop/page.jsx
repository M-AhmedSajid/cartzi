import Filters from "@/components/filters/Filters";

export const metadata = {
  title: "Shop the Latest Clothing & Accessories | Cartzi",
  description:
    "Discover trendy clothing and accessories for men, women, and kids at Cartzi. Explore high-quality styles, affordable prices, and fast delivery. Shop now and refresh your wardrobe today!",
  keywords: [
    "clothing store",
    "online fashion shop",
    "affordable outfits",
    "trendy accessories",
    "men's fashion",
    "women's fashion",
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
        Shop
      </h1>
      <Filters
        searchParams={searchParams}
        appliedFilters={appliedFilters}
        range={range}
      />
    </div>
  );
}
