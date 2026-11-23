import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { STORIES } from '../../../config/stories';
import { haptic } from '../../integrations/telegram';

const BASE: string = (import.meta as any).env?.BASE_URL ?? '/';
const EMOJI = ['🔥', '🎉', '🏆', '👏', '🥳', '❤️'];
const media = (p?: string) => (p ? BASE + p.replace(/^\//, '') : '');
function read<T>(k: string, d: T): T {
  try { return JSON.parse(localStorage.getItem(k) || '') ?? d; } catch { return d; }
}
const save = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* no-op */ } };

export function Stories() {
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<string[]>(() => read('seen', []));
  const mark = (id: string) => setSeen((p) => { if (p.includes(id)) return p; const n = [...p, id]; save('seen', n); return n; });
  if (!STORIES.length) return null;
  return (
    <>
      <div className="st-row">
        {STORIES.map((s, i) => (
          <button key={s.id} className="st" onClick={() => setOpen(i)}>
            <span className={'st-ring' + (seen.includes(s.id) ? ' seen' : '')}>
              <span className="st-av" style={s.avatar ? { backgroundImage: `url(${media(s.avatar)})` } : { background: s.color }}>
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
  const [si, setSi] = useState(start);
  const [sl, setSl] = useState(0);
  const [p, setP] = useState(0);
  const [paused, setPaused] = useState(false);
  const [rx, setRx] = useState<Record<string, number>>(() => read('rx', {}));
  const [fl, setFl] = useState<{ id: number; e: string; x: number }[]>([]);
  const story = STORIES[si];
  const slide = story.slides[sl];
  const dur = slide.duration ?? 5000;

  const next = () => {
    if (sl < story.slides.length - 1) { setSl(sl + 1); setP(0); }
    else if (si < STORIES.length - 1) { setSi(si + 1); setSl(0); setP(0); }
    else onClose();
  };
  const prev = () => {
    if (sl > 0) setSl(sl - 1);
    else if (si > 0) { setSi(si - 1); setSl(0); }
    setP(0);
  };

  useEffect(() => onSeen(story.id), [story.id]); // eslint-disable-line
  useEffect(() => {
    const t = setInterval(() => { if (!paused) setP((v) => v + 50 / dur); }, 50);
    return () => clearInterval(t);
  }, [paused, dur]);
  useEffect(() => { if (p >= 1) next(); }, [p]); // eslint-disable-line

  const react = (e: string) => {
    haptic('medium');
    const k = story.id + e;
    const n = { ...rx, [k]: (rx[k] || 0) + 1 };
    setRx(n); save('rx', n);
    const id = Date.now() + Math.random();
    setFl((f) => [...f, { id, e, x: Math.random() * 120 - 60 }]);
  };
  const src = media(slide.src);
  const isVideo = /\.(mp4|webm)$/i.test(src);

  return (
    <motion.div
      className="sv" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
      drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.7 }}
      onDragEnd={(_, i) => { if (i.offset.y > 120) onClose(); }}
    >
      <div className="sv-bg" style={{ background: `linear-gradient(160deg, ${story.color}, #080a12)` }}>
        {src && (isVideo ? <video key={src} src={src} autoPlay muted playsInline loop /> : <img key={src} src={src} alt="" />)}
      </div>
      <div className="sv-bars">
        {story.slides.map((_, i) => (
          <span key={i}><i style={{ width: `${(i < sl ? 1 : i === sl ? Math.min(p, 1) : 0) * 100}%` }} /></span>
        ))}
      </div>
      <div className="sv-head">
        <span className="st-av sm" style={story.avatar ? { backgroundImage: `url(${media(story.avatar)})` } : { background: story.color }}>
          {story.avatar ? '' : story.name[0]}
        </span>
        <b>{story.name}</b>
        <button onClick={onClose} aria-label="Закрыть">✕</button>
      </div>
      <div className="sv-zones" onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)} onPointerLeave={() => setPaused(false)}>
        <div onClick={prev} />
        <div onClick={next} />
      </div>
      {slide.caption && <div className="sv-cap">{slide.caption}</div>}
      <div className="sv-fly">
        {fl.map((f) => (
          <motion.span key={f.id} initial={{ y: 0, x: f.x, opacity: 1, scale: 0.6 }} animate={{ y: -280, opacity: 0, scale: 1.7 }}
            transition={{ duration: 1.3, ease: 'easeOut' }} onAnimationComplete={() => setFl((l) => l.filter((z) => z.id !== f.id))}>
            {f.e}
          </motion.span>
        ))}
      </div>
      <div className="sv-rx">
        {EMOJI.map((e) => (
          <button key={e} onClick={() => react(e)}>
            {e}{rx[story.id + e] ? <small>{rx[story.id + e]}</small> : null}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
