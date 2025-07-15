import Header from "@/components/header";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Features from "@/components/features";
import TestimonialSection from "@/components/testimonial";
import FaqSection from "@/components/faq";
import PricingSection from "@/components/pricing";
import FinalCtaSection from "@/components/finalCTA";


export default function Home() {
  return (

    <>
      <Header />
      <Hero />
      <Features/>
      <TestimonialSection />
      <FaqSection />
      <PricingSection />
      <FinalCtaSection />
      <Footer />
    </>
  );
}
