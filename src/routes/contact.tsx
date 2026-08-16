import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, ContactSection, LocationSection } from "@/components/site/sections";
import { useLang } from "@/lib/salon/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Booking | Maison Lunaire" },
      {
        name: "description",
        content:
          "WhatsApp, call or email Maison Lunaire to book a hair, nail, facial or spa appointment in Jakarta Selatan.",
      },
      { property: "og:title", content: "Contact | Maison Lunaire" },
      { property: "og:description", content: "Reach the studio in one tap." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLang();
  return (
    <>
      <PageHeader eyebrow={t("section.contact")} title={t("info.contact")} />
      <ContactSection />
      <LocationSection />
    </>
  );
}
