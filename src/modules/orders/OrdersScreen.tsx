import { useCallback, useEffect, useMemo, useState } from 'react';
import { BRAND, SERVICES } from '../../../config/catalog';
import { api, Order } from '../../api';
import { haptic, openLink } from '../../integrations/telegram';
import { useCart } from '../../storage/cart';
import { Button } from '../../ui/Button';
import { Mascot } from '../../ui/Mascot';
import { useToast } from '../../ui/Toast';

const STATUS = { pending: 'Ожидает оплаты', paid: 'Оплачен ✓', canceled: 'Отменён' };
const rub = (n: number) => `${n.toLocaleString('ru-RU')} ${BRAND.currency}`;

export function OrdersScreen({ onCatalog }: { onCatalog: () => void }) {
  const { ids, remove, clear } = useCart();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api.orders().then(setOrders).catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const v = () => document.visibilityState === 'visible' && load();
    document.addEventListener('visibilitychange', v);
    return () => document.removeEventListener('visibilitychange', v);
  }, [load]);

  const hasPending = orders.some((o) => o.status === 'pending');
  useEffect(() => {
    if (!hasPending) return;
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [hasPending, load]);

  const items = useMemo(
    () =>
      ids.flatMap((id) => {
        const s = SERVICES.find((x) => x.id === id);
        return s ? [s] : [];
      }),
    [ids],
  );
  const payable = items.length > 0 && items.every((s) => s.priceFrom != null);
  const total = items.reduce((a, s) => a + (s.priceFrom ?? 0), 0);

  const pay = async () => {
    haptic('medium');
    setBusy(true);
    try {
      const r = await api.createOrder(ids, comment);
      clear();
      setComment('');
      load();
      openLink(r.payUrl);
    } catch {
      toast('Не удалось создать оплату. Попробуйте позже', 'error');
    } finally {
      setBusy(false);
    }
  };

  const toManager = () => {
    haptic('medium');
    const text = 'Здравствуйте! Хочу заказать:\n' + items.map((s, i) => `${i + 1}. ${s.title}`).join('\n') + (comment ? '\n' + comment : '');
    openLink(`${BRAND.managerUrl}?text=${encodeURIComponent(text)}`);
  };

  if (!items.length && !orders.length) {
    return (
      <div className="screen empty">
        <Mascot pose="think" size={130} />
        <h2>Пока пусто</h2>
        <p>Выберите услугу в каталоге, и она появится здесь.</p>
        <Button
          onClick={() => {
            haptic();
            onCatalog();
          }}
        >
          Перейти в каталог
        </Button>
      </div>
    );
  }

  return (
    <div className="screen">
      <h1>Заказы</h1>

      {items.length > 0 && (
        <>
          <p className="muted">
            {payable ? 'Оплатите заказ онлайн: после оплаты менеджер получит заявку.' : 'У части услуг цена индивидуальная: заявка уйдёт менеджеру.'}
          </p>
          {items.map((s) => (
            <div key={s.id} className="card svc row">
              <div>
                <h3>{s.title}</h3>
                <div className="price">{s.priceFrom != null ? rub(s.priceFrom) : BRAND.priceFallback}</div>
              </div>
              <button
                className="x"
                aria-label="Убрать"
                onClick={() => {
                  haptic();
                  remove(s.id);
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <textarea className="cmt" placeholder="Комментарий к заказу (необязательно)" maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} />
          {payable && (
            <div className="ord-total">
              <span>Итого</span>
              <span>{rub(total)}</span>
            </div>
          )}
          {payable ? (
            <Button block className="svc-btn" disabled={busy} onClick={pay}>
              {busy ? 'Создаём оплату…' : `Оплатить ${rub(total)}`}
            </Button>
          ) : (
            <Button block className="svc-btn" onClick={toManager}>
              Отправить менеджеру
            </Button>
          )}
          <Button
            block
            variant="secondary"
            className="svc-btn"
            style={{ marginTop: 10 }}
            onClick={() => {
              haptic();
              clear();
            }}
          >
            Очистить
          </Button>
        </>
      )}

      {orders.length > 0 && (
        <>
          <h2>Мои заказы</h2>
          {orders.map((o) => (
            <div key={o.id} className="card ord">
              <div className="ord-head">
                <b>
                  #{o.id.slice(0, 8)} · {new Date(o.createdAt).toLocaleDateString('ru-RU')}
                </b>
                <span className={'st-pill ' + o.status}>{STATUS[o.status]}</span>
              </div>
              <ul>
                {o.items.map((i) => (
                  <li key={i.id}>{i.title}</li>
                ))}
              </ul>
              <div className="ord-sum">{rub(o.amount)}</div>
              {o.status === 'paid' && (
                <div className="ord-head">
                  <p className="muted" style={{ margin: 0 }}>
                    Заказ принят. Менеджер скоро свяжется с вами.
                  </p>
                  <Mascot pose="success" size={64} />
                </div>
              )}
              {o.status === 'pending' && (
                <Button className="svc-btn" onClick={() => openLink(o.payUrl)}>
                  Оплатить
                </Button>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
