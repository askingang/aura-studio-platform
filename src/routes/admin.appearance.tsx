import { createFileRoute } from "@tanstack/react-router";
import { useContent } from "@/lib/salon/store";
import { THEME_PRESETS, FONT_OPTIONS } from "@/lib/salon/themes";
import type { ThemeSettings } from "@/lib/salon/types";
import { AdminPage, Field, TextField } from "@/components/admin/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/appearance")({ component: AdminAppearance });

function AdminAppearance() {
  const { content, update } = useContent();
  const theme = content.theme;
  const set = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) =>
    update((c) => ({ ...c, theme: { ...c.theme, [key]: value } }));

  return (
    <AdminPage title="Appearance" description="Themes, colours, typography and button style for the whole website.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {THEME_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() =>
              update((c) => ({ ...c, theme: { ...c.theme, preset: p.id, ...p.values } }))
            }
            className={cn(
              "rounded-xl border bg-background p-5 text-left transition-colors",
              theme.preset === p.id ? "border-foreground" : "border-border hover:border-foreground/30",
            )}
          >
            <div className="flex gap-1.5">
              {p.swatch.map((s) => (
                <span key={s} className="size-6 rounded-full border border-border" style={{ background: s }} />
              ))}
            </div>
            <p className="mt-4 font-display text-xl">{p.label}</p>
            <p className="text-xs text-muted-foreground">{p.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="grid gap-4 rounded-xl border border-border bg-background p-6">
          <h2 className="font-display text-2xl">Custom colours</h2>
          <p className="text-xs text-muted-foreground">Use oklch() values, e.g. oklch(0.2 0.02 60).</p>
          <TextField label="Primary" value={theme.primary} onChange={(v) => set("primary", v)} />
          <TextField label="Secondary" value={theme.secondary} onChange={(v) => set("secondary", v)} />
          <TextField label="Accent" value={theme.accent} onChange={(v) => set("accent", v)} />
          <TextField label="Background" value={theme.background} onChange={(v) => set("background", v)} />
          <TextField label="Text" value={theme.foreground} onChange={(v) => set("foreground", v)} />
        </section>

        <section className="grid gap-4 rounded-xl border border-border bg-background p-6">
          <h2 className="font-display text-2xl">Typography & shape</h2>
          <Field label="Display font">
            <select
              className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              value={theme.fontDisplay}
              onChange={(e) => set("fontDisplay", e.target.value)}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>
          <TextField label="Border radius (e.g. 0.25rem)" value={theme.radius} onChange={(v) => set("radius", v)} />
          <Field label="Button style">
            <select
              className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              value={theme.buttonStyle}
              onChange={(e) => set("buttonStyle", e.target.value as ThemeSettings["buttonStyle"])}
            >
              <option value="pill">Pill</option>
              <option value="soft">Soft</option>
              <option value="square">Square</option>
            </select>
          </Field>
          <div className="rounded-lg border border-border p-5">
            <p className="eyebrow">Preview</p>
            <p className="mt-2 font-display text-3xl">Beauty, Wellness & You.</p>
            <button className="btn-base btn-solid mt-4">Book an appointment</button>
          </div>
        </section>
      </div>
    </AdminPage>
  );
}
