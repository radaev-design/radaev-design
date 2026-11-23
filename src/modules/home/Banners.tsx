import { useEffect, useRef, useState } from 'react';
import { BANNERS } from '../../../config/banners';
import type { CategoryId } from '../../../config/catalog';
import { haptic } from '../../integrations/telegram';

const INTERVAL = 5000;

export function Banners({ onOpen }: { onOpen: (cat?: CategoryId) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const idx = useRef(0);
  const paused = useRef(false);
  const resumeTimer = useRef<number>();
  const [active, setActive] = useState(0);

  const goTo = (i: number) => {
    const el = ref.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) goTo((idx.current + 1) % BANNERS.length);
    }, INTERVAL);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(resumeTimer.current);
    };
  }, []);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== idx.current) {
      idx.current = i;
      setActive(i);
    }
  };
  const pause = () => {
    paused.current = true;
    window.clearTimeout(resumeTimer.current);
  };
  const resume = () => {
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => (paused.current = false), 4000);
  };

  return (
    <section className="bn" aria-label="Специальные предложения">
      <div className="bn-track" ref={ref} onScroll={onScroll} onTouchStart={pause} onTouchEnd={resume} onMouseEnter={pause} onMouseLeave={resume}>
        {BANNERS.map((b) => (
          <div className="bn-slide" key={b.id}>
            <div className="bn-card" style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }}>
              <i className="bn-bubble" />
              <span className="bn-tag">{b.tag}</span>
              {b.story ? (
                <div className="bn-story">
                  <div className="bn-photos" aria-hidden="true">
                    <div className="bn-ph">до</div>
                    <div className="bn-ph after">после</div>
                  </div>
                  <div>
                    <p className="bn-quote">«{b.quote}»</p>
                    <div className="bn-author">
                      {b.author}
                      {b.isExample && <em> · пример отзыва</em>}
                    </div>
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
          <button key={b.id} className={i === active ? 'on' : ''} aria-label={`Баннер ${i + 1}`} onClick={() => goTo(i)} />
        ))}
      </div>
    </section>
  );
}
