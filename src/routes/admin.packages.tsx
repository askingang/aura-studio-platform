import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useContent, uid } from "@/lib/salon/store";
import { formatPrice } from "@/lib/salon/hours";
import { tr, L, type Package } from "@/lib/salon/types";
import {
  AdminPage,
  AddButton,
  EditorDialog,
  ImageField,
  LocalizedField,
  RowActions,
  TextField,
  ToggleRow,
  move,
} from "@/components/admin/kit";

export const Route = createFileRoute("/admin/packages")({ component: AdminPackages });

const blank = (order: number): Package => ({
  id: uid(),
  name: L("", "", ""),
  description: L("", "", ""),
  items: [L("", "", "")],
  price: 0,
  image: "",
  popular: false,
  enabled: true,
  order,
});

function AdminPackages() {
  const { content, update } = useContent();
  const [draft, setDraft] = useState<Package | null>(null);
  const list = [...content.packages].sort((a, b) => a.order - b.order);

  const save = () => {
    if (!draft) return;
    update((p) => ({
      ...p,
      packages: p.packages.some((x) => x.id === draft.id)
        ? p.packages.map((x) => (x.id === draft.id ? draft : x))
        : [...p.packages, draft],
    }));
    setDraft(null);
  };

  return (
    <AdminPage
      title="Packages"
      description="Bundle treatments into rituals with their own price and photo."
      action={<AddButton onClick={() => setDraft(blank(list.length + 1))} label="Add package" />}
    >
      <div className="grid gap-3">
        {list.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-background p-3">
            <img src={p.image} alt="" className="size-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{tr(p.name, "en")}</p>
              <p className="text-xs text-muted-foreground">
                {p.items.length} treatments · {formatPrice(p.discountPrice ?? p.price)}
                {!p.enabled && " · hidden"}
              </p>
            </div>
            <RowActions
              onUp={() => update((c) => ({ ...c, packages: move(c.packages, p.id, -1) }))}
              onDown={() => update((c) => ({ ...c, packages: move(c.packages, p.id, 1) }))}
              onEdit={() => setDraft(p)}
              onDelete={() => update((c) => ({ ...c, packages: c.packages.filter((x) => x.id !== p.id) }))}
            />
          </div>
        ))}
      </div>

      {draft && (
        <EditorDialog open onOpenChange={() => setDraft(null)} title="Package" onSave={save}>
          <LocalizedField label="Name" value={draft.name} onChange={(name) => setDraft({ ...draft, name })} />
          <LocalizedField
            label="Description"
            multiline
            value={draft.description}
            onChange={(description) => setDraft({ ...draft, description })}
          />
          <div className="grid gap-3">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Included treatments</p>
            {draft.items.map((item, i) => (
              <div key={i} className="flex items-end gap-2">
                <div className="flex-1">
                  <LocalizedField
                    label={`Item ${i + 1}`}
                    value={item}
                    onChange={(v) =>
                      setDraft({ ...draft, items: draft.items.map((x, xi) => (xi === i ? v : x)) })
                    }
                  />
                </div>
                <button
                  onClick={() => setDraft({ ...draft, items: draft.items.filter((_, xi) => xi !== i) })}
                  className="mb-1 rounded-md border border-border px-3 py-2 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => setDraft({ ...draft, items: [...draft.items, L("", "", "")] })}
              className="justify-self-start rounded-full border border-border px-4 py-2 text-xs"
            >
              Add treatment
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Price" type="number" value={draft.price} onChange={(v) => setDraft({ ...draft, price: Number(v) })} />
            <TextField
              label="Discount price (optional)"
              type="number"
              value={draft.discountPrice ?? ""}
              onChange={(v) => setDraft({ ...draft, discountPrice: v ? Number(v) : undefined } as Package)}
            />
          </div>
          <ImageField label="Photo" value={draft.image} onChange={(image) => setDraft({ ...draft, image })} />
          <div className="grid gap-2 sm:grid-cols-2">
            <ToggleRow label="Visible" checked={draft.enabled} onChange={(enabled) => setDraft({ ...draft, enabled })} />
            <ToggleRow label="Popular" checked={draft.popular} onChange={(popular) => setDraft({ ...draft, popular })} />
          </div>
        </EditorDialog>
      )}
    </AdminPage>
  );
}
