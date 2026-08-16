import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SpaSection, GallerySection } from "@/components/site/sections";
import { useLang } from "@/lib/salon/i18n";
import { useContent } from "@/lib/salon/store";

export const Route = createFileRoute("/spa")({
  head: () => ({
    meta: [
      { title: "Spa & Wellness Treatments | Maison Lunaire" },
      {
        name: "description",
        content:
          "Massage, aromatherapy, body scrub, head spa and reflexology in a calm Jakarta studio built for slowing down.",
      },
      { property: "og:title", content: "Spa & Wellness | Maison Lunaire" },
      { property: "og:description", content: "Room to breathe — our spa and wellness rituals." },
    ],
  }),
  component: SpaPage,
});

function SpaPage() {
  const { t } = useLang();
  const { content } = useContent();
  return (
    <>
      <PageHeader
        eyebrow={t("section.spa")}
        title={t("section.spaTitle")}
        image={content.profile.aboutImageSecondary}
      />
      <SpaSection />
      <GallerySection limit={8} />
    </>
  );
}
