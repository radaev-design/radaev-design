import { CLIENTS, CLIENTS_SUB, CLIENTS_TITLE, LOGO_MONO } from '../../config/clients';
import { asset } from './utils';

function Row({ items, cls, reverse }: { items: string[]; cls: string; reverse?: boolean }) {
  const dur = Math.max(32, items.length * 6); // чем больше логотипов, тем дольше круг (медленно)
  return (
    <div className={'rb ' + cls}>
      <div className="rb-track" style={{ animationDuration: dur + 's', animationDirection: reverse ? 'reverse' : 'normal' }}>
        {[...items, ...items].map((f, i) => (
          <span className="rb-item" key={i}>
            <img src={asset('clients/' + f)} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <i className="rb-star">✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  if (!CLIENTS.length) return null;
  const rep = Math.max(1, Math.ceil(8 / CLIENTS.length));
  const a = Array(rep).fill(CLIENTS).flat() as string[];
  const b = [...a].reverse();
  return (
    <section className={'rb-wrap' + (LOGO_MONO ? ' mono' : '')} aria-label={CLIENTS_TITLE}>
      <h2 className="rb-title">{CLIENTS_TITLE}</h2>
      <p className="muted rb-sub">{CLIENTS_SUB}</p>
      <div className="rb-view">
        <div className="rb-tilt">
          <Row items={a} cls="a" />
          <Row items={b} cls="b" reverse />
        </div>
      </div>
    </section>
  );
}
