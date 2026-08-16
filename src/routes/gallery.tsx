import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, GallerySection } from "@/components/site/sections";
import { useLang } from "@/lib/salon/i18n";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Studio, Team & Results | Maison Lunaire" },
      {
        name: "description",
        content:
          "A visual look inside the studio: interiors, hair colour, nails, facials, spa suites and finished results.",
      },
      { property: "og:title", content: "Gallery | Maison Lunaire" },
      { property: "og:description", content: "Inside the studio, treatment by treatment." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { t } = useLang();
  return (
    <>
      <PageHeader eyebrow={t("section.gallery")} title={t("section.gallery")} />
      <GallerySection />
    </>
  );
}
