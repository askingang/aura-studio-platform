import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useContent } from "@/lib/salon/store";
import { useLang } from "@/lib/salon/i18n";
import { useBooking } from "@/lib/salon/booking";
import type { Lang } from "@/lib/salon/types";
import { cn } from "@/lib/utils";

const LANGS: { id: Lang; label: string }[] = [
  { id: "id", label: "ID" },
  { id: "en", label: "EN" },
  { id: "zh", label: "中文" },
];

export function SiteHeader() {
  const { content } = useContent();
  const { t, lang, setLang } = useLang();
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  const links = [
    { to: "/services", label: t("nav.services") },
    { to: "/packages", label: t("nav.packages") },
    { to: "/spa", label: t("nav.spa") },
    { to: "/team", label: t("nav.team") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const transparent = onHome && !scrolled && !menu;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent py-5"
          : "border-b border-border/60 bg-background/90 py-3 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          to="/"
          className={cn(
            "font-display text-lg tracking-[0.28em] transition-colors",
            transparent ? "text-white" : "text-foreground",
          )}
        >
          {content.profile.logoText}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "text-[0.7rem] uppercase tracking-[0.16em] transition-opacity hover:opacity-60",
                transparent ? "text-white/90" : "text-foreground/80",
              )}
              activeProps={{ className: "opacity-100 font-medium" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "hidden items-center gap-1 text-[0.65rem] tracking-[0.12em] sm:flex",
              transparent ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={cn(
                  "px-1.5 py-1 transition-opacity hover:opacity-100",
                  lang === l.id
                    ? cn("opacity-100 underline underline-offset-4", transparent && "text-white")
                    : "opacity-55",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => openBooking()}
            className={cn(
              "btn-base hidden px-5 py-2.5 sm:inline-flex",
              transparent ? "btn-ghost-light" : "btn-solid",
            )}
          >
            {t("cta.book")}
          </button>

          <button
            aria-label="Menu"
            onClick={() => setMenu((v) => !v)}
            className={cn("p-1.5 lg:hidden", transparent ? "text-white" : "text-foreground")}
          >
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menu && (
        <div className="border-t border-border bg-background px-5 py-6 lg:hidden">
          <nav className="grid gap-1">
            {[{ to: "/", label: t("nav.home") }, ...links].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="border-b border-border/50 py-3 font-display text-2xl text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex items-center gap-2">
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 text-xs tracking-widest",
                  lang === l.id && "bg-foreground text-background",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button onClick={() => openBooking()} className="btn-base btn-solid mt-5 w-full">
            {t("cta.bookAppointment")}
          </button>
        </div>
      )}
    </header>
  );
}
