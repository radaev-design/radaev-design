
import { BRAND, SERVICES, formatPrice } from '../../../config/catalog';
import { haptic } from '../../integrations/telegram';
import { useCart } from '../../storage/cart';
import { openLink } from '../../ui/utils';
import { useToast } from '../../ui/Toast';
import { MascotGuide } from '../../ui/MascotGuide';

export function OrdersScreen({ onCatalog }: { onCatalog: () => void }) {
  const { ids, remove, clear } = useCart();
  const { toast } = useToast();

  const items = ids
    .map((id) => SERVICES.find((s) => s.id === id))
    .filter(Boolean) as typeof SERVICES;

  if (!items.length) {
    return (
      <div className="screen empty">
        <MascotGuide
          pose="sad"
          size={160}
          text="Твой заказ пока пуст. Давай найдём что-нибудь интересное!"
        />

        <h2>Пока пусто</h2>

        <p>Выберите услугу в каталоге, и она появится здесь.</p>

        <button
          className="btn"
          onClick={() => {
            haptic();
            onCatalog();
          }}
        >
          Перейти в каталог
        </button>
      </div>
    );
  }

  const text =
    'Здравствуйте! Хочу заказать:\n' +
    items.map((s, i) => `${i + 1}. ${s.title}`).join('\n');

  return (
    <div className="screen">
      <h1>Заказы</h1>

      <MascotGuide
        pose="think"
        size={90}
        compact
        text="Проверь выбранные услуги. Если всё готово — отправляй заявку менеджеру!"
      />

      <p className="muted">
        Выбранные услуги. Сейчас заявка отправляется менеджеру
        в Telegram, стоимость и оплату согласуете в чате.
      </p>

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

      <button
        className="btn svc-btn"
        style={{ width: '100%' }}
        onClick={() => {
          haptic('medium');
          toast('Открываем менеджера в Telegram', 'info');

          openLink(
            `${BRAND.managerUrl}?text=${encodeURIComponent(text)}`,
          );
        }}
      >
        Отправить менеджеру
      </button>

      <button
        className="btn secondary svc-btn"
        style={{ width: '100%', marginTop: 10 }}
        onClick={() => {
          haptic();
          clear();
          toast('Заказ очищен', 'success');
        }}
      >
        Очистить
      </button>
    </div>
  );
}
