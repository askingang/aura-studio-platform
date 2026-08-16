import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface BookingSeed {
  serviceId?: string;
  packageId?: string;
  employeeId?: string;
}

interface BookingCtx {
  open: boolean;
  seed: BookingSeed;
  openBooking: (seed?: BookingSeed) => void;
  closeBooking: () => void;
}

const Ctx = createContext<BookingCtx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState<BookingSeed>({});

  const value = useMemo<BookingCtx>(
    () => ({
      open,
      seed,
      openBooking: (s = {}) => {
        setSeed(s);
        setOpen(true);
      },
      closeBooking: () => setOpen(false),
    }),
    [open, seed],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
