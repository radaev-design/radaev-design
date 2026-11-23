import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { SERVICES } from '../../config/catalog';
import { read, write } from './ls';

interface Cart {
  ids: string[];
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}
const Ctx = createContext<Cart | null>(null);
const KEY = 'cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    const raw = read<unknown>(KEY, []);
    if (!Array.isArray(raw)) return [];
    return raw.filter((id) => SERVICES.some((s) => s.id === id && s.active && !s.comingSoon));
  });
  useEffect(() => write(KEY, ids), [ids]);

  const value = useMemo<Cart>(
    () => ({
      ids,
      has: (id) => ids.includes(id),
      add: (id) => setIds((p) => (p.includes(id) ? p : [...p, id])),
      remove: (id) => setIds((p) => p.filter((x) => x !== id)),
      clear: () => setIds([]),
    }),
    [ids],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
}
