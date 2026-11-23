import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { STORIES } from '../../../config/stories';
import { haptic } from '../../integrations/telegram';
import { read, write } from '../../storage/ls';
import { asset } from '../../ui/utils';

const EMOJI = ['🔥', '🎉', '🏆', '👏', '🥳', '❤️'];

const avatarStyle = (s: (typeof STORIES)[number]) =>
  s.avatar ? { backgroundImage: `url(${asset(s.avatar)})` } : { background: s.color };

export function Stories() {
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<string[]>(() => read('seen', []));

  const mark = useCallback((id: string) => {
    setSeen((p) => {
      if (p.includes(id)) return p;
      const n = [...p, id];
      write('seen', n);
      return n;
    });
  }, []);

  if (!STORIES.length) return null;
  return (
    <>
      <div className="st-row">
        {STORIES.map((s, i) => (
          <button key={s.id} className="st" onClick={() => setOpen(i)}>
            <span className={'st-ring' + (seen.includes(s.id) ? ' seen' : '')}>
              <span className="st-av" style={avatarStyle(s)}>
                {s.avatar ? '' : s.name[0]}
              </span>
            </span>
            <span className="st-name">{s.name}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>{open !== null && <Viewer key="v" start={open} onSeen={mark} onClose={() => setOpen(null)} />}</AnimatePresence>
    </>
  );
}

function Viewer({ start, onSeen, onClose }: { start: number; onSeen: (id: string) => void; onClose: () => void }) {
  const [pos, setPos] = useState({ s: start, i: 0 });
  const [p, setP] = useState(0);
  const [rx, setRx] = useState<Record<string, number>>(() => read('rx', {}));
  const [fly, setFly] = useState<{ id: number; e: string; x: number }[]>([]);
  const paused = useRef(false);

  const story = STORIES[pos.s];
  const slide = story.slides[pos.i];
  const dur = slide.duration ?? 5000;

  const next = () => {
    setP(0);
    if (pos.i < story.slides.length - 1) setPos({ ...pos, i: pos.i + 1 });
    else if (pos.s < STORIES.length - 1) setPos({ s: pos.s + 1, i: 0 });
    else onClose();
  };
  const prev = () => {
    setP(0);
    if (pos.i > 0) setPos({ ...pos, i: pos.i - 1 });
    else if (pos.s > 0) setPos({ s: pos.s - 1, i: 0 });
  };
  const nextRef = useRef(next);
  nextRef.current = next;

  useEffect(() => onSeen(story.id), [story.id, onSeen]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      if (!paused.current) setP((v) => Math.min(v + dt / dur, 1));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pos.s, pos.i, dur]);

  useEffect(() => {
    if (p >= 1) nextRef.current();
  }, [p]);

  const react = (e: string) => {
    haptic('medium');
    const k = story.id + e;
    const n = { ...rx, [k]: (rx[k] || 0) + 1 };
    setRx(n);
    write('rx', n);
    setFly((f) => [...f, { id: Date.now() + Math.random(), e, x: Math.random() * 120 - 60 }]);
  };

  const src = slide.src ? asset(slide.src) : '';
  const isVideo = /\.(mp4|webm)$/i.test(src);

  return (
    <motion.div
      className="sv"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.7 }}
      onDragEnd={(_, i) => i.offset.y > 120 && onClose()}
    >
      <div className="sv-bg" style={{ background: `linear-gradient(160deg, ${story.color}, #080a12)` }}>
        {src && (isVideo ? <video key={src} src={src} autoPlay muted playsInline loop /> : <img key={src} src={src} alt="" />)}
      </div>
      <div className="sv-bars">
        {story.slides.map((_, i) => (
          <span key={i}>
            <i style={{ width: `${(i < pos.i ? 1 : i === pos.i ? p : 0) * 100}%` }} />
          </span>
        ))}
      </div>
      <div className="sv-head">
        <span className="st-av sm" style={avatarStyle(story)}>
          {story.avatar ? '' : story.name[0]}
        </span>
        <b>{story.name}</b>
        <button onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
      </div>
      <div
        className="sv-zones"
        onPointerDown={() => (paused.current = true)}
        onPointerUp={() => (paused.current = false)}
        onPointerLeave={() => (paused.current = false)}
      >
        <div onClick={prev} />
        <div onClick={next} />
      </div>
      {slide.caption && <div className="sv-cap">{slide.caption}</div>}
      <div className="sv-fly">
        {fly.map((f) => (
          <motion.span
            key={f.id}
            initial={{ y: 0, x: f.x, opacity: 1, scale: 0.6 }}
            animate={{ y: -280, opacity: 0, scale: 1.7 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            onAnimationComplete={() => setFly((l) => l.filter((z) => z.id !== f.id))}
          >
            {f.e}
          </motion.span>
        ))}
      </div>
      <div className="sv-rx">
        {EMOJI.map((e) => (
          <button key={e} onClick={() => react(e)}>
            {e}
            {rx[story.id + e] ? <small>{rx[story.id + e]}</small> : null}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
