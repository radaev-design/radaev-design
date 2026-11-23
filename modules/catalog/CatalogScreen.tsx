import { useState } from 'react';
import { CATEGORIES, CategoryId, activeServices, formatPrice } from '../../../config/catalog';
import { ru } from '../../i18n/ru';

export function CatalogScreen({ initial }: { initial?: CategoryId }) {
  const [cat, setCat] = useState<CategoryId | 'all'>(initial ?? 'all');
  const list = activeServices().filter((s) => cat === 'all' || s.category === cat);

  return (
    <div className="screen">
      <h1>{ru.catalog.title}</h1>
      <div className="chips">
        <button className={'chip' + (cat === 'all' ? ' on' : '')} onClick={() => setCat('all')}>
          {ru.catalog.all}
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={'chip' + (cat === c.id ? ' on' : '')} onClick={() => setCat(c.id)}>
            {c.title}
          </button>
        ))}
      </div>

      {list.length === 0 && <p className="empty">{ru.catalog.empty}</p>}

      {list.map((s) => (
        <article key={s.id} className="card svc">
          {s.comingSoon && <span className="badge">{ru.catalog.soon}</span>}
          {s.popular && !s.comingSoon && <span className="badge pop">ПОПУЛЯРНО</span>}
          <h3>{s.title}</h3>
          <p>{s.description}</p>
          <div className="price">{formatPrice(s)}</div>
        </article>
      ))}
    </div>
  );
}
