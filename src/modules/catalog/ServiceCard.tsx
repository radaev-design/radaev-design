import { BRAND, formatPrice, Service } from '../../../config/catalog';
import { haptic, openLink } from '../../integrations/telegram';
import { useCart } from '../../storage/cart';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { fly } from '../../ui/utils';

export function ServiceCard({ s, className = '' }: { s: Service; className?: string }) {
  const { has, add, remove } = useCart();
  const { toast } = useToast();

  return (
    <div className={'card svc ' + className}>
      {s.comingSoon ? (
        <span className="badge">COMING SOON</span>
      ) : (
        s.popular && <span className="badge pop">ПОПУЛЯРНО</span>
      )}
      <h3>{s.title}</h3>
      <p>{s.description}</p>
      <div className="price">{formatPrice(s)}</div>

      {s.comingSoon ? (
        <Button
          variant="secondary"
          className="svc-btn"
          onClick={() => {
            haptic('medium');
            toast('Открываем менеджера для предзаказа', 'info');
            openLink(`${BRAND.managerUrl}?text=${encodeURIComponent('Хочу оформить предзаказ: ' + s.title)}`);
          }}
        >
          Оформить предзаказ
        </Button>
      ) : has(s.id) ? (
        <Button
          variant="secondary"
          className="svc-btn"
          onClick={() => {
            haptic();
            remove(s.id);
            toast('Услуга удалена из заказа', 'info');
          }}
        >
          ✓ В заказе · убрать
        </Button>
      ) : (
        <Button
          className="svc-btn"
          onClick={(e) => {
            haptic('medium');
            fly(e.currentTarget);
            add(s.id);
            toast('Услуга добавлена в заказ', 'success');
          }}
        >
          Заказать
        </Button>
      )}
    </div>
  );
}
