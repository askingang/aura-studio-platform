import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Scissors,
  Package,
  Users,
  Images,
  Star,
  Tag,
  Clock,
  Building2,
  Palette,
  ExternalLink,
} from "lucide-react";
import { useLang } from "@/lib/salon/i18n";
import type { Lang } from "@/lib/salon/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Maison Lunaire" },
      { name: "description", content: "Manage services, packages, team, gallery and settings." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard | Maison Lunaire" },
      { property: "og:description", content: "Content management for the studio." },
    ],
  }),
  component: AdminLayout,
});

export const ADMIN_NAV = [
  { to: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
  { to: "/admin/services", label: "Services", Icon: Scissors },
  { to: "/admin/packages", label: "Packages", Icon: Package },
  { to: "/admin/team", label: "Team", Icon: Users },
  { to: "/admin/gallery", label: "Gallery", Icon: Images },
  { to: "/admin/testimonials", label: "Testimonials", Icon: Star },
  { to: "/admin/promotions", label: "Promotions", Icon: Tag },
  { to: "/admin/hours", label: "Opening Hours", Icon: Clock },
  { to: "/admin/profile", label: "Business Profile", Icon: Building2 },
  { to: "/admin/appearance", label: "Appearance", Icon: Palette },
] as const;

const LANGS: { id: Lang; label: string }[] = [
  { id: "id", label: "ID" },
  { id: "en", label: "EN" },
  { id: "zh", label: "中文" },
];

function AdminLayout() {
  const { lang, setLang } = useLang();

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background p-5 lg:flex">
          <Link to="/" className="font-display text-base tracking-[0.24em]">
            MAISON LUNAIRE
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">Content dashboard</p>
          <nav className="mt-8 grid gap-0.5">
            {ADMIN_NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: "exact" in n ? n.exact : false }}
                activeProps={{ className: "bg-secondary font-medium" }}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary"
              >
                <n.Icon className="size-4" />
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto grid gap-3 pt-6">
            <div className="flex gap-1">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={cn(
                    "rounded-full border border-border px-2.5 py-1 text-[0.65rem] tracking-widest",
                    lang === l.id && "bg-foreground text-background",
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
              <ExternalLink className="size-3.5" /> View website
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="no-scrollbar sticky top-0 z-30 flex gap-1 overflow-x-auto border-b border-border bg-background px-3 py-2 lg:hidden">
            {ADMIN_NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: "exact" in n ? n.exact : false }}
                activeProps={{ className: "bg-foreground text-background" }}
                className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs"
              >
                {n.label}
              </Link>
            ))}
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
