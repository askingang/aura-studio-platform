import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useContent, uid } from "@/lib/salon/store";
import { formatPrice } from "@/lib/salon/hours";
import { tr, L, type Service, type ServiceCategory } from "@/lib/salon/types";
import {
  AdminPage,
  AddButton,
  EditorDialog,
  Field,
  ImageField,
  LocalizedField,
  RowActions,
  TextField,
  ToggleRow,
  move,
} from "@/components/admin/kit";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/services")({ component: AdminServices });

const CATS: ServiceCategory[] = ["hair", "nails", "facial", "spa", "beauty"];

const blank = (order: number): Service => ({
  id: uid(),
  name: L("", "", ""),
  description: L("", "", ""),
  category: "hair",
  price: 0,
  duration: 60,
  image: "",
  enabled: true,
  featured: false,
  popular: false,
  order,
});

function AdminServices() {
  const { content, update } = useContent();
  const [draft, setDraft] = useState<Service | null>(null);
  const [q, setQ] = useState("");

  const list = [...content.services]
    .sort((a, b) => a.order - b.order)
    .filter((s) => tr(s.name, "en").toLowerCase().includes(q.toLowerCase()));

  const save = () => {
    if (!draft) return;
    update((p) => ({
      ...p,
      services: p.services.some((s) => s.id === draft.id)
        ? p.services.map((s) => (s.id === draft.id ? draft : s))
        : [...p.services, draft],
    }));
    setDraft(null);
  };

  return (
    <AdminPage
      title="Services"
      description="Add, price and organise every treatment shown on the website."
      action={
        <AddButton
          onClick={() => setDraft(blank(content.services.length + 1))}
          label="Add service"
        />
      }
    >
      <Input
        placeholder="Search services…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4 max-w-xs"
      />
      <div className="grid gap-3">
        {list.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-background p-3"
          >
            <img src={s.image} alt="" className="size-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{tr(s.name, "en")}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {s.category} · {s.duration} min · {formatPrice(s.discountPrice ?? s.price)}
                {!s.enabled && " · hidden"}
              </p>
            </div>
            <RowActions
              onUp={() => update((p) => ({ ...p, services: move(p.services, s.id, -1) }))}
              onDown={() => update((p) => ({ ...p, services: move(p.services, s.id, 1) }))}
              onEdit={() => setDraft(s)}
              onDelete={() =>
                update((p) => ({ ...p, services: p.services.filter((x) => x.id !== s.id) }))
              }
            />
          </div>
        ))}
      </div>

      {draft && (
        <EditorDialog open onOpenChange={() => setDraft(null)} title="Service" onSave={save}>
          <LocalizedField
            label="Name"
            value={draft.name}
            onChange={(name) => setDraft({ ...draft, name })}
          />
          <LocalizedField
            label="Description"
            multiline
            value={draft.description}
            onChange={(description) => setDraft({ ...draft, description })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as ServiceCategory })}
              >
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <TextField
              label="Duration (minutes)"
              type="number"
              value={draft.duration}
              onChange={(v) => setDraft({ ...draft, duration: Number(v) })}
            />
            <TextField
              label="Price"
              type="number"
              value={draft.price}
              onChange={(v) => setDraft({ ...draft, price: Number(v) })}
            />
            <TextField
              label="Discount price (optional)"
              type="number"
              value={draft.discountPrice ?? ""}
              onChange={(v) =>
                setDraft({ ...draft, discountPrice: v ? Number(v) : undefined } as Service)
              }
            />
          </div>
          <ImageField
            label="Photo"
            value={draft.image}
            onChange={(image) => setDraft({ ...draft, image })}
          />
          <div className="grid gap-2 sm:grid-cols-3">
            <ToggleRow
              label="Visible"
              checked={draft.enabled}
              onChange={(enabled) => setDraft({ ...draft, enabled })}
            />
            <ToggleRow
              label="Featured"
              checked={draft.featured}
              onChange={(featured) => setDraft({ ...draft, featured })}
            />
            <ToggleRow
              label="Popular"
              checked={draft.popular}
              onChange={(popular) => setDraft({ ...draft, popular })}
            />
          </div>
        </EditorDialog>
      )}
    </AdminPage>
  );
}
