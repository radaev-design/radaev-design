import { useEffect, useRef, useState } from 'react';
import { read, write } from '../../storage/ls';
import { useMe } from '../../storage/me';
import { Button } from '../../ui/Button';

const N = 4;
const lines = (d: number) => {
  const out: number[][] = [];
  for (let i = 0; i < N; i++) {
    const l = [0, 1, 2, 3].map((j) => (d < 2 ? i * N + j : j * N + i));
    out.push(d % 2 ? l.reverse() : l);
  }
  return out;
};
const free = (b: number[]) => b.flatMap((v, i) => (v ? [] : [i]));
const spawn = (b: number[]) => {
  const f = free(b);
  if (!f.length) return b;
  const nb = [...b];
  nb[f[Math.floor(Math.random() * f.length)]] = Math.random() < 0.9 ? 2 : 4;
  return nb;
};
const fresh = () => spawn(spawn(Array(N * N).fill(0)));

// d: 0 влево, 1 вправо, 2 вверх, 3 вниз
function step(b: number[], d: number) {
  let moved = false;
  let gain = 0;
  const nb = [...b];
  for (const l of lines(d)) {
    const a = l.map((i) => b[i]).filter(Boolean);
    for (let i = 0; i < a.length - 1; i++)
      if (a[i] === a[i + 1]) {
        a[i] *= 2;
        gain += a[i];
        a.splice(i + 1, 1);
      }
    while (a.length < N) a.push(0);
    l.forEach((i, k) => {
      if (nb[i] !== a[k]) moved = true;
      nb[i] = a[k];
    });
  }
  return { nb, moved, gain };
}
const dead = (b: number[]) => !free(b).length && [0, 1, 2, 3].every((d) => !step(b, d).moved);

const tileStyle = (v: number) => {
  if (!v) return { background: 'rgba(128,138,170,.15)' };
  if (v >= 2048) return { background: 'var(--accent)', color: '#0d0303' };
  const lv = Math.log2(v);
  return { background: `hsl(${(340 + lv * 14) % 360} 80% ${Math.max(32, 62 - lv * 3)}%)`, fontSize: v >= 1000 ? 20 : 26 };
};

export function G2048() {
  const { award } = useMe();
  const [board, setBoard] = useState(fresh);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => read('g48best', 0));
  const [over, setOver] = useState(false);
  const got = useRef(new Set<number>());
  const t0 = useRef<[number, number] | null>(null);

  const go = (d: number) => {
    if (over) return;
    const { nb, moved, gain } = step(board, d);
    if (!moved) return;
    const next = spawn(nb);
    const sc = score + gain;
    setBoard(next);
    setScore(sc);
    if (sc > best) {
      setBest(sc);
      write('g48best', sc);
    }
    const mx = Math.max(...next);
    for (const t of [128, 256, 512, 1024, 2048])
      if (mx >= t && !got.current.has(t)) {
        got.current.add(t);
        award('g2048', String(t));
      }
    if (dead(next)) setOver(true);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const m: Record<string, number> = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3 };
      if (e.key in m) {
        e.preventDefault();
        go(m[e.key]);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const restart = () => {
    setBoard(fresh());
    setScore(0);
    setOver(false);
    got.current.clear();
  };

  return (
    <div>
      <h1>2048</h1>
      <div className="gm-row">
        <b>Счёт: {score}</b>
        <span className="muted" style={{ margin: 0 }}>
          Рекорд: {best}
        </span>
      </div>
      <div
        className="gm-board g48"
        onTouchStart={(e) => {
          const t = e.touches[0];
          t0.current = [t.clientX, t.clientY];
        }}
        onTouchEnd={(e) => {
          if (!t0.current) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - t0.current[0];
          const dy = t.clientY - t0.current[1];
          t0.current = null;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
          go(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 0) : dy > 0 ? 3 : 2);
        }}
      >
        {board.map((v, i) => (
          <div key={i} className="tl" style={tileStyle(v)}>
            {v || ''}
          </div>
        ))}
      </div>
      <p className="muted" style={{ textAlign: 'center' }}>
        Свайпайте, чтобы двигать плитки. Баллы за 128, 256, 512, 1024 и 2048.
      </p>
      {over && <h2 style={{ textAlign: 'center' }}>Игра окончена</h2>}
      <Button block variant={over ? 'primary' : 'secondary'} onClick={restart}>
        Новая игра
      </Button>
    </div>
  );
}
