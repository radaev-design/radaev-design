import { motion } from 'framer-motion';

type Pose =
  | 'hello'
  | 'point'
  | 'think'
  | 'coin'
  | 'question'
  | 'sad'
  | 'success';

const poses: Record<Pose, string> = {
  hello: '/mascot/hello.png',
  point: '/mascot/point.png',
  think: '/mascot/think.png',
  coin: '/mascot/coin.png',
  question: '/mascot/question.png',
  sad: '/mascot/sad.png',
  success: '/mascot/success.png',
};

const fallback: Record<Pose, string> = {
  hello: '👋',
  point: '👉',
  think: '🤔',
  coin: '🪙',
  question: '❓',
  sad: '🥺',
  success: '🎉',
};

interface Props {
  pose?: Pose;
  text?: string;
  size?: number;
  compact?: boolean;
}

export function MascotGuide({
  pose = 'hello',
  text,
  size = 110,
  compact = false,
}: Props) {
  return (
    <motion.div
      className={`mascot-guide${compact ? ' compact' : ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mascot-image" style={{ width: size, height: size }}>
        <img
          src={poses[pose]}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span>{fallback[pose]}</span>
      </div>
      {text && <div className="mascot-bubble">{text}</div>}
    </motion.div>
  );
}
