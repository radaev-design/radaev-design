import { getInitData } from './integrations/telegram';

export interface Order {
  id: string;
  items: { id: string; title: string; price: number }[];
  subtotal: number;
  discount: number;
  promo?: string;
  amount: number;
  comment: string;
  status: 'pending' | 'paid' | 'canceled';
  payUrl: string;
  createdAt: number;
  paidAt?: number;
}

export interface Me {
  points: number;
  todayPts: number;
  dailyCap: number;
  activePromo: { code: string; percent: number } | null;
  canBuyAt: number;
  codes: { code: string; percent: number; expiresAt: number; used: boolean }[];
  reactions: Record<string, string>;
}

const BASE = import.meta.env.VITE_API_URL as string | undefined;

async function call<T>(path: string, body?: unknown): Promise<T> {
  if (!BASE) throw new Error('no-api');
  const r = await fetch(BASE + path, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'tma ' + getInitData() },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error || String(r.status));
  }
  return r.json();
}

export const api = {
  me: () => call<Me>('/api/me'),
  orders: () => call<Order[]>('/api/orders'),
  createOrder: (items: string[], comment: string) =>
    call<{ orderId: string; payUrl: string }>('/api/order', { items, comment }),
  award: (game: string, result: string) =>
    call<{ points: number; todayPts: number; gained: number; capped: boolean }>('/api/points', { game, result }),
  buy: (tier: string) => call<{ code: string }>('/api/promo/buy', { tier }),
  activate: (code: string) => call<{ ok: boolean; percent: number }>('/api/promo/activate', { code }),
  react: (story: string, emoji: string) => call<{ emoji: string }>('/api/react', { story, emoji }),
};
