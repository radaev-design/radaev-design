import { useMemo } from 'react';
import { BRAND, formatPrice, SERVICES } from '../../../config/catalog';
import { haptic, openLink } from '../../integrations/telegram';
import { useCart } from '../../storage/cart';
import { Button } from '../../ui/Button';
import { Mascot } from '../../ui/Mascot';
import { useToast } from '../../ui/Toast';

export function OrdersScreen({ onCatalog }: { onCatalog: () => void }) {
  const { ids, remove, clear } = useCart();
  const { toast } = useToast();

  const items = useMemo(
    () =>
      ids.flatMap((id) => {
        const s = SERVICES.find((x) => x.id === id);
        return s ? [s] : [];
      }),
    [ids],
  );

  if (!items.length) {
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

  const text = 'Здравствуйте! Хочу заказать:\n' + items.map((s, i) => `${i + 1}. ${s.title}`).join('\n');

  return (
    <div className="screen">
      <h1>Заказы</h1>
      <p className="muted">Заявка отправляется менеджеру в Telegram, стоимость и оплату согласуете в чате.</p>

      {items.map((s) => (
        <div key={s.id} className="card svc row">
          <div>
            <h3>{s.title}</h3>
            <div className="price">{formatPrice(s)}</div>
          </div>
          <button
            className="x"
            aria-label="Убрать"
            onClick={() => {
              haptic();
              remove(s.id);
              toast('Услуга удалена из заказа', 'info');
            }}
          >
            ✕
          </button>
        </div>
      ))}

      <Button
        block
        className="svc-btn"
        onClick={() => {
          haptic('medium');
          toast('Открываем менеджера в Telegram', 'info');
          openLink(`${BRAND.managerUrl}?text=${encodeURIComponent(text)}`);
        }}
      >
        Отправить менеджеру
      </Button>
      <Button
        block
        variant="secondary"
        className="svc-btn"
        onClick={() => {
          haptic();
          clear();
          toast('Заказ очищен', 'success');
        }}
      >
        Очистить
      </Button>
    </div>
  );
}
