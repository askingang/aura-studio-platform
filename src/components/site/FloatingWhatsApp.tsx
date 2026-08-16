import { MessageCircle } from "lucide-react";
import { useContent } from "@/lib/salon/store";
import { useLang } from "@/lib/salon/i18n";
import { useBooking } from "@/lib/salon/booking";

export function FloatingWhatsApp() {
  const { content } = useContent();
  const { t } = useLang();
  const { openBooking } = useBooking();
  const number = content.profile.whatsapp.replace(/\D/g, "");

  return (
    <>
      <a
        href={`https://wa.me/${number}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="WhatsApp"
        className="fixed bottom-24 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6 sm:size-14"
      >
        <MessageCircle className="size-6" />
      </a>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-xl sm:hidden">
        <button onClick={() => openBooking()} className="btn-base btn-solid w-full py-3.5">
          {t("cta.bookAppointment")}
        </button>
      </div>
    </>
  );
}
