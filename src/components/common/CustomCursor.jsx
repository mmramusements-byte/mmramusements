import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hoverType, setHoverType] = useState(null); // 'buy', 'view', 'click', 'close'
  const [isVisible, setIsVisible] = useState(false);

  // Motion values for smooth, lag-free hardware accelerated translation
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer ring uses a spring animation to create the modern "lagging lag" trail effect
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    // Global hover detection for specialized cursors
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setHoverType(target.getAttribute('data-cursor'));
      } else {
        // Fallback for standard links/buttons if not annotated specifically
        const isClickable = e.target.closest('a, button, [role="button"], input[type="submit"]');
        if (isClickable) {
          setHoverType('click');
        } else {
          setHoverType(null);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  // Custom styling states mapping to our Awwwards theme
  const getRingStyles = () => {
    switch (hoverType) {
      case 'buy':
        return {
          width: 60,
          height: 60,
          borderColor: 'var(--accent)',
          background: 'rgba(239, 68, 68, 0.1)',
        };
      case 'view':
        return {
          width: 65,
          height: 65,
          borderColor: 'var(--blue)',
          background: 'rgba(59, 130, 246, 0.12)',
        };
      case 'close':
        return {
          width: 45,
          height: 45,
          borderColor: '#ffffff',
          background: 'rgba(255, 255, 255, 0.15)',
        };
      case 'click':
        return {
          width: 40,
          height: 40,
          borderColor: 'var(--accent)',
          background: 'transparent',
        };
      default:
        return {
          width: 24,
          height: 24,
          borderColor: 'rgba(239, 68, 68, 0.4)',
          background: 'transparent',
        };
    }
  };

  const ringStyles = getRingStyles();

  return (
    <>
      {/* 1. Fast central dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: cursorX,
          top: cursorY,
          x: '-50%',
          y: '-50%',
          width: hoverType ? '4px' : '6px',
          height: hoverType ? '4px' : '6px',
          backgroundColor: hoverType === 'view' ? 'var(--blue)' : 'var(--accent)',
          borderRadius: '50%',
          zIndex: 99999,
          pointerEvents: 'none',
          boxShadow: `0 0 8px ${hoverType === 'view' ? 'var(--blue)' : 'var(--accent)'}`,
        }}
      />

      {/* 2. Slow outer ring tracker with text overlays */}
      <motion.div
        animate={{
          width: ringStyles.width,
          height: ringStyles.height,
          borderColor: ringStyles.borderColor,
          backgroundColor: ringStyles.background,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        style={{
          position: 'fixed',
          left: ringX,
          top: ringY,
          x: '-50%',
          y: '-50%',
          borderStyle: 'solid',
          borderWidth: '1.5px',
          borderRadius: '50%',
          zIndex: 99998,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Floating miniature text indicator */}
        {(hoverType === 'buy' || hoverType === 'view' || hoverType === 'close') && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display"
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#ffffff',
              textTransform: 'uppercase',
            }}
          >
            {hoverType === 'buy' ? 'ADD' : hoverType === 'view' ? 'VIEW' : '✖'}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
