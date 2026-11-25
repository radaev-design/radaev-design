import { useState } from 'react';
import { motion } from 'framer-motion';
import { asset } from './utils';

const word = 'RADAEV'.split('');

function Fallback() {
  return (
    <>
      <motion.i className="sp-orb o1" animate={{ y: [0, -24, 0], rotate: [0, 8, 0] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.i className="sp-orb o2" animate={{ y: [0, 20, 0], x: [0, -10, 0] }} transition={{ duration: 3.4, repeat: Infinity }} />
      <motion.i className="sp-orb o3" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.6, repeat: Infinity }} />
      <div className="sp-logo">
        {word.map((c, i) => (
          <motion.span key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 220, damping: 14 }}>
            {c}
          </motion.span>
        ))}
        <motion.b initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.75 }}>.DESIGN</motion.b>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 1 }}>Creative Digital Studio</motion.p>
      <div className="sp-bar"><motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.9, ease: 'easeInOut' }} /></div>
    </>
  );
}

export function Splash() {
  const [bad, setBad] = useState(false);
  return (
    <motion.div className="splash" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.5 }}>
      {bad ? (
        <Fallback />
      ) : (
        <video
          src={asset('splash/splash.mp4')}
          poster={asset('splash/poster.jpg')}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onError={() => setBad(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </motion.div>
  );
}
