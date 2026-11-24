import { createServer, IncomingMessage } from 'node:http';
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { BRAND, SERVICES } from '../config/catalog';
import { calcDiscount, ECONOMY, PROMOS } from '../config/economy';
import { REACTIONS, STORIES } from '../config/stories';

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
const ORIGIN = need('WEBAPP_ORIGIN');
const RETURN_URL = E.RETURN_URL;
const PORT = Number(E.PORT || 3000);
const DAY = 86400000;

interface Order {
  id: string;
  userId: number;
  userName: string;
  items: { id: string; title: string; price: number }[];
  subtotal: number;
  discount: number;
  promo?: string;
  amount: number;
  comment: string;
  status: 'pending' | 'paid' | 'canceled';
  payUrl: string;
  txId?: string;
  createdAt: number;
  paidAt?: number;
}
interface User {
  points: number;
  day: string;
  todayPts: number;
  lastAward: number;
  lastPromoAt: number;
  activePromo?: { code: string; percent: number };
}
interface Code { code: string; userId: number; percent: number; expiresAt: number; used: boolean }
interface DB {
  orders: Order[];
  users: Record<string, User>;
  codes: Code[];
  reactions: Record<string, Record<string, string>>;
  promoUse: Record<string, number[]>;
}

const FILE = 'server/data/db.json';
mkdirSync('server/data', { recursive: true });
const db: DB = {
  orders: [],
  users: {},
  codes: [],
  reactions: {},
  promoUse: {},
  ...(existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {}),
};
const save = () => writeFileSync(FILE, JSON.stringify(db));

const today = () => new Date().toISOString().slice(0, 10);
const user = (id: number) => (db.users[id] ??= { points: 0, day: '', todayPts: 0, lastAward: 0, lastPromoAt: 0 });
const roll = (u: User) => {
  if (u.day !== today()) {
    u.day = today();
    u.todayPts = 0;
  }
};

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

function checkPromo(uid: number, raw: string): { code: string; percent: number; earned?: Code } | string {
  const code = String(raw).trim().toUpperCase();
  const c = db.codes.find((x) => x.code === code && x.userId === uid);
  if (c) return c.used ? 'used' : c.expiresAt < Date.now() ? 'expired' : { code, percent: c.percent, earned: c };
  const p = PROMOS.find((x) => x.code === code);
  if (!p) return 'invalid';
  if (p.expires && Date.now() > new Date(p.expires + 'T23:59:59').getTime()) return 'expired';
  const uses = db.promoUse[code] ?? [];
  if (uses.includes(uid)) return 'used';
  if (p.maxUses && uses.length >= p.maxUses) return 'max';
  return { code, percent: p.percent };
}

function stats() {
  const paid = db.orders.filter((o) => o.status === 'paid');
  const rx: Record<string, Record<string, number>> = {};
  for (const r of Object.values(db.reactions))
    for (const [s, e] of Object.entries(r)) {
      rx[s] ??= {};
      rx[s][e] = (rx[s][e] || 0) + 1;
    }
  const rxText = STORIES.map(
    (s) => `${s.name}: ` + (Object.entries(rx[s.id] ?? {}).map(([e, n]) => `${e}${n}`).join(' ') || '—'),
  ).join('\n');
  return (
    `📊 Статистика\nЗаказов: ${db.orders.length}, оплачено: ${paid.length}\n` +
    `Выручка: ${paid.reduce((a, o) => a + o.amount, 0)} ${BRAND.currency}\n` +
    `Скидок выдано: ${paid.reduce((a, o) => a + (o.discount || 0), 0)} ${BRAND.currency}\n` +
    `Промокодов выпущено: ${db.codes.length}, использовано: ${db.codes.filter((c) => c.used).length}\n` +
    `Игроков: ${Object.keys(db.users).length}\n\nРеакции:\n${rxText}`
  );
}

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
  const fail = (error: string) => send(400, { error });
  try {
    const url = (req.url || '').split('?')[0];
    if (req.method === 'OPTIONS') return send(204);

    // Callback от Platega
    if (url === '/api/platega/callback' && req.method === 'POST') {
      if (req.headers['x-merchantid'] !== PG_ID || req.headers['x-secret'] !== PG_SECRET) return send(401);
      const b = await readBody(req);
      const o = db.orders.find((x) => x.id === b.payload);
      if (o && o.status === 'pending') {
        if (b.status === 'CONFIRMED' && (b.amount === undefined || Number(b.amount) >= o.amount)) {
          o.status = 'paid';
          o.paidAt = Date.now();
          save();
          const list = o.items.map((i, n) => `${n + 1}. ${i.title}`).join('\n');
          await tg(
            ADMIN_TOKEN,
            ADMIN_CHAT,
            `✅ Оплачен заказ #${short(o.id)}\nКлиент: ${o.userName} (id ${o.userId})\nСумма: ${o.amount} ${BRAND.currency}` +
              (o.discount ? ` (скидка ${o.discount}, ${o.promo})` : '') +
              `\n${list}\nКомментарий: ${o.comment || '—'}`,
          );
          await tg(
            CLIENT_TOKEN,
            o.userId,
            `Оплата прошла ✅ Заказ #${short(o.id)} принят. Менеджер скоро свяжется с вами: ${BRAND.managerUrl}`,
          );
        } else if (b.status === 'CANCELED') {
          o.status = 'canceled';
          if (o.promo) {
            const c = db.codes.find((x) => x.code === o.promo);
            if (c) c.used = false;
            else db.promoUse[o.promo] = (db.promoUse[o.promo] ?? []).filter((x) => x !== o.userId);
          }
          save();
        }
      }
      return send(200, { ok: true });
    }

    const tu = verify(req.headers.authorization);
    if (!tu) return send(401, { error: 'auth' });
    const uid = tu.id;
    const u = user(uid);
    roll(u);

    if (url === '/api/me' && req.method === 'GET') {
      return send(200, {
        points: u.points,
        todayPts: u.todayPts,
        dailyCap: ECONOMY.dailyCap,
        activePromo: u.activePromo ?? null,
        canBuyAt: u.lastPromoAt + ECONOMY.promoCooldownDays * DAY,
        codes: db.codes.filter((c) => c.userId === uid).map(({ userId, ...c }) => c),
        reactions: db.reactions[uid] ?? {},
      });
    }

    if (url === '/api/orders' && req.method === 'GET') {
      return send(
        200,
        db.orders.filter((o) => o.userId === uid).sort((a, b) => b.createdAt - a.createdAt).map(({ txId, ...o }) => o),
      );
    }

    if (url === '/api/react' && req.method === 'POST') {
      const b = await readBody(req);
      if (!STORIES.some((s) => s.id === b.story) || !REACTIONS.includes(b.emoji)) return fail('invalid');
      const r = (db.reactions[uid] ??= {});
      r[b.story] ??= b.emoji; // первая реакция фиксируется
      save();
      return send(200, { emoji: r[b.story] });
    }

    if (url === '/api/points' && req.method === 'POST') {
      const b = await readBody(req);
      const pts = ECONOMY.awards[String(b.game)]?.[String(b.result)];
      if (!pts) return fail('invalid');
      const now = Date.now();
      let gained = 0;
      let capped = false;
      if (now - u.lastAward >= ECONOMY.cooldownSec * 1000) {
        gained = Math.max(0, Math.min(pts, ECONOMY.dailyCap - u.todayPts));
        capped = gained < pts;
        u.lastAward = now;
        u.points += gained;
        u.todayPts += gained;
        save();
      }
      return send(200, { points: u.points, todayPts: u.todayPts, gained, capped });
    }

    if (url === '/api/promo/buy' && req.method === 'POST') {
      const b = await readBody(req);
      const tier = ECONOMY.tiers.find((t) => t.id === b.tier);
      if (!tier) return fail('invalid');
      if (u.points < tier.cost) return fail('points');
      if (Date.now() < u.lastPromoAt + ECONOMY.promoCooldownDays * DAY) return fail('cooldown');
      const code = 'MODO-' + randomBytes(4).toString('hex').toUpperCase();
      u.points -= tier.cost;
      u.lastPromoAt = Date.now();
      db.codes.push({ code, userId: uid, percent: tier.percent, expiresAt: Date.now() + ECONOMY.promoValidDays * DAY, used: false });
      save();
      return send(200, { code });
    }

    if (url === '/api/promo/activate' && req.method === 'POST') {
      const b = await readBody(req);
      const r = checkPromo(uid, b.code);
      if (typeof r === 'string') return fail(r);
      u.activePromo = { code: r.code, percent: r.percent };
      save();
      return send(200, { ok: true, percent: r.percent });
    }

    if (url === '/api/order' && req.method === 'POST') {
      const b = await readBody(req);
      const ids: string[] = [...new Set<string>(Array.isArray(b.items) ? b.items : [])];
      const items = ids.flatMap((id) => {
        const s = SERVICES.find((x) => x.id === id);
        return s && s.active && !s.comingSoon && s.priceFrom != null ? [{ id, title: s.title, price: s.priceFrom }] : [];
      });
      if (!items.length || items.length !== ids.length) return fail('items');

      const id = randomUUID();
      const subtotal = items.reduce((a, i) => a + i.price, 0);
      let discount = 0;
      let promo: ReturnType<typeof checkPromo> | null = null;
      if (u.activePromo) {
        promo = checkPromo(uid, u.activePromo.code);
        if (typeof promo !== 'string') discount = calcDiscount(subtotal, promo.percent);
      }
      const amount = subtotal - discount;

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

      let usedPromo: string | undefined;
      if (discount > 0 && promo && typeof promo !== 'string') {
        usedPromo = promo.code;
        if (promo.earned) promo.earned.used = true;
        else (db.promoUse[promo.code] ??= []).push(uid);
        u.activePromo = undefined;
      }
      db.orders.push({
        id,
        userId: uid,
        userName: tu.first_name + (tu.username ? ` @${tu.username}` : ''),
        items,
        subtotal,
        discount,
        promo: usedPromo,
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

// Команда /stats в админ-боте
(async function poll() {
  let offset = 0;
  for (;;) {
    try {
      const r: any = await (await fetch(`https://api.telegram.org/bot${ADMIN_TOKEN}/getUpdates?timeout=30&offset=${offset}`)).json();
      for (const upd of r.result ?? []) {
        offset = upd.update_id + 1;
        const m = upd.message;
        if (m?.text?.startsWith('/stats') && String(m.chat.id) === ADMIN_CHAT) await tg(ADMIN_TOKEN, ADMIN_CHAT, stats());
      }
    } catch {
      await new Promise((ok) => setTimeout(ok, 5000));
    }
  }
})();
