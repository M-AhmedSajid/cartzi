import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSection from "@/components/home/HeroSection";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Container className="space-y-10 py-10">
        {/* <ProductGrid /> */}
        <FeaturedProducts />
      </Container>
    </main>
  );
}
