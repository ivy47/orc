import ClientSection from "@orc/web/components/landing/client-section";
import CallToActionSection from "@orc/web/components/landing/cta-section";
import HeroSection from "@orc/web/components/landing/hero-section";
import PricingSection from "@orc/web/components/landing/pricing-section";
import Particles from "@orc/web/ui/magicui/ui/particles";
import { SphereMask } from "@orc/web/ui/magicui/ui/sphere-mask";

export default async function Page() {
  return (
    <>
      <HeroSection />
      <ClientSection />
      <SphereMask />
      <PricingSection />
      <CallToActionSection />
      <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        ease={70}
        size={0.05}
        staticity={40}
        color={"#ffffff"}
      />
    </>
  );
}
