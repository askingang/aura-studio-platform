import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useContent, uid } from "@/lib/salon/store";
import { tr, L, type Employee } from "@/lib/salon/types";
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

export const Route = createFileRoute("/admin/team")({ component: AdminTeam });

const blank = (order: number): Employee => ({
  id: uid(),
  name: "",
  position: L("", "", ""),
  specialty: L("", "", ""),
  bio: L("", "", ""),
  experience: 1,
  services: [],
  languages: [],
  instagram: "",
  availability: L("", "", ""),
  photo: "",
  enabled: true,
  featured: false,
  order,
});

function AdminTeam() {
  const { content, update } = useContent();
  const [draft, setDraft] = useState<Employee | null>(null);
  const list = [...content.employees].sort((a, b) => a.order - b.order);

  const save = () => {
    if (!draft) return;
    update((p) => ({
      ...p,
      employees: p.employees.some((x) => x.id === draft.id)
        ? p.employees.map((x) => (x.id === draft.id ? draft : x))
        : [...p.employees, draft],
    }));
    setDraft(null);
  };

  return (
    <AdminPage
      title="Team"
      description="Stylists and therapists shown on the website and in the booking flow."
      action={<AddButton onClick={() => setDraft(blank(list.length + 1))} label="Add member" />}
    >
      <div className="grid gap-3">
        {list.map((e) => (
          <div key={e.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-background p-3">
            <img src={e.photo} alt="" className="size-16 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{e.name}</p>
              <p className="text-xs text-muted-foreground">
                {tr(e.position, "en")} · {e.experience} yrs{!e.enabled && " · hidden"}
              </p>
            </div>
            <RowActions
              onUp={() => update((c) => ({ ...c, employees: move(c.employees, e.id, -1) }))}
              onDown={() => update((c) => ({ ...c, employees: move(c.employees, e.id, 1) }))}
              onEdit={() => setDraft(e)}
              onDelete={() => update((c) => ({ ...c, employees: c.employees.filter((x) => x.id !== e.id) }))}
            />
          </div>
        ))}
      </div>

      {draft && (
        <EditorDialog open onOpenChange={() => setDraft(null)} title="Team member" onSave={save}>
          <TextField label="Full name" value={draft.name} onChange={(name) => setDraft({ ...draft, name })} />
          <LocalizedField label="Position" value={draft.position} onChange={(position) => setDraft({ ...draft, position })} />
          <LocalizedField label="Specialty" value={draft.specialty} onChange={(specialty) => setDraft({ ...draft, specialty })} />
          <LocalizedField label="Biography" multiline value={draft.bio} onChange={(bio) => setDraft({ ...draft, bio })} />
          <LocalizedField
            label="Availability"
            value={draft.availability}
            onChange={(availability) => setDraft({ ...draft, availability })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Years of experience"
              type="number"
              value={draft.experience}
              onChange={(v) => setDraft({ ...draft, experience: Number(v) })}
            />
            <TextField
              label="Languages (comma separated)"
              value={draft.languages.join(", ")}
              onChange={(v) => setDraft({ ...draft, languages: v.split(",").map((s) => s.trim()).filter(Boolean) })}
            />
          </div>
          <TextField label="Instagram URL" value={draft.instagram} onChange={(instagram) => setDraft({ ...draft, instagram })} />
          <div className="grid gap-1.5">
            <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Services provided</span>
            <div className="flex flex-wrap gap-2">
              {content.services.map((s) => {
                const on = draft.services.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        services: on ? draft.services.filter((x) => x !== s.id) : [...draft.services, s.id],
                      })
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs ${on ? "border-foreground bg-foreground text-background" : "border-border"}`}
                  >
                    {tr(s.name, "en")}
                  </button>
                );
              })}
            </div>
          </div>
          <ImageField label="Profile photo" value={draft.photo} onChange={(photo) => setDraft({ ...draft, photo })} />
          <div className="grid gap-2 sm:grid-cols-2">
            <ToggleRow label="Visible" checked={draft.enabled} onChange={(enabled) => setDraft({ ...draft, enabled })} />
            <ToggleRow label="Featured" checked={draft.featured} onChange={(featured) => setDraft({ ...draft, featured })} />
          </div>
        </EditorDialog>
      )}
    </AdminPage>
  );
}
