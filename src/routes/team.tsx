import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, TeamSection } from "@/components/site/sections";
import { useLang } from "@/lib/salon/i18n";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Meet Our Experts — Stylists & Therapists | Maison Lunaire" },
      {
        name: "description",
        content:
          "Our stylists, skin therapists and spa specialists — their specialties, experience and availability. Book directly with your favourite.",
      },
      { property: "og:title", content: "Meet Our Experts | Maison Lunaire" },
      { property: "og:description", content: "The people behind every treatment." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const { t } = useLang();
  return (
    <>
      <PageHeader eyebrow={t("section.team")} title={t("section.teamTitle")} />
      <TeamSection detailed />
    </>
  );
}
