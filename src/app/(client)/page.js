import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <main>
        <HomeBanner />
      <Container className="space-y-10 py-10">
        <ProductGrid />
      </Container>
    </main>
  );
}
