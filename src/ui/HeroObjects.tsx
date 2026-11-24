import { useState } from 'react';
import { HERO_OBJECTS, HeroObj } from '../../config/hero';
import { asset } from './utils';

function Obj({ o }: { o: HeroObj }) {
  const [bad, setBad] = useState(false);
  const style = { width: o.size, height: o.size, top: o.top, right: o.right, animationDuration: o.dur + 's', animationDelay: o.delay + 's' };
  return bad ? (
    <div className={'hobj ' + o.shape} style={style} />
  ) : (
    <img className="hobj" src={asset(o.src)} alt="" style={style} onError={() => setBad(true)} />
  );
}

export function HeroObjects() {
  return (
    <>
      {HERO_OBJECTS.map((o) => (
        <Obj key={o.src} o={o} />
      ))}
    </>
  );
}
