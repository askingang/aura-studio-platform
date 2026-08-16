import { useState, type ReactNode } from "react";
import { ChevronUp, ChevronDown, Trash2, Pencil, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLang } from "@/lib/salon/i18n";
import type { Lang, Localized } from "@/lib/salon/types";
import { cn } from "@/lib/utils";

export function AdminPage({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <Field label={label}>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

const LANGS: { id: Lang; label: string }[] = [
  { id: "id", label: "ID" },
  { id: "en", label: "EN" },
  { id: "zh", label: "中文" },
];

export function LocalizedField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: Localized;
  onChange: (v: Localized) => void;
  multiline?: boolean;
}) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <div className="flex gap-1">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLang(l.id)}
              className={cn(
                "rounded-full px-2 py-0.5 text-[0.65rem] tracking-widest",
                lang === l.id ? "bg-foreground text-background" : "text-muted-foreground",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      {multiline ? (
        <Textarea
          rows={3}
          value={value[lang]}
          onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
        />
      ) : (
        <Input value={value[lang]} onChange={(e) => onChange({ ...value, [lang]: e.target.value })} />
      )}
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };
  return (
    <div className="grid gap-2">
      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <div className="flex gap-3">
        {value && (
          <img src={value} alt="preview" className="size-20 shrink-0 rounded-md object-cover" />
        )}
        <div className="grid flex-1 gap-2">
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            className="text-xs text-muted-foreground file:mr-3 file:rounded-full file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-xs"
          />
        </div>
      </div>
    </div>
  );
}

export function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function RowActions({
  onUp,
  onDown,
  onEdit,
  onDelete,
}: {
  onUp: () => void;
  onDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onUp} className="rounded p-1.5 hover:bg-secondary" aria-label="Move up">
        <ChevronUp className="size-4" />
      </button>
      <button onClick={onDown} className="rounded p-1.5 hover:bg-secondary" aria-label="Move down">
        <ChevronDown className="size-4" />
      </button>
      <button onClick={onEdit} className="rounded p-1.5 hover:bg-secondary" aria-label="Edit">
        <Pencil className="size-4" />
      </button>
      <button
        onClick={onDelete}
        className="rounded p-1.5 text-destructive hover:bg-destructive/10"
        aria-label="Delete"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90"
    >
      <Plus className="size-4" /> {label}
    </button>
  );
}

export function EditorDialog({
  open,
  onOpenChange,
  title,
  onSave,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  onSave: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">{children}</div>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-[0.16em]"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="rounded-full bg-primary px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-primary-foreground"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function move<T extends { order: number }>(list: T[], id: string, dir: -1 | 1, key: keyof T = "id" as keyof T) {
  const sorted = [...list].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((i) => String(i[key]) === id);
  const swap = idx + dir;
  if (idx < 0 || swap < 0 || swap >= sorted.length) return list;
  const a = sorted[idx]!;
  const b = sorted[swap]!;
  const ao = a.order;
  return list.map((i) =>
    i === a ? { ...i, order: b.order } : i === b ? { ...i, order: ao } : i,
  );
}

export function useAdminLang() {
  return useLang();
}
