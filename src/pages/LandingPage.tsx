import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { ProblemsSection } from "@/components/landing/ProblemsSection";
import { PatientFeatures } from "@/components/landing/PatientFeatures";
import { StaffFeatures } from "@/components/landing/StaffFeatures";
import { AiSpotlight } from "@/components/landing/AiSpotlight";
import { SecurityStrip } from "@/components/landing/SecurityStrip";
import { QuoteSection } from "@/components/landing/QuoteSection";
import { TeamSection } from "@/components/landing/TeamSection";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <ProblemsSection />
        <PatientFeatures />
        <StaffFeatures />
        <AiSpotlight />
        <SecurityStrip />
        <QuoteSection />
        <TeamSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
