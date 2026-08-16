import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PackagesSection, TestimonialsSection } from "@/components/site/sections";
import { useLang } from "@/lib/salon/i18n";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Packages & Rituals | Maison Lunaire" },
      {
        name: "description",
        content:
          "Curated salon and spa packages: Signature Glow, Relaxation Ritual and Bridal Beauty. Book a full ritual on WhatsApp.",
      },
      { property: "og:title", content: "Packages & Rituals | Maison Lunaire" },
      { property: "og:description", content: "Multi-treatment packages at a considered price." },
    ],
  }),
  component: PackagesPage,
});

function PackagesPage() {
  const { t } = useLang();
  return (
    <>
      <PageHeader eyebrow={t("section.packages")} title={t("section.packagesTitle")} />
      <PackagesSection />
      <TestimonialsSection />
    </>
  );
}
