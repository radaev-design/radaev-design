import { useEffect, useState } from 'react';
import { asset } from './utils';

export type Pose = 'hello' | 'point' | 'think' | 'coin' | 'sad' | 'success';
const EMOJI: Record<Pose, string> = { hello: '👋', point: '👉', think: '🤔', coin: '🪙', sad: '🥺', success: '🎉' };

export function Mascot({ pose, size = 120 }: { pose: Pose; size?: number }) {
  const [bad, setBad] = useState(false);
  useEffect(() => setBad(false), [pose]);

  return bad ? (
    <div className="mascot mascot-emoji" style={{ width: size, height: size, fontSize: size * 0.55 }}>
      {EMOJI[pose]}
    </div>
  ) : (
    <img
      className="mascot"
      src={asset(`mascot/${pose}.png`)}
      alt=""
      width={size}
      height={size}
      onError={() => setBad(true)}
    />
  );
}
