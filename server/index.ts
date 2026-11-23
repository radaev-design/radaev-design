import { createServer, IncomingMessage } from 'node:http';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { BRAND, SERVICES } from '../config/catalog';

const E = process.env;
const need = (k: string) => {
  const v = E[k];
  if (!v) throw new Error('Не задана переменная ' + k);
  return v;
};
const CLIENT_TOKEN = need('CLIENT_BOT_TOKEN');
const ADMIN_TOKEN = need('ADMIN_BOT_TOKEN');
const ADMIN_CHAT = need('ADMIN_CHAT_ID');
const PG_ID = need('PLATEGA_MERCHANT_ID');
const PG_SECRET = need('PLATEGA_SECRET');
const ORIGIN = need('WEBAPP_ORIGIN'); // https://имя.github.io
const RETURN_URL = E.RETURN_URL; // https://t.me/mododesign_bot/app?startapp=orders
const PORT = Number(E.PORT || 3000);

interface Order {
  id: string;
  userId: number;
  userName: string;
  items: { id: string; title: string; price: number }[];
  amount: number;
  comment: string;
  status: 'pending' | 'paid' | 'canceled';
  payUrl: string;
  txId?: string;
  createdAt: number;
  paidAt?: number;
}

const DB = 'server/data/orders.json';
mkdirSync('server/data', { recursive: true });
const orders: Order[] = existsSync(DB) ? JSON.parse(readFileSync(DB, 'utf8')) : [];
const save = () => writeFileSync(DB, JSON.stringify(orders, null, 2));

function verify(h?: string) {
  if (!h?.startsWith('tma ')) return null;
  const p = new URLSearchParams(h.slice(4));
  const hash = p.get('hash');
  if (!hash) return null;
  p.delete('hash');
  const str = [...p.entries()].map(([k, v]) => `${k}=${v}`).sort().join('\n');
  const key = createHmac('sha256', 'WebAppData').update(CLIENT_TOKEN).digest();
  const calc = createHmac('sha256', key).update(str).digest('hex');
  if (calc.length !== hash.length || !timingSafeEqual(Buffer.from(calc), Buffer.from(hash))) return null;
  if (Date.now() / 1000 - Number(p.get('auth_date')) > 86400) return null;
  return JSON.parse(p.get('user') || 'null') as { id: number; first_name: string; username?: string } | null;
}

const tg = (token: string, chat: string | number, text: string) =>
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text }),
  }).catch(() => {});

const readBody = (req: IncomingMessage) =>
  new Promise<any>((ok) => {
    let d = '';
    req.on('data', (c) => {
      d += c;
      if (d.length > 1e5) req.destroy();
    });
    req.on('end', () => {
      try {
        ok(JSON.parse(d || '{}'));
      } catch {
        ok({});
      }
    });
  });

const short = (id: string) => id.slice(0, 8);

createServer(async (req, res) => {
  const send = (code: number, data?: unknown) => {
    res.writeHead(code, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ORIGIN,
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    res.end(data === undefined ? '' : JSON.stringify(data));
  };
  try {
    const url = (req.url || '').split('?')[0];
    if (req.method === 'OPTIONS') return send(204);

    // Callback от Platega
    if (url === '/api/platega/callback' && req.method === 'POST') {
      if (req.headers['x-merchantid'] !== PG_ID || req.headers['x-secret'] !== PG_SECRET) return send(401);
      const b = await readBody(req);
      const o = orders.find((x) => x.id === b.payload);
      if (o && o.status === 'pending') {
        if (b.status === 'CONFIRMED' && (b.amount === undefined || Number(b.amount) >= o.amount)) {
          o.status = 'paid';
          o.paidAt = Date.now();
          save();
          const list = o.items.map((i, n) => `${n + 1}. ${i.title}`).join('\n');
          await tg(
            ADMIN_TOKEN,
            ADMIN_CHAT,
            `✅ Оплачен заказ #${short(o.id)}\nКлиент: ${o.userName} (id ${o.userId})\nСумма: ${o.amount} ${BRAND.currency}\n${list}\nКомментарий: ${o.comment || '—'}`,
          );
          await tg(
            CLIENT_TOKEN,
            o.userId,
            `Оплата прошла ✅ Заказ #${short(o.id)} принят. Менеджер скоро свяжется с вами: ${BRAND.managerUrl}`,
          );
        } else if (b.status === 'CANCELED') {
          o.status = 'canceled';
          save();
        }
      }
      return send(200, { ok: true });
    }

    const u = verify(req.headers.authorization);
    if (!u) return send(401, { error: 'auth' });

    if (url === '/api/orders' && req.method === 'GET') {
      return send(
        200,
        orders.filter((o) => o.userId === u.id).sort((a, b) => b.createdAt - a.createdAt).map(({ txId, ...o }) => o),
      );
    }

    if (url === '/api/order' && req.method === 'POST') {
      const b = await readBody(req);
      const ids: string[] = [...new Set<string>(Array.isArray(b.items) ? b.items : [])];
      const items = ids.flatMap((id) => {
        const s = SERVICES.find((x) => x.id === id);
        return s && s.active && !s.comingSoon && s.priceFrom != null ? [{ id, title: s.title, price: s.priceFrom }] : [];
      });
      if (!items.length || items.length !== ids.length) return send(400, { error: 'items' });
      const id = randomUUID();
      const amount = items.reduce((a, i) => a + i.price, 0);
      const r = await fetch('https://app.platega.io/v2/transaction/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-MerchantId': PG_ID, 'X-Secret': PG_SECRET },
        body: JSON.stringify({
          paymentDetails: { amount, currency: 'RUB' },
          description: `Заказ ${short(id)}`,
          payload: id,
          return: RETURN_URL,
          failedUrl: RETURN_URL,
        }),
      });
      const j: any = await r.json().catch(() => ({}));
      const payUrl = j.redirect || j.url;
      if (!r.ok || !payUrl) {
        console.error('Platega', r.status, j);
        return send(502, { error: 'payment' });
      }
      orders.push({
        id,
        userId: u.id,
        userName: u.first_name + (u.username ? ` @${u.username}` : ''),
        items,
        amount,
        comment: String(b.comment || '').slice(0, 500),
        status: 'pending',
        payUrl,
        txId: j.transactionId,
        createdAt: Date.now(),
      });
      save();
      return send(200, { orderId: id, payUrl });
    }

    send(404, { error: 'not found' });
  } catch (e) {
    console.error(e);
    send(500, { error: 'server' });
  }
}).listen(PORT, () => console.log('API on :' + PORT));
