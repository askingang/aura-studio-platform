import { createFileRoute } from "@tanstack/react-router";
import { useContent } from "@/lib/salon/store";
import type { BusinessProfile } from "@/lib/salon/types";
import { AdminPage, ImageField, LocalizedField, TextField } from "@/components/admin/kit";

export const Route = createFileRoute("/admin/profile")({ component: AdminProfile });

function AdminProfile() {
  const { content, update } = useContent();
  const p = content.profile;
  const set = <K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) =>
    update((c) => ({ ...c, profile: { ...c.profile, [key]: value } }));

  return (
    <AdminPage title="Business profile" description="Brand details, contact channels, hero content and SEO.">
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="grid gap-4 rounded-xl border border-border bg-background p-6">
          <h2 className="font-display text-2xl">Brand</h2>
          <TextField label="Business name" value={p.name} onChange={(v) => set("name", v)} />
          <TextField label="Logo text" value={p.logoText} onChange={(v) => set("logoText", v)} />
          <LocalizedField label="Tagline" value={p.tagline} onChange={(v) => set("tagline", v)} />
          <ImageField label="Hero image" value={p.heroImage} onChange={(v) => set("heroImage", v)} />
          <ImageField label="Cover image" value={p.coverImage} onChange={(v) => set("coverImage", v)} />
          <LocalizedField label="Hero headline" value={p.heroHeadline} onChange={(v) => set("heroHeadline", v)} />
          <LocalizedField label="Hero description" multiline value={p.heroSubline} onChange={(v) => set("heroSubline", v)} />
        </section>

        <section className="grid gap-4 rounded-xl border border-border bg-background p-6">
          <h2 className="font-display text-2xl">About</h2>
          <LocalizedField label="About title" value={p.aboutTitle} onChange={(v) => set("aboutTitle", v)} />
          <LocalizedField label="Description" multiline value={p.aboutDescription} onChange={(v) => set("aboutDescription", v)} />
          <LocalizedField label="Story" multiline value={p.aboutStory} onChange={(v) => set("aboutStory", v)} />
          <LocalizedField label="Philosophy" multiline value={p.aboutPhilosophy} onChange={(v) => set("aboutPhilosophy", v)} />
          <TextField label="Years of experience" type="number" value={p.experienceYears} onChange={(v) => set("experienceYears", Number(v))} />
          <ImageField label="About image" value={p.aboutImage} onChange={(v) => set("aboutImage", v)} />
          <ImageField label="Secondary image" value={p.aboutImageSecondary} onChange={(v) => set("aboutImageSecondary", v)} />
        </section>

        <section className="grid gap-4 rounded-xl border border-border bg-background p-6">
          <h2 className="font-display text-2xl">Contact & location</h2>
          <TextField label="Phone" value={p.phone} onChange={(v) => set("phone", v)} />
          <TextField label="WhatsApp number (country code, digits only)" value={p.whatsapp} onChange={(v) => set("whatsapp", v)} />
          <TextField label="Email" value={p.email} onChange={(v) => set("email", v)} />
          <TextField label="Address" value={p.address} onChange={(v) => set("address", v)} />
          <TextField label="City" value={p.city} onChange={(v) => set("city", v)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Latitude" value={p.latitude} onChange={(v) => set("latitude", v)} />
            <TextField label="Longitude" value={p.longitude} onChange={(v) => set("longitude", v)} />
          </div>
          <TextField label="Google Maps URL" value={p.mapsUrl} onChange={(v) => set("mapsUrl", v)} />
          <TextField label="Google Maps embed URL" value={p.mapsEmbedUrl} onChange={(v) => set("mapsEmbedUrl", v)} />
        </section>

        <section className="grid gap-4 rounded-xl border border-border bg-background p-6">
          <h2 className="font-display text-2xl">Social & SEO</h2>
          <TextField label="Instagram" value={p.instagram} onChange={(v) => set("instagram", v)} />
          <TextField label="Facebook" value={p.facebook} onChange={(v) => set("facebook", v)} />
          <TextField label="TikTok" value={p.tiktok} onChange={(v) => set("tiktok", v)} />
          <TextField label="Website URL" value={p.website} onChange={(v) => set("website", v)} />
          <TextField label="SEO title" value={p.seoTitle} onChange={(v) => set("seoTitle", v)} />
          <TextField label="SEO description" value={p.seoDescription} onChange={(v) => set("seoDescription", v)} />
          <ImageField label="Social sharing image" value={p.seoImage} onChange={(v) => set("seoImage", v)} />
        </section>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Changes save automatically.</p>
    </AdminPage>
  );
}
