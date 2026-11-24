import { CLIENTS } from '../../config/clients';
import { asset } from './utils';

export function Marquee() {
  if (!CLIENTS.length) return null;
  const base = Array(Math.ceil(12 / CLIENTS.length)).fill(CLIENTS).flat() as string[];
  const row = [...base, ...base];
  return (
    <section className="mq" aria-label="С кем мы работали">
      <h2>С кем мы работали</h2>
      <div className="mq-view">
        <div className="mq-track" style={{ animationDuration: Math.max(24, base.length * 3) + 's' }}>
          {row.map((f, i) => (
            <span className="mq-item" key={i}>
              <img src={asset('clients/' + f)} alt="" loading="lazy" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
