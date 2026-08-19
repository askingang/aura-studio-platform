import { useEffect, useState } from "react";
import type { OpeningHours } from "./types";

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

export interface OpenStatus {
  open: boolean;
  todayLabel: string;
  closedToday: boolean;
}

export function getOpenStatus(hours: OpeningHours, now = new Date()): OpenStatus {
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const holiday = hours.holidays.find((h) => h.date === iso);
  const day = hours.days[now.getDay()] ?? { closed: true, periods: [] };

  let periods = day.closed ? [] : day.periods;
  if (holiday) {
    periods = holiday.closed ? [] : [{ open: holiday.open ?? "10:00", close: holiday.close ?? "18:00" }];
  }

  const mins = now.getHours() * 60 + now.getMinutes();
  const open = periods.some((p) => mins >= toMinutes(p.open) && mins < toMinutes(p.close));
  const todayLabel = periods.length
    ? periods.map((p) => `${p.open} – ${p.close}`).join(", ")
    : "—";

  return { open, todayLabel, closedToday: periods.length === 0 };
}

export const formatDay = (d: { closed: boolean; periods: { open: string; close: string }[] }) =>
  d.closed || d.periods.length === 0 ? "—" : d.periods.map((p) => `${p.open} – ${p.close}`).join(", ");

export const formatPrice = (value: number) =>
  "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(value));

/** Hydration-safe open status: deterministic on first render, live after mount. */
export function useOpenStatus(hours: OpeningHours): OpenStatus {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return getOpenStatus(hours, now ?? new Date(0));
}
