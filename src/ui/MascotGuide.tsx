
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export type MascotPose =
  | 'hello'
  | 'point'
  | 'think'
  | 'coin'
  | 'question'
  | 'sad'
  | 'success';

type MascotGuideProps = {
  pose?: MascotPose;
  size?: number;
  text?: string;
  compact?: boolean;
  className?: string;
  children?: ReactNode;
};

const MASCOT_IMAGES: Record<MascotPose, string> = {
  hello: '/mascot/hello.png',
  point: '/mascot/point.png',
  think: '/mascot/think.png',
  coin: '/mascot/coin.png',
  question: '/mascot/question.png',
  sad: '/mascot/sad.png',
  success: '/mascot/success.png',
};

const MASCOT_FALLBACKS: Record<MascotPose, string> = {
  hello: '👋',
  point: '👉',
  think: '🤔',
  coin: '🪙',
  question: '❓',
  sad: '🥺',
  success: '🎉',
};

export function MascotGuide({
  pose = 'hello',
  size = 120,
  text,
  compact = false,
  className = '',
  children,
}: MascotGuideProps) {
  return (
    <motion.div
      className={`mascot-guide ${compact ? 'mascot-compact' : ''} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mascot-visual">
        <motion.img
          src={MASCOT_IMAGES[pose]}
          alt="Маскот RADAEV.DESIGN"
          width={size}
          height={size}
          className="mascot-image"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';

            const fallback = target.nextElementSibling as HTMLElement | null;

            if (fallback) {
              fallback.style.display = 'flex';
            }
          }}
        />

        <div
          className="mascot-fallback"
          style={{
            width: size,
            height: size,
            display: 'none',
            fontSize: size * 0.55,
          }}
        >
          {MASCOT_FALLBACKS[pose]}
        </div>
      </div>

      {text && (
        <div className="mascot-bubble">
          {text}
        </div>
      )}

      {children}
    </motion.div>
  );
}

export default MascotGuide;
