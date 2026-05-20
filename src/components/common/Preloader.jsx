import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingTexts = [
  'DECRYPTING MMR ECOSYSTEM...',
  'ESTABLISHING ESCROW SAFE-LOCK VAULTS...',
  'SCANNING HAND-VETTED INVENTORIES...',
  'VETTING ANTI-RECALL SIGNATURE KEYS...',
  'SYNCING INSTANT TRANSITION CHANNELS...',
  'SECURE CONNECTION ESTABLISHED.',
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock body scrolling during load
    document.body.style.overflow = 'hidden';

    // Rapid progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            document.body.style.overflow = 'auto'; // Restore scroll
          }, 600);
          return 100;
        }
        // Jump in pseudo-random organic chunks
        const diff = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + diff, 100);
      });
    }, 90);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Text ticker cycling
  useEffect(() => {
    if (progress === 100) {
      setTextIndex(loadingTexts.length - 1);
      return;
    }
    const idx = Math.min(
      Math.floor((progress / 100) * loadingTexts.length),
      loadingTexts.length - 2
    );
    setTextIndex(idx);
  }, [progress]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          exit={{ 
            y: '-100%',
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } 
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#030303',
            color: '#ffffff',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(24px, 5vw, 60px)',
            fontFamily: 'JetBrains Mono, monospace',
            overflow: 'hidden',
          }}
        >
          {/* Subtle grid mesh background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.04,
              backgroundImage: `
                radial-gradient(circle, #ef4444 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px, 20px 20px, 20px 20px',
              pointerEvents: 'none',
            }}
          />

          {/* Top Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
              MMR SECURE SYSTEM V2.0
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span 
                className="live-dot"
                style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} 
              />
              <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>
                GATEWAY 100% SECURED
              </span>
            </div>
          </div>

          {/* Center decrypter loader */}
          <div style={{ zIndex: 10, maxWidth: '600px', width: '100%', margin: '0 auto', textAlign: 'left' }}>
            <h1 
              className="font-display" 
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', lineHeight: 0.9, letterSpacing: '0.02em', marginBottom: '24px' }}
            >
              MMR<br />
              <span style={{ color: 'var(--accent)' }}>AMUSEMENTS</span>
            </h1>

            {/* Live decrypt text ticker */}
            <div style={{ height: '24px', overflow: 'hidden', marginBottom: '16px' }}>
              <motion.p
                key={textIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', m: 0 }}
              >
                {loadingTexts[textIndex]}
              </motion.p>
            </div>

            {/* Modern neon glowing loader bar */}
            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '9px', position: 'relative', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent), #f97316)',
                  boxShadow: '0 0 10px var(--accent), 0 0 20px #f97316',
                }}
              />
            </div>
          </div>

          {/* Bottom stats details */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 }}>
            <div>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: '0 0 4px 0' }}>MIDDLEMAN SAFE ESCROW</p>
              <p style={{ fontSize: '11px', color: '#fff', margin: 0, fontWeight: 700 }}>VERIFICATION VERDICT: PASSED</p>
            </div>
            <div className="font-display" style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', color: 'var(--accent)', lineHeight: 0.8 }}>
              {String(progress).padStart(3, '0')}%
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
