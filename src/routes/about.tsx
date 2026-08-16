import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, AboutSection, TeamSection, TestimonialsSection } from "@/components/site/sections";
import { useLang } from "@/lib/salon/i18n";
import { useContent } from "@/lib/salon/store";
import { tr } from "@/lib/salon/types";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Where Beauty Meets Wellbeing | Maison Lunaire" },
      {
        name: "description",
        content:
          "Founded in 2016, Maison Lunaire is a calm Jakarta studio where modern beauty treatments meet genuine relaxation.",
      },
      { property: "og:title", content: "About | Maison Lunaire" },
      { property: "og:description", content: "Our story, our philosophy and the people behind it." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t, lang } = useLang();
  const { content } = useContent();
  return (
    <>
      <PageHeader eyebrow={t("section.about")} title={tr(content.profile.aboutTitle, lang)} />
      <AboutSection full />
      <TeamSection limit={4} />
      <TestimonialsSection />
    </>
  );
}
