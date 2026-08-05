import { HeroSection } from "@/components/landing/HeroSection";
import { ScrollStorySection } from "@/components/landing/ScrollStorySection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection, TrustSection } from "@/components/landing/TrustSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ScrollStorySection />
      <FeaturesSection />
      <HowItWorksSection />
      <TrustSection />
      <Footer />
    </main>
  );
}
