import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Music2 } from "lucide-react";
import { useContent } from "@/lib/salon/store";
import { useLang } from "@/lib/salon/i18n";
import { formatDay } from "@/lib/salon/hours";
import { tr } from "@/lib/salon/types";

export function SiteFooter() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const p = content.profile;

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-4 md:py-20">
        <div className="md:col-span-2">
          <p className="font-display text-xl tracking-[0.28em]">{p.logoText}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {tr(p.tagline, lang)} — {p.address}, {p.city}
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: p.instagram, Icon: Instagram },
              { href: p.facebook, Icon: Facebook },
              { href: p.tiktok, Icon: Music2 },
            ]
              .filter((s) => s.href)
              .map(({ href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-foreground hover:text-background"
                >
                  <Icon className="size-4" />
                </a>
              ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">{t("footer.explore")}</p>
          <nav className="mt-4 grid gap-2 text-sm">
            {[
              { to: "/services", label: t("nav.services") },
              { to: "/packages", label: t("nav.packages") },
              { to: "/spa", label: t("nav.spa") },
              { to: "/team", label: t("nav.team") },
              { to: "/gallery", label: t("nav.gallery") },
              { to: "/promotions", label: t("nav.promotions") },
              { to: "/location", label: t("info.location") },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-muted-foreground hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="eyebrow">{t("info.hours")}</p>
          <ul className="mt-4 grid gap-1.5 text-sm text-muted-foreground">
            {[1, 2, 3, 4, 5, 6, 0].map((i) => (
              <li key={i} className="flex justify-between gap-4">
                <span>{t(`day.${i}` as "day.0")}</span>
                <span className="tabular-nums">{formatDay(content.hours.days[i]!)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {p.name}. {t("footer.rights")}
          </p>
          <Link to="/admin" className="hover:text-foreground">
            Admin Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
