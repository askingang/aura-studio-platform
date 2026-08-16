import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
  QuickInfo,
  AboutSection,
  ServicesSection,
  PackagesSection,
  SpaSection,
  TeamSection,
  GallerySection,
  TestimonialsSection,
  PromotionsSection,
  LocationSection,
} from "@/components/site/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Lunaire — Premium Salon & Spa in Jakarta" },
      {
        name: "description",
        content:
          "Hair, nails, facial and spa rituals in Kebayoran Baru. Book your appointment on WhatsApp in under a minute.",
      },
      { property: "og:title", content: "Maison Lunaire — Premium Salon & Spa" },
      {
        property: "og:description",
        content: "Premium beauty and wellness treatments designed to make you feel your best.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <QuickInfo />
      <AboutSection />
      <ServicesSection limit={6} />
      <PackagesSection limit={3} />
      <SpaSection />
      <TeamSection limit={4} />
      <GallerySection limit={8} />
      <TestimonialsSection />
      <PromotionsSection />
      <LocationSection />
    </>
  );
}
