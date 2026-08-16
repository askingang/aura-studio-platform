import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useContent, uid } from "@/lib/salon/store";
import { tr, L, type GalleryCategory, type GalleryPhoto } from "@/lib/salon/types";
import {
  AdminPage,
  AddButton,
  EditorDialog,
  Field,
  ImageField,
  LocalizedField,
  RowActions,
  ToggleRow,
  move,
} from "@/components/admin/kit";

export const Route = createFileRoute("/admin/gallery")({ component: AdminGallery });

const CATS: GalleryCategory[] = ["salon", "hair", "nails", "facial", "spa", "team", "interior", "results"];

const blank = (order: number): GalleryPhoto => ({
  id: uid(),
  url: "",
  caption: L("", "", ""),
  category: "salon",
  enabled: true,
  order,
});

function AdminGallery() {
  const { content, update } = useContent();
  const [draft, setDraft] = useState<GalleryPhoto | null>(null);
  const list = [...content.gallery].sort((a, b) => a.order - b.order);

  const save = () => {
    if (!draft) return;
    update((p) => ({
      ...p,
      gallery: p.gallery.some((x) => x.id === draft.id)
        ? p.gallery.map((x) => (x.id === draft.id ? draft : x))
        : [...p.gallery, draft],
    }));
    setDraft(null);
  };

  const bulkUpload = (files: FileList) => {
    Array.from(files).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () =>
        update((p) => ({
          ...p,
          gallery: [
            ...p.gallery,
            { ...blank(p.gallery.length + 1 + i), url: String(reader.result) },
          ],
        }));
      reader.readAsDataURL(file);
    });
  };

  return (
    <AdminPage
      title="Gallery"
      description="Upload, caption and order the photos shown in the public gallery."
      action={<AddButton onClick={() => setDraft(blank(list.length + 1))} label="Add photo" />}
    >
      <label className="mb-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background py-10 text-sm text-muted-foreground">
        Drag & drop or click to upload multiple photos
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && bulkUpload(e.target.files)}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((g) => (
          <div key={g.id} className="rounded-xl border border-border bg-background p-3">
            <img src={g.url} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm">{tr(g.caption, "en") || "Untitled"}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {g.category}
                  {!g.enabled && " · hidden"}
                </p>
              </div>
              <RowActions
                onUp={() => update((c) => ({ ...c, gallery: move(c.gallery, g.id, -1) }))}
                onDown={() => update((c) => ({ ...c, gallery: move(c.gallery, g.id, 1) }))}
                onEdit={() => setDraft(g)}
                onDelete={() => update((c) => ({ ...c, gallery: c.gallery.filter((x) => x.id !== g.id) }))}
              />
            </div>
          </div>
        ))}
      </div>

      {draft && (
        <EditorDialog open onOpenChange={() => setDraft(null)} title="Photo" onSave={save}>
          <ImageField label="Image" value={draft.url} onChange={(url) => setDraft({ ...draft, url })} />
          <LocalizedField label="Caption" value={draft.caption} onChange={(caption) => setDraft({ ...draft, caption })} />
          <Field label="Category">
            <select
              className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as GalleryCategory })}
            >
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <ToggleRow label="Visible" checked={draft.enabled} onChange={(enabled) => setDraft({ ...draft, enabled })} />
        </EditorDialog>
      )}
    </AdminPage>
  );
}
