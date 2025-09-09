import CategoriesGrid from "@/components/home/CategoriesGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSection from "@/components/home/HeroSection";
import PromoSection from "@/components/home/PromoSection";
import TrustSection from "@/components/home/TrustSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <div className="max-w-screen-xl mx-auto px-4 py-20 space-y-20">
        <div className="flex flex-col lg:flex-col-reverse gap-20">
          <CategoriesGrid />
          <FeaturedProducts />
        </div>
        <TrustSection />
      </div>
      <PromoSection />
    </main>
  );
}
