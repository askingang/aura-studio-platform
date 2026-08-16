import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PromotionsSection, PackagesSection } from "@/components/site/sections";
import { useLang } from "@/lib/salon/i18n";

export const Route = createFileRoute("/promotions")({
  head: () => ({
    meta: [
      { title: "Offers & Promotions | Maison Lunaire" },
      {
        name: "description",
        content:
          "Current offers: new client discounts, weekday spa packages and seasonal promotions at Maison Lunaire Jakarta.",
      },
      { property: "og:title", content: "Offers & Promotions | Maison Lunaire" },
      { property: "og:description", content: "Limited-time treatment offers." },
    ],
  }),
  component: PromotionsPage,
});

function PromotionsPage() {
  const { t } = useLang();
  return (
    <>
      <PageHeader eyebrow={t("section.promotions")} title={t("section.promotions")} />
      <PromotionsSection />
      <PackagesSection limit={3} />
    </>
  );
}
