import { useState } from 'react';
import { activeServices, BRAND, CATEGORIES, CategoryId, formatPrice, Service } from '../../../config/catalog';
import { haptic, openLink } from '../../integrations/telegram';
import { useCart } from '../../storage/cart';
import { Button } from '../../ui/Button';
import { Mascot } from '../../ui/Mascot';
import { useToast } from '../../ui/Toast';
import { fly } from '../../ui/utils';

export function CatalogScreen({ initial }: { initial?: CategoryId }) {
  const [cat, setCat] = useState<CategoryId | undefined>(initial);
  const { has, add, remove } = useCart();
  const { toast } = useToast();
  const list = activeServices().filter((s) => !cat || s.category === cat);

  const onAdd = (s: Service, el: HTMLElement) => {
    haptic('medium');
    fly(el);
    add(s.id);
    toast('Услуга добавлена в заказ', 'success');
  };
  const onRemove = (s: Service) => {
    haptic();
    remove(s.id);
    toast('Услуга удалена из заказа', 'info');
  };
  const onPreorder = (s: Service) => {
    haptic('medium');
    toast('Открываем менеджера для предзаказа', 'info');
    openLink(`${BRAND.managerUrl}?text=${encodeURIComponent('Хочу оформить предзаказ: ' + s.title)}`);
  };

  return (
    <div className="screen">
      <h1>Услуги</h1>
      <div className="chips">
        <button className={'chip' + (!cat ? ' on' : '')} onClick={() => setCat(undefined)}>
          Все
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={'chip' + (cat === c.id ? ' on' : '')} onClick={() => setCat(c.id)}>
            {c.title}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <Mascot pose="sad" size={110} />
          <h2>Услуг пока нет</h2>
          <p>В этой категории пока нет доступных услуг.</p>
        </div>
      ) : (
        list.map((s) => (
          <div key={s.id} className="card svc">
            {s.comingSoon ? (
              <span className="badge">COMING SOON</span>
            ) : (
              s.popular && <span className="badge pop">ПОПУЛЯРНО</span>
            )}
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            <div className="price">{formatPrice(s)}</div>
            {s.comingSoon ? (
              <Button variant="secondary" className="svc-btn" onClick={() => onPreorder(s)}>
                Оформить предзаказ
              </Button>
            ) : has(s.id) ? (
              <Button variant="secondary" className="svc-btn" onClick={() => onRemove(s)}>
                ✓ В заказе · убрать
              </Button>
            ) : (
              <Button className="svc-btn" onClick={(e) => onAdd(s, e.currentTarget)}>
                Заказать
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
