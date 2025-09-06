import FeaturedProducts from "@/components/FeaturedProducts";
import Container from "@/components/layout/Container";
import HeroSection from "@/components/layout/HeroSection";
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
