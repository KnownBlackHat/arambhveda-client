import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { TopCollegesSection } from "@/components/home/TopCollegesSection";
import { CompareSection } from "@/components/home/CompareSection";
import { ExamsSection } from "@/components/home/ExamsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategorySection />
      <TopCollegesSection />
      <CompareSection />
      <ExamsSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
