import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Mail,
  Star,
  X,
  Instagram,
} from "lucide-react";
import { useContent, activeItems, isPromoLive } from "@/lib/salon/store";
import { useLang } from "@/lib/salon/i18n";
import { useBooking } from "@/lib/salon/booking";
import { getOpenStatus, formatDay, formatPrice } from "@/lib/salon/hours";
import { tr, type ServiceCategory } from "@/lib/salon/types";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { to: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          to={action.to}
          className="group inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          {action.label}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}

export function Hero() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { openBooking } = useBooking();
  const status = getOpenStatus(content.hours);
  const p = content.profile;

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-black">
      <img
        src={p.heroImage}
        alt={`${p.name} interior`}
        className="absolute inset-0 size-full object-cover opacity-80"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20">
        <Reveal>
          <p className="text-[0.65rem] uppercase tracking-[0.32em] text-white/70">
            {tr(p.tagline, lang)} · {p.city}
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mt-6 max-w-4xl font-display text-[13vw] leading-[0.92] text-white sm:text-[9vw] lg:text-[7.5rem]">
            {tr(p.heroHeadline, lang)}
          </h1>
        </Reveal>
        <Reveal delay={220}>
          <p className="mt-7 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            {tr(p.heroSubline, lang)}
          </p>
        </Reveal>
        <Reveal delay={320}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openBooking()}
              className="btn-base bg-white text-black hover:bg-white/85"
            >
              {t("cta.bookAppointment")}
            </button>
            <Link to="/services" className="btn-base btn-ghost-light">
              {t("cta.exploreServices")}
            </Link>
            <span className="ml-1 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-white/70">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  status.open ? "bg-emerald-400" : "bg-white/40",
                )}
              />
              {status.open ? t("status.openToday") : t("status.closed")} · {status.todayLabel}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function QuickInfo() {
  const { content } = useContent();
  const { t } = useLang();
  const { openBooking } = useBooking();
  const p = content.profile;
  const status = getOpenStatus(content.hours);

  const cells = [
    {
      label: t("info.hours"),
      value: status.todayLabel,
      sub: (
        <span className="inline-flex items-center gap-1.5">
          <span
            className={cn("size-1.5 rounded-full", status.open ? "bg-emerald-500" : "bg-muted-foreground")}
          />
          {status.open ? t("status.open") : t("status.closed")}
        </span>
      ),
      Icon: Clock,
      href: "/location",
    },
    { label: t("info.location"), value: p.city, sub: p.address, Icon: MapPin, href: "/location" },
    {
      label: t("info.contact"),
      value: "WhatsApp",
      sub: p.phone,
      Icon: MessageCircle,
      external: `https://wa.me/${p.whatsapp.replace(/\D/g, "")}`,
    },
    {
      label: t("info.appointments"),
      value: t("cta.book"),
      sub: t("info.chat"),
      Icon: ArrowUpRight,
      action: () => openBooking(),
    },
  ];

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-border sm:px-0 lg:grid-cols-4">
        {cells.map((c) => {
          const inner = (
            <div className="flex h-full flex-col justify-between gap-6 bg-background p-6 transition-colors group-hover:bg-secondary/50 sm:p-8">
              <div className="flex items-start justify-between">
                <p className="eyebrow">{c.label}</p>
                <c.Icon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-display text-xl sm:text-2xl">{c.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
              </div>
            </div>
          );
          if (c.action)
            return (
              <button key={c.label} onClick={c.action} className="group text-left">
                {inner}
              </button>
            );
          if (c.external)
            return (
              <a key={c.label} href={c.external} target="_blank" rel="noreferrer" className="group">
                {inner}
              </a>
            );
          return (
            <Link key={c.label} to={c.href!} className="group">
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function AboutSection({ full = false }: { full?: boolean }) {
  const { content } = useContent();
  const { t, lang } = useLang();
  const p = content.profile;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className="relative">
          <div className="hover-zoom aspect-[4/5] w-full">
            <img
              src={p.aboutImage}
              alt="Studio interior"
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <div className="absolute -bottom-10 -right-4 hidden w-40 md:block lg:w-52">
            <img src={p.aboutImageSecondary} alt="Treatment detail" loading="lazy" className="w-full object-cover" />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="eyebrow">{t("section.about")}</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
            {tr(p.aboutTitle, lang)}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {tr(p.aboutDescription, lang)}
          </p>
          {full && (
            <>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {tr(p.aboutStory, lang)}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {tr(p.aboutPhilosophy, lang)}
              </p>
            </>
          )}
          <div className="mt-8 flex gap-10 border-t border-border pt-8">
            <div>
              <p className="font-display text-4xl">{p.experienceYears}</p>
              <p className="eyebrow mt-1">{t("label.years")}</p>
            </div>
            <div>
              <p className="font-display text-4xl">{activeItems(content.services).length}</p>
              <p className="eyebrow mt-1">{t("section.services")}</p>
            </div>
            <div>
              <p className="font-display text-4xl">{activeItems(content.employees).length}</p>
              <p className="eyebrow mt-1">{t("section.team")}</p>
            </div>
          </div>
          {!full && (
            <Link to="/about" className="btn-base btn-outline-brand mt-8">
              {t("cta.discoverStory")}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}

const CATS: (ServiceCategory | "all")[] = ["all", "hair", "nails", "facial", "spa", "beauty"];

export function ServicesSection({ limit }: { limit?: number }) {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { openBooking } = useBooking();
  const [cat, setCat] = useState<ServiceCategory | "all">("all");

  const services = useMemo(() => {
    const list = activeItems(content.services);
    const filtered = cat === "all" ? list : list.filter((s) => s.category === cat);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [content.services, cat, limit]);

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading
          eyebrow={t("section.services")}
          title={t("section.servicesTitle")}
          action={limit ? { to: "/services", label: t("cta.viewAll") } : undefined}
        />

        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] transition-colors",
                cat === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/40",
              )}
            >
              {c === "all" ? t("filter.all") : t(`cat.${c}` as "cat.hair")}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 80} as="article" className="group">
              <div className="hover-zoom relative aspect-[4/5] w-full bg-secondary">
                <img
                  src={s.image}
                  alt={tr(s.name, lang)}
                  loading="lazy"
                  className="size-full object-cover"
                />
                {(s.popular || s.featured) && (
                  <span className="absolute left-3 top-3 bg-background/90 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em]">
                    {s.popular ? t("label.popular") : t("label.featured")}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">{t(`cat.${s.category}` as "cat.hair")}</p>
                  <h3 className="mt-1.5 font-display text-2xl leading-tight">{tr(s.name, lang)}</h3>
                </div>
                <div className="text-right">
                  {s.discountPrice ? (
                    <>
                      <p className="text-sm line-through opacity-40">{formatPrice(s.price)}</p>
                      <p className="text-sm font-medium">{formatPrice(s.discountPrice)}</p>
                    </>
                  ) : (
                    <p className="text-sm font-medium">{formatPrice(s.price)}</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {s.duration} {t("label.minutes")}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tr(s.description, lang)}
              </p>
              <button
                onClick={() => openBooking({ serviceId: s.id })}
                className="mt-4 inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-[0.7rem] uppercase tracking-[0.18em] transition-colors hover:border-foreground"
              >
                {t("cta.bookService")}
                <ArrowUpRight className="size-3.5" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PackagesSection({ limit }: { limit?: number }) {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { openBooking } = useBooking();
  const packages = limit ? activeItems(content.packages).slice(0, limit) : activeItems(content.packages);

  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading
          eyebrow={t("section.packages")}
          title={t("section.packagesTitle")}
          action={limit ? { to: "/packages", label: t("cta.viewAll") } : undefined}
        />
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {packages.map((p, i) => (
            <Reveal
              key={p.id}
              delay={i * 90}
              as="article"
              className="w-[85vw] shrink-0 snap-start border border-border bg-background md:w-auto"
            >
              <div className="hover-zoom aspect-[16/10] w-full">
                <img src={p.image} alt={tr(p.name, lang)} loading="lazy" className="size-full object-cover" />
              </div>
              <div className="flex h-[calc(100%-0px)] flex-col p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-3xl">{tr(p.name, lang)}</h3>
                  {p.popular && (
                    <span className="border border-foreground/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.18em]">
                      {t("label.popular")}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {tr(p.description, lang)}
                </p>
                <ul className="mt-6 grid gap-2 border-t border-border pt-6 text-sm">
                  {p.items.map((it, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="size-1 rounded-full bg-accent-brand" />
                      {tr(it, lang)}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-end justify-between">
                  <div>
                    {p.discountPrice && (
                      <p className="text-sm line-through opacity-40">{formatPrice(p.price)}</p>
                    )}
                    <p className="font-display text-3xl">
                      {formatPrice(p.discountPrice ?? p.price)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openBooking({ packageId: p.id })}
                  className="btn-base btn-solid mt-6 w-full"
                >
                  {t("cta.bookPackage")}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SpaSection() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { openBooking } = useBooking();
  const treatments = activeItems(content.treatments);

  return (
    <section className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <Reveal>
            <p className="eyebrow text-primary-foreground/50">{t("section.spa")}</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
              {t("section.spaTitle")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-primary-foreground/70">
              {tr(content.profile.aboutPhilosophy, lang)}
            </p>
          </Reveal>

          <div className="grid gap-px bg-primary-foreground/15">
            {treatments.map((tt, i) => (
              <Reveal key={tt.id} delay={i * 70}>
                <button
                  onClick={() => openBooking()}
                  className="group flex w-full items-center gap-6 bg-primary px-1 py-6 text-left transition-colors hover:bg-primary-foreground/5 sm:px-4"
                >
                  <img
                    src={tt.image}
                    alt={tr(tt.name, lang)}
                    loading="lazy"
                    className="size-20 shrink-0 object-cover sm:size-24"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-2xl">{tr(tt.name, lang)}</h3>
                    <p className="mt-1 truncate text-sm text-primary-foreground/60">
                      {tr(tt.description, lang)}
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-sm">{formatPrice(tt.price)}</p>
                    <p className="text-xs text-primary-foreground/50">
                      {tt.duration} {t("label.minutes")}
                    </p>
                  </div>
                  <ArrowUpRight className="size-5 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TeamSection({ limit, detailed = false }: { limit?: number; detailed?: boolean }) {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { openBooking } = useBooking();
  const list = activeItems(content.employees);
  const employees = limit ? list.slice(0, limit) : list;

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading
          eyebrow={t("section.team")}
          title={t("section.teamTitle")}
          action={limit ? { to: "/team", label: t("cta.viewAll") } : undefined}
        />
        <div className="no-scrollbar mt-12 flex snap-x gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
          {employees.map((e, i) => (
            <Reveal key={e.id} delay={(i % 4) * 80} as="article" className="w-[70vw] shrink-0 snap-start md:w-auto">
              <div className="hover-zoom aspect-[3/4] w-full bg-secondary">
                <img src={e.photo} alt={e.name} loading="lazy" className="size-full object-cover" />
              </div>
              <h3 className="mt-4 font-display text-2xl">{e.name}</h3>
              <p className="eyebrow mt-1">{tr(e.position, lang)}</p>
              <dl className="mt-4 grid gap-1.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{t("label.specialty")}</dt>
                  <dd className="text-right">{tr(e.specialty, lang)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{t("label.experience")}</dt>
                  <dd>
                    {e.experience} {lang === "zh" ? "年" : lang === "id" ? "Tahun" : "Years"}
                  </dd>
                </div>
                {detailed && (
                  <>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{t("label.languages")}</dt>
                      <dd className="text-right">{e.languages.join(", ")}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{t("label.availability")}</dt>
                      <dd>{tr(e.availability, lang)}</dd>
                    </div>
                  </>
                )}
              </dl>
              {detailed && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tr(e.bio, lang)}</p>
              )}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => openBooking({ employeeId: e.id })}
                  className="inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-[0.7rem] uppercase tracking-[0.18em] hover:border-foreground"
                >
                  {t("cta.bookWith")} {e.name.split(" ")[0]}
                </button>
                {e.instagram && (
                  <a href={e.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                    <Instagram className="size-4" />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const GALLERY_CATS = ["all", "salon", "hair", "nails", "facial", "spa", "team", "interior", "results"] as const;

export function GallerySection({ limit }: { limit?: number }) {
  const { content } = useContent();
  const { t, lang } = useLang();
  const [cat, setCat] = useState<string>("all");
  const [active, setActive] = useState<number | null>(null);

  const photos = useMemo(() => {
    const list = activeItems(content.gallery).filter((p) => cat === "all" || p.category === cat);
    return limit ? list.slice(0, limit) : list;
  }, [content.gallery, cat, limit]);

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading
          eyebrow={t("section.gallery")}
          title={t("section.gallery")}
          action={limit ? { to: "/gallery", label: t("cta.viewAll") } : undefined}
        />
        {!limit && (
          <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
            {GALLERY_CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em]",
                  cat === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40",
                )}
              >
                {c === "all" ? t("filter.all") : c}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
          {photos.map((ph, i) => (
            <button
              key={ph.id}
              onClick={() => setActive(i)}
              className="hover-zoom group block w-full text-left"
            >
              <img
                src={ph.url}
                alt={tr(ph.caption, lang)}
                loading="lazy"
                className={cn("w-full object-cover", i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]")}
              />
            </button>
          ))}
        </div>
      </div>

      {active !== null && photos[active] && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setActive(null)}
        >
          <button className="absolute right-5 top-5 text-white/80 hover:text-white" aria-label="Close">
            <X className="size-6" />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-h-full max-w-4xl">
            <img src={photos[active]!.url} alt={tr(photos[active]!.caption, lang)} className="max-h-[80vh] w-auto object-contain" />
            <figcaption className="mt-4 text-center text-xs uppercase tracking-[0.18em] text-white/60">
              {tr(photos[active]!.caption, lang)}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

export function TestimonialsSection() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const list = activeItems(content.testimonials);

  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading eyebrow={t("section.testimonials")} title={t("section.testimonialsTitle")} />
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {list.map((r, i) => (
            <Reveal
              key={r.id}
              delay={i * 90}
              as="article"
              className="w-[85vw] shrink-0 snap-start border border-border bg-background p-7 md:w-auto"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, idx) => (
                  <Star key={idx} className="size-3.5 fill-accent-brand text-accent-brand" />
                ))}
              </div>
              <p className="mt-5 font-display text-xl leading-snug">“{tr(r.review, lang)}”</p>
              <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                <img src={r.photo} alt={r.name} loading="lazy" className="size-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.service}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PromotionsSection() {
  const { content } = useContent();
  const { t, lang } = useLang();
  const { openBooking } = useBooking();
  const promos = content.promotions.filter((p) => p.enabled);
  if (!promos.length) return null;

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading eyebrow={t("section.promotions")} title={t("section.promotions")} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {promos.map((p, i) => {
            const live = isPromoLive(p);
            return (
              <Reveal key={p.id} delay={i * 90} as="article" className="group relative overflow-hidden">
                <div className="hover-zoom aspect-[16/10] w-full">
                  <img src={p.image} alt={tr(p.title, lang)} loading="lazy" className="size-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-white/70">
                    {live ? t("section.promotions") : t("label.expired")}
                  </p>
                  <h3 className="mt-2 font-display text-3xl text-white">{tr(p.title, lang)}</h3>
                  <p className="mt-2 max-w-md text-sm text-white/75">{tr(p.description, lang)}</p>
                  <div className="mt-5 flex items-center gap-4">
                    {live ? (
                      <button onClick={() => openBooking()} className="btn-base bg-white text-black hover:bg-white/85">
                        {tr(p.cta, lang)}
                      </button>
                    ) : (
                      <span className="btn-base btn-ghost-light pointer-events-none opacity-60">
                        {t("label.expired")}
                      </span>
                    )}
                    {p.discountPrice && (
                      <span className="text-sm text-white/80">
                        <span className="line-through opacity-50">{formatPrice(p.originalPrice ?? 0)}</span>{" "}
                        {formatPrice(p.discountPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function LocationSection() {
  const { content } = useContent();
  const { t } = useLang();
  const p = content.profile;

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading eyebrow={t("section.location")} title={t("info.visit")} />
        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="aspect-[16/11] w-full border border-border bg-secondary">
            <iframe
              title="Map"
              src={p.mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full grayscale-[0.4]"
            />
          </div>
          <div>
            <p className="font-display text-3xl">{p.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {p.address}
              <br />
              {p.city}
            </p>
            <ul className="mt-6 grid gap-1.5 border-t border-border pt-6 text-sm">
              {[1, 2, 3, 4, 5, 6, 0].map((i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{t(`day.${i}` as "day.0")}</span>
                  <span className="tabular-nums">{formatDay(content.hours.days[i]!)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={p.mapsUrl} target="_blank" rel="noreferrer" className="btn-base btn-solid">
                {t("cta.directions")}
              </a>
              <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="btn-base btn-outline-brand">
                {t("cta.call")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const { content } = useContent();
  const { t } = useLang();
  const p = content.profile;
  const status = getOpenStatus(content.hours);
  const wa = `https://wa.me/${p.whatsapp.replace(/\D/g, "")}`;

  const items = [
    { Icon: MapPin, label: t("info.visit"), value: `${p.address}, ${p.city}` },
    { Icon: MessageCircle, label: "WhatsApp", value: t("info.chat"), href: wa },
    { Icon: Phone, label: t("cta.call"), value: p.phone, href: `tel:${p.phone.replace(/\s/g, "")}` },
    { Icon: Mail, label: t("info.email"), value: p.email, href: `mailto:${p.email}` },
    { Icon: Clock, label: t("info.schedule"), value: `${status.todayLabel} · ${status.open ? t("status.open") : t("status.closed")}` },
  ];

  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading eyebrow={t("section.contact")} title={t("info.contact")} />
        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => {
            const body = (
              <div className="flex h-full flex-col gap-4 bg-background p-7 transition-colors hover:bg-secondary/60">
                <it.Icon className="size-4 text-muted-foreground" />
                <div>
                  <p className="eyebrow">{it.label}</p>
                  <p className="mt-1.5 text-base">{it.value}</p>
                </div>
              </div>
            );
            return it.href ? (
              <a key={it.label} href={it.href} target="_blank" rel="noreferrer">
                {body}
              </a>
            ) : (
              <div key={it.label}>{body}</div>
            );
          })}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={wa} target="_blank" rel="noreferrer" className="btn-base btn-solid">
            {t("cta.whatsapp")}
          </a>
          <a href={p.mapsUrl} target="_blank" rel="noreferrer" className="btn-base btn-outline-brand">
            {t("cta.directions")}
          </a>
          <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="btn-base btn-outline-brand">
            {t("cta.call")}
          </a>
        </div>
      </div>
    </section>
  );
}

export function PageHeader({ eyebrow, title, image }: { eyebrow: string; title: string; image?: string }) {
  return (
    <section className="relative border-b border-border bg-background pt-32">
      <div className="mx-auto max-w-[1400px] px-5 pb-14 sm:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[1.02] sm:text-6xl md:text-7xl">
          {title}
        </h1>
      </div>
      {image && (
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="hover-zoom aspect-[21/9] w-full">
            <img src={image} alt={title} className="size-full object-cover" />
          </div>
        </div>
      )}
    </section>
  );
}
