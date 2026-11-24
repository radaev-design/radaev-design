import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { formatPrice, Service } from '../../../config/catalog';
import { ServiceAction } from './ServiceAction';
import { ServiceSheet } from './ServiceSheet';

interface Props {
  s: Service;
  n?: number;
  className?: string;
  autoOpen?: boolean;
}

export function ServiceCard({ s, n, className = '', autoOpen }: Props) {
  const [open, setOpen] = useState(!!autoOpen);
  const badge = s.badge ?? (s.comingSoon ? 'скоро' : s.popular ? 'хит' : undefined);

  return (
    <div className={'sc ' + className}>
      <div className="sc-main" role="button" tabIndex={0} onClick={() => setOpen(true)} onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}>
        <div className="sc-top">
          <span className="sc-num">{String(n ?? 0).padStart(2, '0')}</span>
          <span className="sc-top-r">
            {badge && <span className="sc-badge">{badge}</span>}
            <span className="sc-more">подробнее ›</span>
          </span>
        </div>
        <h3 className="sc-title">{s.title}</h3>
        <p className="sc-desc">{s.description}</p>
        <div className={'sc-price' + (s.priceFrom == null ? ' small' : '')}>{formatPrice(s)}</div>
      </div>

      <div className="sc-foot">
        {s.slogan && <div className="sc-slogan">{s.slogan}</div>}
        {s.hint && <div className="sc-hint">{s.hint}</div>}
        <ServiceAction s={s} />
      </div>

      <AnimatePresence>{open && <ServiceSheet s={s} onClose={() => setOpen(false)} />}</AnimatePresence>
    </div>
  );
}
