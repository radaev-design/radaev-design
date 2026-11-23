
import { useState } from 'react';
import {
  activeServices,
  CATEGORIES,
  CategoryId,
  formatPrice,
  BRAND,
} from '../../../config/catalog';
import { haptic } from '../../integrations/telegram';
import { useCart } from '../../storage/cart';
import { fly, openLink } from '../../ui/utils';
import { useToast } from '../../ui/Toast';
import { MascotGuide } from '../../ui/MascotGuide';

export function CatalogScreen({ initial }: { initial?: CategoryId }) {
  const [cat, setCat] = useState<CategoryId | undefined>(initial);

  const { has, add, remove } = useCart();
  const { toast } = useToast();

  const list = activeServices().filter(
    (s) => !cat || s.category === cat,
  );

  return (
    <div className="screen">
      <h1>Услуги</h1>

      <div className="chips">
        <button
          className={'chip' + (!cat ? ' on' : '')}
          onClick={() => setCat(undefined)}
        >
          Все
        </button>

        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={'chip' + (cat === c.id ? ' on' : '')}
            onClick={() => setCat(c.id)}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="catalog-mascot">
        <MascotGuide
          pose="point"
          size={96}
          compact
          text="Выбирай услуги, которые тебе нужны! Добавляй их в заказ, а я помогу."
        />
      </div>

      {list.length === 0 ? (
        <MascotGuide
          pose="question"
          size={140}
          text="В этой категории пока нет доступных услуг."
        />
      ) : (
        list.map((s) => (
          <div key={s.id} className="card svc">
            {s.comingSoon && (
              <span className="badge">COMING SOON</span>
            )}

            {s.popular && !s.comingSoon && (
              <span className="badge pop">ПОПУЛЯРНО</span>
            )}

            <h3>{s.title}</h3>

            <p>{s.description}</p>

            <div className="price">{formatPrice(s)}</div>

            {s.comingSoon ? (
              <button
                className="btn svc-btn secondary"
                onClick={() => {
                  haptic();

                  toast('Открываем менеджера для предзаказа', 'info');

                  openLink(
                    `${BRAND.managerUrl}?text=${encodeURIComponent(
                      'Хочу оформить предзаказ: ' + s.title,
                    )}`,
                  );
                }}
              >
                Оформить предзаказ
              </button>
            ) : has(s.id) ? (
              <button
                className="btn svc-btn secondary"
                onClick={() => {
                  haptic();
                  remove(s.id);
                  toast('Услуга удалена из заказа', 'info');
                }}
              >
                ✓ В заказе · убрать
              </button>
            ) : (
              <button
                className="btn svc-btn"
                onClick={(e) => {
                  haptic('medium');
                  fly(e.currentTarget);
                  add(s.id);
                  toast('Услуга добавлена в заказ ✨', 'success');
                }}
              >
                Заказать
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
