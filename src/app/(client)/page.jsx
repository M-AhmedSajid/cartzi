import CategoriesGrid from "@/components/home/CategoriesGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSection from "@/components/home/HeroSection";
import PromoSection from "@/components/home/PromoSection";
import TrustSection from "@/components/home/TrustSection";

export default function Home() {
  return (
    <main className="pb-8">
      <HeroSection />
      <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col lg:flex-col-reverse gap-6">
          <CategoriesGrid />
          <FeaturedProducts />
        </div>
        <TrustSection />
      </div>
      <PromoSection />
    </main>
  );
}
