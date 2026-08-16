import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useContent, uid } from "@/lib/salon/store";
import { AdminPage } from "@/components/admin/kit";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/hours")({ component: AdminHours });

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function AdminHours() {
  const { content, update } = useContent();
  const hours = content.hours;

  const setDay = (i: number, next: (typeof hours.days)[number]) =>
    update((c) => ({
      ...c,
      hours: { ...c.hours, days: c.hours.days.map((d, di) => (di === i ? next : d)) },
    }));

  return (
    <AdminPage title="Opening hours" description="The website open/closed badge is calculated from this schedule.">
      <div className="grid gap-3">
        {[1, 2, 3, 4, 5, 6, 0].map((i) => {
          const d = hours.days[i]!;
          return (
            <div key={i} className="rounded-xl border border-border bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="w-28 font-medium">{DAYS[i]}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Closed
                  <Switch checked={d.closed} onCheckedChange={(closed) => setDay(i, { ...d, closed })} />
                </div>
              </div>
              {!d.closed && (
                <div className="mt-3 grid gap-2">
                  {d.periods.map((p, pi) => (
                    <div key={pi} className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={p.open}
                        className="w-32"
                        onChange={(e) =>
                          setDay(i, {
                            ...d,
                            periods: d.periods.map((x, xi) => (xi === pi ? { ...x, open: e.target.value } : x)),
                          })
                        }
                      />
                      <span className="text-muted-foreground">—</span>
                      <Input
                        type="time"
                        value={p.close}
                        className="w-32"
                        onChange={(e) =>
                          setDay(i, {
                            ...d,
                            periods: d.periods.map((x, xi) => (xi === pi ? { ...x, close: e.target.value } : x)),
                          })
                        }
                      />
                      {d.periods.length > 1 && (
                        <button
                          onClick={() => setDay(i, { ...d, periods: d.periods.filter((_, xi) => xi !== pi) })}
                          className="rounded p-2 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setDay(i, { ...d, periods: [...d.periods, { open: "18:00", close: "21:00" }] })}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs"
                  >
                    <Plus className="size-3.5" /> Add period
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Special dates</h2>
          <button
            onClick={() =>
              update((c) => ({
                ...c,
                hours: {
                  ...c.hours,
                  holidays: [
                    ...c.hours.holidays,
                    { id: uid(), date: new Date().toISOString().slice(0, 10), label: "Holiday", closed: true },
                  ],
                },
              }))
            }
            className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.16em]"
          >
            Add date
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {hours.holidays.map((h) => (
            <div key={h.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-3">
              <Input
                value={h.label}
                className="w-44"
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    hours: {
                      ...c.hours,
                      holidays: c.hours.holidays.map((x) => (x.id === h.id ? { ...x, label: e.target.value } : x)),
                    },
                  }))
                }
              />
              <Input
                type="date"
                value={h.date}
                className="w-44"
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    hours: {
                      ...c.hours,
                      holidays: c.hours.holidays.map((x) => (x.id === h.id ? { ...x, date: e.target.value } : x)),
                    },
                  }))
                }
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Closed
                <Switch
                  checked={h.closed}
                  onCheckedChange={(closed) =>
                    update((c) => ({
                      ...c,
                      hours: {
                        ...c.hours,
                        holidays: c.hours.holidays.map((x) => (x.id === h.id ? { ...x, closed } : x)),
                      },
                    }))
                  }
                />
              </div>
              <button
                onClick={() =>
                  update((c) => ({
                    ...c,
                    hours: { ...c.hours, holidays: c.hours.holidays.filter((x) => x.id !== h.id) },
                  }))
                }
                className="ml-auto rounded p-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
