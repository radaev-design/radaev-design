import { useState } from 'react';
import { activeServices, CATEGORIES, CategoryId } from '../../../config/catalog';
import { Mascot } from '../../ui/Mascot';
import { ServiceCard } from './ServiceCard';

export function CatalogScreen({ initial }: { initial?: CategoryId }) {
  const [cat, setCat] = useState<CategoryId | undefined>(initial);
  const list = activeServices().filter((s) => !cat || s.category === cat);

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
        list.map((s) => <ServiceCard key={s.id} s={s} />)
      )}
    </div>
  );
}
