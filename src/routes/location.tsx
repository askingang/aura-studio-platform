import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, LocationSection, ContactSection } from "@/components/site/sections";
import { useLang } from "@/lib/salon/i18n";

export const Route = createFileRoute("/location")({
  head: () => ({
    meta: [
      { title: "Location & Opening Hours | Maison Lunaire Jakarta" },
      {
        name: "description",
        content:
          "Find us at Jl. Senopati Raya No. 48, Kebayoran Baru, Jakarta Selatan. Map, directions, phone and full opening hours.",
      },
      { property: "og:title", content: "Location | Maison Lunaire" },
      { property: "og:description", content: "Directions, hours and how to reach the studio." },
    ],
  }),
  component: LocationPage,
});

function LocationPage() {
  const { t } = useLang();
  return (
    <>
      <PageHeader eyebrow={t("section.location")} title={t("info.visit")} />
      <LocationSection />
      <ContactSection />
    </>
  );
}
