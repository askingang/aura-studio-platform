import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEMO_CONTENT } from "./demo";
import { applyTheme } from "./themes";
import type { SiteContent } from "./types";

const KEY = "maison-content-v2";

type Updater = (prev: SiteContent) => SiteContent;

interface StoreCtx {
  content: SiteContent;
  update: (fn: Updater) => void;
  set: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
  reset: () => void;
  hydrated: boolean;
}

const Ctx = createContext<StoreCtx | null>(null);

function merge(base: SiteContent, saved: Partial<SiteContent>): SiteContent {
  return {
    ...base,
    ...saved,
    profile: { ...base.profile, ...(saved.profile ?? {}) },
    theme: { ...base.theme, ...(saved.theme ?? {}) },
    hours: { ...base.hours, ...(saved.hours ?? {}) },
  };
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEMO_CONTENT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setContent(merge(DEMO_CONTENT, JSON.parse(raw)));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    applyTheme(content.theme);
  }, [content.theme]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(content));
    } catch {
      /* quota */
    }
  }, [content, hydrated]);

  const update = useCallback((fn: Updater) => setContent((prev) => fn(prev)), []);
  const set = useCallback(
    <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
      setContent((prev) => ({ ...prev, [key]: value })),
    [],
  );
  const reset = useCallback(() => {
    localStorage.removeItem(KEY);
    setContent(DEMO_CONTENT);
  }, []);

  const value = useMemo(
    () => ({ content, update, set, reset, hydrated }),
    [content, update, set, reset, hydrated],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}

export const byOrder = <T extends { order: number }>(list: T[]) =>
  [...list].sort((a, b) => a.order - b.order);

export const activeItems = <T extends { enabled: boolean; order: number }>(list: T[]) =>
  byOrder(list.filter((i) => i.enabled));

export const uid = () => Math.random().toString(36).slice(2, 10);

export function isPromoLive(p: { startDate: string; endDate: string }, now = new Date()) {
  const end = new Date(p.endDate + "T23:59:59");
  const start = new Date(p.startDate + "T00:00:00");
  return now >= start && now <= end;
}
