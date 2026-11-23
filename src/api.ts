import { getInitData } from './integrations/telegram';

export interface Order {
  id: string;
  items: { id: string; title: string; price: number }[];
  amount: number;
  comment: string;
  status: 'pending' | 'paid' | 'canceled';
  payUrl: string;
  createdAt: number;
  paidAt?: number;
}

const BASE = import.meta.env.VITE_API_URL as string | undefined;

async function call<T>(path: string, body?: unknown): Promise<T> {
  if (!BASE) throw new Error('VITE_API_URL не задан');
  const r = await fetch(BASE + path, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'tma ' + getInitData() },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

export const api = {
  orders: () => call<Order[]>('/api/orders'),
  createOrder: (items: string[], comment: string) =>
    call<{ orderId: string; payUrl: string }>('/api/order', { items, comment }),
};
