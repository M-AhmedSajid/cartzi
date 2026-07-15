import SectionHeading from "../SectionHeading";
import { getProducts } from "@/sanity/helpers/filters";
import { FeaturedProductsCarousel } from "./FeaturedProductsCarousel";
export default async function FeaturedProducts() {
  const { products } = await getProducts({
    category: "featured",
    limit: 8,
  });  

  return (
    <section>
      <SectionHeading
        title="Hot Right Now"
        txt="Trending looks, dont miss out."
      />
      <FeaturedProductsCarousel products={products} />
    </section>
  );
};
