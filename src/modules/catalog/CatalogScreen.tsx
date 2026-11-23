import { useState } from 'react';
import { activeServices, CATEGORIES, CategoryId, formatPrice, BRAND } from '../../../config/catalog';
import { haptic } from '../../integrations/telegram';
import { useCart } from '../../storage/cart';
import { fly, openLink } from '../../ui/utils';

export function CatalogScreen({ initial }: { initial?: CategoryId }) {
  const [cat, setCat] = useState<CategoryId | undefined>(initial);
  const { has, add, remove } = useCart();
  const list = activeServices().filter((s) => !cat || s.category === cat);
  return (
    <div className="screen">
      <h1>Услуги</h1>
      <div className="chips">
        <button className={'chip' + (!cat ? ' on' : '')} onClick={() => setCat(undefined)}>Все</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={'chip' + (cat === c.id ? ' on' : '')} onClick={() => setCat(c.id)}>{c.title}</button>
        ))}
      </div>
      {list.map((s) => (
        <div key={s.id} className="card svc">
          {s.comingSoon && <span className="badge">COMING SOON</span>}
          {s.popular && !s.comingSoon && <span className="badge pop">ПОПУЛЯРНО</span>}
          <h3>{s.title}</h3>
          <p>{s.description}</p>
          <div className="price">{formatPrice(s)}</div>
          {s.comingSoon ? (
            <button className="btn svc-btn secondary" onClick={() => openLink(`${BRAND.managerUrl}?text=${encodeURIComponent('Хочу оформить предзаказ: ' + s.title)}`)}>
              Оформить предзаказ
            </button>
          ) : has(s.id) ? (
            <button className="btn svc-btn secondary" onClick={() => { haptic(); remove(s.id); }}>✓ В заказе · убрать</button>
          ) : (
            <button className="btn svc-btn" onClick={(e) => { haptic('medium'); fly(e.currentTarget); add(s.id); }}>Заказать</button>
          )}
        </div>
      ))}
    </div>
  );
}
