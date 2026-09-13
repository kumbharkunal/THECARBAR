import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { ActOne } from "@/components/narrative/ActOne";
import { ActTwo } from "@/components/narrative/ActTwo";
import { HowItWorks } from "@/components/process/HowItWorks";
import { WhyCarBar } from "@/components/why/WhyCarBar";
import { AvailableCars } from "@/components/cars/AvailableCars";
import { InstagramReels } from "@/components/reels/InstagramReels";
import { Testimonials } from "@/components/social/Testimonials";
import { CustomerStories } from "@/components/social/CustomerStories";
import { Transparency } from "@/components/trust/Transparency";
import { FinalCta } from "@/components/cta/FinalCta";
import { MotionBoot } from "@/components/ui/MotionBoot";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-green focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <MotionBoot />
      <Header />

      <main id="main">
        {/* I want a car → they say wait → look wider → the network → the process */}
        <Hero />
        <ActOne />
        <ActTwo />
        <HowItWorks />
        <WhyCarBar />

        {/* Proof, then trust, then the one action. */}
        <AvailableCars />
        <InstagramReels />
        <Testimonials />
        <CustomerStories />
        <Transparency />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
