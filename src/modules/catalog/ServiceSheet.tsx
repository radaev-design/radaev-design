import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { formatPrice, Service } from '../../../config/catalog';
import { detailFor } from '../../../config/details';
import { asset } from '../../ui/utils';
import { ServiceAction } from './ServiceAction';

export function ServiceSheet({ s, onClose }: { s: Service; onClose: () => void }) {
  const d = detailFor(s.id, s.category);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <motion.div className="sheet-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-grab" />
        <button className="sheet-x" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
        <h2 className="sheet-title">{s.title}</h2>
        <div className="sheet-price">{formatPrice(s)}</div>

        {d.examples.length ? (
          <div className="sheet-gal">
            {d.examples.map((p) => (
              <img key={p} src={asset(p)} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
            ))}
          </div>
        ) : (
          <div className="sheet-noex">Примеры работ скоро появятся</div>
        )}

        <h3>Что это</h3>
        <p>{d.about}</p>
        <h3>Что входит</h3>
        <ul>
          {d.includes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h3>Зачем заказывать</h3>
        <ul>
          {d.why.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <div className="sheet-term">Срок: {d.term}</div>

        <div className="sheet-cta">
          <ServiceAction s={s} big onDone={onClose} />
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
