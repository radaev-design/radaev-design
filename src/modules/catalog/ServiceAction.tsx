import { BRAND, Service } from '../../../config/catalog';
import { haptic, openLink } from '../../integrations/telegram';
import { useCart } from '../../storage/cart';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { fly } from '../../ui/utils';

export function ServiceAction({ s, big, onDone }: { s: Service; big?: boolean; onDone?: () => void }) {
  const { has, add, remove } = useCart();
  const { toast } = useToast();
  const cls = big ? 'svc-btn' : 'sc-btn';

  if (s.comingSoon)
    return (
      <Button
        block={big}
        variant="secondary"
        className={cls}
        onClick={() => {
          haptic('medium');
          toast('Открываем менеджера для предзаказа', 'info');
          openLink(`${BRAND.managerUrl}?text=${encodeURIComponent('Хочу оформить предзаказ: ' + s.title)}`);
        }}
      >
        {big ? 'Оформить предзаказ' : 'предзаказ'}
      </Button>
    );

  if (has(s.id))
    return (
      <Button
        block={big}
        variant="secondary"
        className={cls}
        onClick={() => {
          haptic();
          remove(s.id);
          toast('Услуга удалена из заказа', 'info');
        }}
      >
        {big ? '✓ В заказе · убрать' : '✓ в заказе · убрать'}
      </Button>
    );

  return (
    <Button
      block={big}
      className={cls}
      onClick={(e) => {
        haptic('medium');
        fly(e.currentTarget);
        add(s.id);
        toast('Услуга добавлена в заказ', 'success');
        if (onDone) setTimeout(onDone, 150);
      }}
    >
      {big ? 'Заказать' : 'беру'}
    </Button>
  );
}
