import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Cinematic wipe transition
const wipeVariants = {
  initial: { top: 0, height: '100vh' },
  animate: { top: '100vh', height: 0 },
  exit: { top: 0, height: '100vh' }
};

export default function PageTransition({ children }) {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {/* Wipe layer */}
      <motion.div
        key={`wipe-${location.pathname}`}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={wipeVariants}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          background: 'var(--black)',
          zIndex: 99,
          pointerEvents: 'none'
        }}
      />
      
      {/* Page Content Layer */}
      <motion.div
        key={`page-${location.pathname}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
