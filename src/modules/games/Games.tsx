import { useState } from 'react';
import { motion } from 'framer-motion';
import { ECONOMY } from '../../../config/economy';
import { useMe } from '../../storage/me';
import { Button } from '../../ui/Button';
import { Mascot } from '../../ui/Mascot';
import { G2048 } from './G2048';
import { TicTacToe } from './TicTacToe';
import { WordGame } from './WordGame';

type Game = 'g2048' | 'ttt' | 'word' | null;

const LIST: { id: Exclude<Game, null>; ico: string; t: string; d: string }[] = [
  { id: 'g2048', ico: '🔢', t: '2048', d: 'Баллы за плитки 128–2048: до 50' },
  { id: 'ttt', ico: '⭕', t: 'Крестики-нолики', d: 'Победа +5, ничья +1' },
  { id: 'word', ico: '🔤', t: 'Угадай слово', d: 'Победа +8' },
];

export function Games({ onClose }: { onClose: () => void }) {
  const { me, buy } = useMe();
  const [game, setGame] = useState<Game>(null);
  const E = ECONOMY;
  const cooling = !!me && me.canBuyAt > Date.now();

  return (
    <motion.div className="gm" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}>
      <div className="gm-bar">
        <button className="back" onClick={game ? () => setGame(null) : onClose}>
          ‹ {game ? 'Игры' : 'Закрыть'}
        </button>
      </div>

      {game === 'g2048' ? (
        <G2048 />
      ) : game === 'ttt' ? (
        <TicTacToe />
      ) : game === 'word' ? (
        <WordGame />
      ) : (
        <>
          <div className="gm-hero">
            <Mascot pose="coin" size={96} />
            <div>
              <div className="gm-points">{me?.points ?? 0}</div>
              <div className="muted" style={{ margin: 0 }}>
                баллов MODO
              </div>
            </div>
          </div>

          {me ? (
            <div style={{ margin: '12px 0' }}>
              <div className="gm-capbar">
                <i style={{ width: Math.min(100, (me.todayPts / me.dailyCap) * 100) + '%' }} />
              </div>
              <small className="muted">
                Сегодня: {me.todayPts} / {me.dailyCap} баллов
              </small>
            </div>
          ) : (
            <p className="muted">Баллы начисляются, когда приложение открыто в Telegram.</p>
          )}

          <h2>Игры</h2>
          {LIST.map((g) => (
            <button key={g.id} className="gm-card" onClick={() => setGame(g.id)}>
              <span className="gm-ico">{g.ico}</span>
              <span className="mi-t">
                {g.t}
                <small>{g.d}</small>
              </span>
              <span className="mi-ch">›</span>
            </button>
          ))}

          <h2>Обмен на скидку</h2>
          {E.tiers.map((t) => (
            <div key={t.id} className="card gm-tier">
              <div>
                <b>Скидка {t.percent}%</b>
                <div className="muted" style={{ margin: 0, fontSize: 13 }}>
                  {t.cost} баллов
                </div>
              </div>
              <Button disabled={!me || me.points < t.cost || cooling} onClick={() => buy(t.id)}>
                Обменять
              </Button>
            </div>
          ))}
          <p className="muted">
            {cooling && me ? `Следующий обмен доступен с ${new Date(me.canBuyAt).toLocaleDateString('ru-RU')}. ` : ''}
            Промокод одноразовый, действует {E.promoValidDays} дней, на заказы от {E.minOrder.toLocaleString('ru-RU')} ₽, скидка не больше{' '}
            {E.maxDiscount.toLocaleString('ru-RU')} ₽. Обмен не чаще раза в {E.promoCooldownDays} дней.
          </p>
        </>
      )}
    </motion.div>
  );
}
