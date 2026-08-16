import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useContent, uid, isPromoLive } from "@/lib/salon/store";
import { tr, L, type Promotion } from "@/lib/salon/types";
import {
  AdminPage,
  AddButton,
  EditorDialog,
  ImageField,
  LocalizedField,
  TextField,
  ToggleRow,
} from "@/components/admin/kit";
import { Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/promotions")({ component: AdminPromotions });

const blank = (): Promotion => ({
  id: uid(),
  title: L("", "", ""),
  description: L("", "", ""),
  image: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
  cta: L("Pesan Sekarang", "Book Now", "立即预约"),
  enabled: true,
});

function AdminPromotions() {
  const { content, update } = useContent();
  const [draft, setDraft] = useState<Promotion | null>(null);

  const save = () => {
    if (!draft) return;
    update((p) => ({
      ...p,
      promotions: p.promotions.some((x) => x.id === draft.id)
        ? p.promotions.map((x) => (x.id === draft.id ? draft : x))
        : [...p.promotions, draft],
    }));
    setDraft(null);
  };

  return (
    <AdminPage
      title="Promotions"
      description="Offers automatically hide themselves after the end date."
      action={<AddButton onClick={() => setDraft(blank())} label="Add promotion" />}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {content.promotions.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-background p-3">
            <img src={p.image} alt="" className="aspect-[16/9] w-full rounded-lg object-cover" />
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{tr(p.title, "en")}</p>
                <p className="text-xs text-muted-foreground">
                  {p.startDate} → {p.endDate} ·{" "}
                  {!p.enabled ? "disabled" : isPromoLive(p) ? "active" : "expired"}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setDraft(p)} className="rounded p-1.5 hover:bg-secondary">
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => update((c) => ({ ...c, promotions: c.promotions.filter((x) => x.id !== p.id) }))}
                  className="rounded p-1.5 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {draft && (
        <EditorDialog open onOpenChange={() => setDraft(null)} title="Promotion" onSave={save}>
          <LocalizedField label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
          <LocalizedField
            label="Description"
            multiline
            value={draft.description}
            onChange={(description) => setDraft({ ...draft, description })}
          />
          <LocalizedField label="Button label" value={draft.cta} onChange={(cta) => setDraft({ ...draft, cta })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Original price"
              type="number"
              value={draft.originalPrice ?? ""}
              onChange={(v) => setDraft({ ...draft, originalPrice: v ? Number(v) : undefined } as Promotion)}
            />
            <TextField
              label="Discount price"
              type="number"
              value={draft.discountPrice ?? ""}
              onChange={(v) => setDraft({ ...draft, discountPrice: v ? Number(v) : undefined } as Promotion)}
            />
            <TextField label="Start date" type="date" value={draft.startDate} onChange={(startDate) => setDraft({ ...draft, startDate })} />
            <TextField label="End date" type="date" value={draft.endDate} onChange={(endDate) => setDraft({ ...draft, endDate })} />
          </div>
          <ImageField label="Image" value={draft.image} onChange={(image) => setDraft({ ...draft, image })} />
          <ToggleRow label="Active" checked={draft.enabled} onChange={(enabled) => setDraft({ ...draft, enabled })} />
        </EditorDialog>
      )}
    </AdminPage>
  );
}
