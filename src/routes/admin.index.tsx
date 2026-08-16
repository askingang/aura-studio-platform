import { createFileRoute, Link } from "@tanstack/react-router";
import { useContent, activeItems, isPromoLive } from "@/lib/salon/store";
import { getOpenStatus } from "@/lib/salon/hours";
import { AdminPage } from "@/components/admin/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const { content, reset } = useContent();
  const status = getOpenStatus(content.hours);

  const stats = [
    { label: "Services", value: activeItems(content.services).length, to: "/admin/services" },
    { label: "Packages", value: activeItems(content.packages).length, to: "/admin/packages" },
    { label: "Team members", value: activeItems(content.employees).length, to: "/admin/team" },
    { label: "Gallery photos", value: activeItems(content.gallery).length, to: "/admin/gallery" },
    { label: "Testimonials", value: activeItems(content.testimonials).length, to: "/admin/testimonials" },
    {
      label: "Active promotions",
      value: content.promotions.filter((p) => p.enabled && isPromoLive(p)).length,
      to: "/admin/promotions",
    },
  ] as const;

  return (
    <AdminPage
      title="Overview"
      description="Everything on the public website is managed from here."
      action={
        <button
          onClick={() => {
            if (confirm("Reset all content back to the demo data?")) reset();
          }}
          className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.16em]"
        >
          Reset demo content
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-xl border border-border bg-background p-6 transition-colors hover:border-foreground/30"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{s.label}</p>
            <p className="mt-3 font-display text-4xl">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Website status</p>
          <p className="mt-3 flex items-center gap-2 font-display text-2xl">
            <span className={cn("size-2 rounded-full", status.open ? "bg-emerald-500" : "bg-muted-foreground")} />
            {status.open ? "Open now" : "Closed"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Today: {status.todayLabel}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            WhatsApp bookings go to +{content.profile.whatsapp}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Quick actions</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { to: "/admin/services", label: "Add a service" },
              { to: "/admin/promotions", label: "Create a promotion" },
              { to: "/admin/hours", label: "Update hours" },
              { to: "/admin/appearance", label: "Change theme" },
              { to: "/admin/profile", label: "Edit business info" },
            ].map((a) => (
              <Link
                key={a.to + a.label}
                to={a.to}
                className="rounded-full border border-border px-4 py-2 text-xs hover:bg-secondary"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
