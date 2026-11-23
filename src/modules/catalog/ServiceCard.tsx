import { BRAND, formatPrice, Service } from '../../../config/catalog';
import { haptic, openLink } from '../../integrations/telegram';
import { useCart } from '../../storage/cart';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { fly } from '../../ui/utils';

export function ServiceCard({ s, n, className = '' }: { s: Service; n?: number; className?: string }) {
  const { has, add, remove } = useCart();
  const { toast } = useToast();
  const badge = s.badge ?? (s.comingSoon ? 'скоро' : s.popular ? 'хит' : undefined);

  return (
    <div className={'sc ' + className}>
      <div className="sc-main">
        <div className="sc-top">
          <span className="sc-num">{String(n ?? 0).padStart(2, '0')}</span>
          {badge && <span className="sc-badge">{badge}</span>}
        </div>
        <h3 className="sc-title">{s.title}</h3>
        <p className="sc-desc">{s.description}</p>
        <div className={'sc-price' + (s.priceFrom == null ? ' small' : '')}>{formatPrice(s)}</div>
      </div>

      <div className="sc-foot">
        {s.slogan && <div className="sc-slogan">{s.slogan}</div>}
        {s.hint && <div className="sc-hint">{s.hint}</div>}
        {s.comingSoon ? (
          <Button
            variant="secondary"
            className="sc-btn"
            onClick={() => {
              haptic('medium');
              toast('Открываем менеджера для предзаказа', 'info');
              openLink(`${BRAND.managerUrl}?text=${encodeURIComponent('Хочу оформить предзаказ: ' + s.title)}`);
            }}
          >
            предзаказ
          </Button>
        ) : has(s.id) ? (
          <Button
            variant="secondary"
            className="sc-btn"
            onClick={() => {
              haptic();
              remove(s.id);
              toast('Услуга удалена из заказа', 'info');
            }}
          >
            ✓ в заказе · убрать
          </Button>
        ) : (
          <Button
            className="sc-btn"
            onClick={(e) => {
              haptic('medium');
              fly(e.currentTarget);
              add(s.id);
              toast('Услуга добавлена в заказ', 'success');
            }}
          >
            беру
          </Button>
        )}
      </div>
    </div>
  );
}
