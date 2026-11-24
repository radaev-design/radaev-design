import { useState } from 'react';
import { useMe } from '../../storage/me';
import { Button } from '../../ui/Button';

const W = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

const result = (b: string[]) => {
  for (const [a, c, d] of W) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return b.every(Boolean) ? 'draw' : null;
};

function bot(b: string[]) {
  const find = (p: string) => {
    for (const l of W) {
      const empty = l.filter((i) => !b[i]);
      if (empty.length === 1 && l.filter((i) => b[i] === p).length === 2) return empty[0];
    }
    return -1;
  };
  let m = find('O');
  if (m < 0) m = find('X');
  if (m < 0 && !b[4]) m = 4;
  if (m < 0) {
    const f = b.flatMap((v, i) => (v ? [] : [i]));
    m = f[Math.floor(Math.random() * f.length)];
  }
  return m;
}

export function TicTacToe() {
  const { award } = useMe();
  const [b, setB] = useState<string[]>(Array(9).fill(''));
  const [res, setRes] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const end = (r: string) => {
    setRes(r);
    if (r === 'X') award('ttt', 'win');
    else if (r === 'draw') award('ttt', 'draw');
  };

  const tap = (i: number) => {
    if (b[i] || res || busy) return;
    const nb = [...b];
    nb[i] = 'X';
    setB(nb);
    const r = result(nb);
    if (r) return end(r);
    setBusy(true);
    setTimeout(() => {
      const n2 = [...nb];
      n2[bot(nb)] = 'O';
      setB(n2);
      setBusy(false);
      const r2 = result(n2);
      if (r2) end(r2);
    }, 350);
  };

  const reset = () => {
    setB(Array(9).fill(''));
    setRes(null);
    setBusy(false);
  };

  return (
    <div>
      <h1>Крестики-нолики</h1>
      <p className="muted">Вы играете крестиками. Победа +5, ничья +1.</p>
      <div className="gm-board ttt">
        {b.map((v, i) => (
          <button key={i} className={v === 'O' ? 'o' : ''} onClick={() => tap(i)}>
            {v === 'X' ? '✕' : v === 'O' ? '○' : ''}
          </button>
        ))}
      </div>
      {res && <h2 style={{ textAlign: 'center' }}>{res === 'X' ? 'Победа! 🎉' : res === 'draw' ? 'Ничья' : 'Бот выиграл'}</h2>}
      <Button block variant={res ? 'primary' : 'secondary'} onClick={reset}>
        Новая игра
      </Button>
    </div>
  );
}
