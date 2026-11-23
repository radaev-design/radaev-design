import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Mascot, Pose } from '../ui/Mascot';
import type { Tab } from './tabs';

export interface TourStep {
  tab?: Tab;
  pose: Pose;
  title: string;
  text: string;
}

export const TOUR: TourStep[] = [
  { pose: 'hello', title: 'Привет! Я MODO!', text: 'Хочу помочь тебе разобраться в этом приложении!' },
  { tab: 'home', pose: 'point', title: 'Главная', text: 'Здесь ты узнаешь о студии, увидишь предложения и новинки.' },
  { tab: 'catalog', pose: 'point', title: 'Услуги', text: 'Выбирай нужное и добавляй в заказ!' },
  { tab: 'orders', pose: 'think', title: 'Заказы', text: 'Здесь выбранные услуги. Когда будешь готов, отправь заявку менеджеру.' },
  { tab: 'profile', pose: 'hello', title: 'Профиль', text: 'Ссылки, настройки и приглашение друга.' },
];

interface Props {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

export function Onboarding({ step, onNext, onSkip }: Props) {
  const s = TOUR[step];
  const first = step === 0;
  const last = step === TOUR.length - 1;

  return (
    <motion.div className="tour" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="tour-panel"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
      >
        <div className="tour-mascot">
          <Mascot pose={s.pose} size={140} />
        </div>
        <div className="tour-bubble">
          <h2>{s.title}</h2>
          <p>{s.text}</p>
        </div>
        {!first && (
          <div className="tour-progress">
            <span>Знакомство с приложением</span>
            <span>
              {step} / {TOUR.length - 1}
            </span>
          </div>
        )}
        <Button block onClick={onNext}>
          {first ? 'Давай познакомимся!' : last ? 'Завершить' : 'Далее'}
        </Button>
        {!last && (
          <Button block variant="secondary" onClick={onSkip}>
            {first ? 'Не нужна помощь' : 'Пропустить'}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
