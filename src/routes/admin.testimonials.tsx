import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import { useContent, uid } from "@/lib/salon/store";
import { tr, L, type Testimonial } from "@/lib/salon/types";
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

export const Route = createFileRoute("/admin/testimonials")({ component: AdminTestimonials });

const blank = (order: number): Testimonial => ({
  id: uid(),
  name: "",
  photo: "",
  rating: 5,
  review: L("", "", ""),
  service: "",
  date: new Date().toISOString().slice(0, 10),
  featured: false,
  enabled: true,
  order,
});

function AdminTestimonials() {
  const { content, update } = useContent();
  const [draft, setDraft] = useState<Testimonial | null>(null);
  const list = [...content.testimonials].sort((a, b) => a.order - b.order);

  const save = () => {
    if (!draft) return;
    update((p) => ({
      ...p,
      testimonials: p.testimonials.some((x) => x.id === draft.id)
        ? p.testimonials.map((x) => (x.id === draft.id ? draft : x))
        : [...p.testimonials, draft],
    }));
    setDraft(null);
  };

  return (
    <AdminPage
      title="Testimonials"
      description="Client reviews shown across the website."
      action={<AddButton onClick={() => setDraft(blank(list.length + 1))} label="Add review" />}
    >
      <div className="grid gap-3">
        {list.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-background p-3">
            <img src={r.photo} alt="" className="size-12 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{r.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="size-3 fill-current" />
                ))}
                <span className="ml-1 truncate">{r.service}</span>
                {!r.enabled && <span>· hidden</span>}
              </p>
            </div>
            <RowActions
              onUp={() => update((c) => ({ ...c, testimonials: move(c.testimonials, r.id, -1) }))}
              onDown={() => update((c) => ({ ...c, testimonials: move(c.testimonials, r.id, 1) }))}
              onEdit={() => setDraft(r)}
              onDelete={() => update((c) => ({ ...c, testimonials: c.testimonials.filter((x) => x.id !== r.id) }))}
            />
          </div>
        ))}
      </div>

      {draft && (
        <EditorDialog open onOpenChange={() => setDraft(null)} title="Testimonial" onSave={save}>
          <TextField label="Customer name" value={draft.name} onChange={(name) => setDraft({ ...draft, name })} />
          <LocalizedField label="Review" multiline value={draft.review} onChange={(review) => setDraft({ ...draft, review })} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Rating">
              <select
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                value={draft.rating}
                onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} stars
                  </option>
                ))}
              </select>
            </Field>
            <TextField label="Service used" value={draft.service} onChange={(service) => setDraft({ ...draft, service })} />
            <TextField label="Date" type="date" value={draft.date} onChange={(date) => setDraft({ ...draft, date })} />
          </div>
          <ImageField label="Customer photo" value={draft.photo} onChange={(photo) => setDraft({ ...draft, photo })} />
          <div className="grid gap-2 sm:grid-cols-2">
            <ToggleRow label="Visible" checked={draft.enabled} onChange={(enabled) => setDraft({ ...draft, enabled })} />
            <ToggleRow label="Featured" checked={draft.featured} onChange={(featured) => setDraft({ ...draft, featured })} />
          </div>
          <p className="text-xs text-muted-foreground">{tr(draft.review, "en").length} characters</p>
        </EditorDialog>
      )}
    </AdminPage>
  );
}
