import { useEffect, useState } from 'react';
import { useMe } from '../../storage/me';
import { Button } from '../../ui/Button';

const WORDS = [
  'ДИЗАЙН', 'ЛОГОТИП', 'БРЕНД', 'ШРИФТ', 'ПАЛИТРА', 'МАКЕТ', 'ВИДЕО', 'МОНТАЖ', 'ПИКСЕЛЬ', 'РЕКЛАМА', 'СТУДИЯ',
  'ТЕЛЕГРАМ', 'ТРЕНД', 'КОНТЕНТ', 'ЛЕНДИНГ', 'ПРОЕКТ', 'КЛИЕНТ', 'БАННЕР', 'ЭСКИЗ', 'ГРАФИКА', 'ПЛАКАТ',
  'АНИМАЦИЯ', 'СЦЕНАРИЙ', 'ПРЕЗЕНТАЦИЯ',
];
const ABC = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
const pick = () => WORDS[Math.floor(Math.random() * WORDS.length)];

export function WordGame() {
  const { award } = useMe();
  const [word, setWord] = useState(pick);
  const [used, setUsed] = useState<string[]>([]);

  const wrong = used.filter((l) => !word.includes(l)).length;
  const won = [...word].every((l) => used.includes(l));
  const lost = wrong >= 6;

  useEffect(() => {
    if (won) award('word', 'win');
  }, [won]); // eslint-disable-line

  const reset = () => {
    setWord(pick());
    setUsed([]);
  };

  return (
    <div>
      <h1>Угадай слово</h1>
      <p className="muted">Тема: дизайн и маркетинг. Победа +8 баллов.</p>
      <div style={{ textAlign: 'center', fontSize: 22 }}>{'❤️'.repeat(6 - wrong)}{'🖤'.repeat(wrong)}</div>
      <div className="wd">
        {[...word].map((l, i) => (
          <span key={i}>{used.includes(l) || lost ? l : ''}</span>
        ))}
      </div>
      {won && <h2 style={{ textAlign: 'center' }}>Верно! 🎉</h2>}
      {lost && <h2 style={{ textAlign: 'center' }}>Не угадали 🥺</h2>}
      <div className="kb">
        {ABC.map((l) => {
          const u = used.includes(l);
          return (
            <button
              key={l}
              className={u ? (word.includes(l) ? 'ok' : 'no') : ''}
              disabled={u || won || lost}
              onClick={() => setUsed((x) => [...x, l])}
            >
              {l}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 16 }}>
        <Button block variant={won || lost ? 'primary' : 'secondary'} onClick={reset}>
          Новое слово
        </Button>
      </div>
    </div>
  );
}
