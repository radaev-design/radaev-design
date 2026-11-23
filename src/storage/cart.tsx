import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface Cart { ids: string[]; has: (id: string) => boolean; add: (id: string) => void; remove: (id: string) => void; clear: () => void }
const Ctx = createContext<Cart>({ ids: [], has: () => false, add: () => {}, remove: () => {}, clear: () => {} });
const KEY = 'cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* no-op */ }
  }, [ids]);
  const value: Cart = {
    ids,
    has: (id) => ids.includes(id),
    add: (id) => setIds((p) => (p.includes(id) ? p : [...p, id])),
    remove: (id) => setIds((p) => p.filter((x) => x !== id)),
    clear: () => setIds([]),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useCart = () => useContext(Ctx);
