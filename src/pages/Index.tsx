import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import DashboardPreview from "@/components/sections/DashboardPreview";
import RecommendationsSection from "@/components/sections/RecommendationsSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DashboardPreview />
        <RecommendationsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
