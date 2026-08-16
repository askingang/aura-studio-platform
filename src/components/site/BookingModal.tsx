import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useBooking } from "@/lib/salon/booking";
import { useContent, activeItems } from "@/lib/salon/store";
import { useLang } from "@/lib/salon/i18n";
import { tr } from "@/lib/salon/types";

const field =
  "w-full rounded-[var(--btn-radius,0.5rem)] border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground transition-colors";

export function BookingModal() {
  const { open, seed, closeBooking } = useBooking();
  const { content } = useContent();
  const { t, lang } = useLang();

  const services = activeItems(content.services);
  const packages = activeItems(content.packages);
  const employees = activeItems(content.employees);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    serviceId: "",
    packageId: "",
    employeeId: "",
    date: "",
    time: "",
    note: "",
  });

  useEffect(() => {
    if (open) {
      setForm((f) => ({
        ...f,
        serviceId: seed.serviceId ?? "",
        packageId: seed.packageId ?? "",
        employeeId: seed.employeeId ?? "",
      }));
    }
  }, [open, seed]);

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error(t("booking.required"));
      return;
    }
    const service = services.find((s) => s.id === form.serviceId);
    const pack = packages.find((p) => p.id === form.packageId);
    const emp = employees.find((e) => e.id === form.employeeId);

    const lines = [
      lang === "id"
        ? "Halo, saya ingin membuat janji."
        : lang === "zh"
          ? "您好，我想预约。"
          : "Hello, I would like to book an appointment.",
      "",
      `${t("booking.name")}: ${form.name.trim()}`,
      form.phone ? `WhatsApp: ${form.phone.trim()}` : "",
      service ? `${t("booking.service")}: ${tr(service.name, lang)}` : "",
      pack ? `${t("booking.package")}: ${tr(pack.name, lang)}` : "",
      emp ? `${t("booking.employee")}: ${emp.name}` : "",
      form.date ? `${t("booking.date")}: ${form.date}` : "",
      form.time ? `${t("booking.time")}: ${form.time}` : "",
      form.note ? `${t("booking.note")}: ${form.note}` : "",
      "",
      lang === "id" ? "Terima kasih." : lang === "zh" ? "谢谢。" : "Thank you.",
    ].filter(Boolean);

    const url = `https://wa.me/${content.profile.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    closeBooking();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && closeBooking()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-none border-border bg-background p-0 sm:max-w-lg">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 space-y-1 text-left">
            <DialogTitle className="font-display text-3xl font-normal tracking-tight">
              {t("booking.title")}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{t("booking.subtitle")}</p>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {t("booking.name")}
                </Label>
                <Input
                  value={form.name}
                  maxLength={80}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-[var(--btn-radius,0.5rem)]"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {t("booking.phone")}
                </Label>
                <Input
                  value={form.phone}
                  maxLength={24}
                  inputMode="tel"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-[var(--btn-radius,0.5rem)]"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {t("booking.service")}
              </Label>
              <select
                className={field}
                value={form.serviceId}
                onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
              >
                <option value="">{t("booking.none")}</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {tr(s.name, lang)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {t("booking.package")}
                </Label>
                <select
                  className={field}
                  value={form.packageId}
                  onChange={(e) => setForm({ ...form, packageId: e.target.value })}
                >
                  <option value="">{t("booking.none")}</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {tr(p.name, lang)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {t("booking.employee")}
                </Label>
                <select
                  className={field}
                  value={form.employeeId}
                  onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                >
                  <option value="">{t("booking.none")}</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {t("booking.date")}
                </Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="rounded-[var(--btn-radius,0.5rem)]"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {t("booking.time")}
                </Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="rounded-[var(--btn-radius,0.5rem)]"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {t("booking.note")}
              </Label>
              <Textarea
                value={form.note}
                maxLength={400}
                rows={3}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="rounded-[var(--btn-radius,0.5rem)] resize-none"
              />
            </div>

            <button
              onClick={submit}
              className="mt-2 w-full rounded-[var(--btn-radius,0.5rem)] bg-primary px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("booking.submit")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
