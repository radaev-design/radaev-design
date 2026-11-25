import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BANNERS } from '../../../config/banners';
import type { CategoryId } from '../../../config/catalog';
import { haptic } from '../../integrations/telegram';
import { asset } from '../../ui/utils';

const INTERVAL = 5000;
const N = BANNERS.length;
// Копии краёв для бесконечной прокрутки: [последний, ...все, первый]
const SLIDES = [BANNERS[N - 1], ...BANNERS, BANNERS[0]];

export function Banners({ onOpen }: { onOpen: (cat?: CategoryId) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef(1);
  const paused = useRef(false);
  const touching = useRef(false);
  const resumeTimer = useRef<number>();
  const settleTimer = useRef<number>();
  const [active, setActive] = useState(0);

  const jump = (p: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.scrollSnapType = 'none';
    el.scrollLeft = p * el.clientWidth;
    pos.current = p;
    requestAnimationFrame(() => {
      el.style.scrollSnapType = '';
    });
  };

  const goTo = (p: number) => {
    const el = ref.current;
    if (el) el.scrollTo({ left: p * el.clientWidth, behavior: 'smooth' });
  };

  const settle = () => {
    const el = ref.current;
    if (!el || touching.current) return;
    const q = Math.round(el.scrollLeft / el.clientWidth);
    if (q === 0) jump(N);
    else if (q === N + 1) jump(1);
  };

  useLayoutEffect(() => jump(1), []); // eslint-disable-line

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) goTo(Math.min(pos.current + 1, N + 1));
    }, INTERVAL);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(resumeTimer.current);
      window.clearTimeout(settleTimer.current);
    };
  }, []);

  const onScroll = () => {
    const el = ref.current;
    if (!el || !el.clientWidth) return;
    const p = Math.round(el.scrollLeft / el.clientWidth);
    if (p !== pos.current) {
      pos.current = p;
      setActive((p - 1 + N) % N);
    }
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(settle, 120);
  };

  const pause = () => {
    paused.current = true;
    touching.current = true;
    window.clearTimeout(resumeTimer.current);
  };
  const resume = () => {
    touching.current = false;
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(settle, 250);
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => (paused.current = false), 4000);
  };

  return (
    <section className="bn" aria-label="Специальные предложения">
      <div className="bn-track" ref={ref} onScroll={onScroll} onTouchStart={pause} onTouchEnd={resume} onTouchCancel={resume} onMouseEnter={pause} onMouseLeave={resume}>
        {SLIDES.map((b, i) => (
          <div className="bn-slide" key={b.id + '-' + i}>
            <div
              className={'bn-card' + (b.story ? ' story' : '') + (b.kv ? ' has-kv' : '')}
              style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }}
            >
              <i className="bn-bubble" />
              {b.kv && (
                <img
                  className={'kv' + (b.kvBlend ? ' blend' : '')}
                  src={asset(b.kv)}
                  alt=""
                  style={b.kvH ? ({ '--kv-h': b.kvH } as React.CSSProperties) : undefined}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              {b.image && <img className="bn-img" src={asset(b.image)} alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />}
              <span className="bn-tag">{b.tag}</span>
              {b.story ? (
                <div className="bn-tale">
                  <p>
                    <b>Было:</b>
                    {b.before}
                  </p>
                  <p>
                    <b>Стало:</b>
                    {b.after}
                  </p>
                  <div className="bn-author">
                    {b.author}
                    {b.isExample && <em> · пример</em>}
                  </div>
                </div>
              ) : (
                <>
                  {b.discount && <div className="bn-disc">{b.discount}</div>}
                  <h3 className="bn-title">{b.title}</h3>
                  <p className="bn-text">{b.text}</p>
                </>
              )}
              <button
                className="bn-btn"
                onClick={() => {
                  haptic();
                  onOpen(b.category);
                }}
              >
                {b.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="bn-dots">
        {BANNERS.map((b, i) => (
          <button key={b.id} className={i === active ? 'on' : ''} aria-label={`Баннер ${i + 1}`} onClick={() => goTo(i + 1)} />
        ))}
      </div>
    </section>
  );
}
