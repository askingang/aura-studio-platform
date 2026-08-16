import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, ServicesSection, PromotionsSection } from "@/components/site/sections";
import { useLang } from "@/lib/salon/i18n";
import { useContent } from "@/lib/salon/store";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Hair, Nails, Facial & Spa | Maison Lunaire" },
      {
        name: "description",
        content:
          "Browse every treatment: signature haircuts, balayage, manicures, facials, massages and beauty rituals with transparent pricing.",
      },
      { property: "og:title", content: "Services | Maison Lunaire" },
      { property: "og:description", content: "Every treatment, duration and price in one place." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useLang();
  const { content } = useContent();
  return (
    <>
      <PageHeader
        eyebrow={t("section.services")}
        title={t("section.servicesTitle")}
        image={content.profile.coverImage}
      />
      <ServicesSection />
      <PromotionsSection />
    </>
  );
}
