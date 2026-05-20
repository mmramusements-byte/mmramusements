import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingCart, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={heroRef}
      id="home"
      style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--black)' }}
    >
      {/* ── FULL-BLEED BACKGROUND IMAGE ── */}
      <motion.div
        style={{ position: 'absolute', inset: 0, y, opacity, pointerEvents: 'none' }}
      >
        <img 
          src="/hero.png" 
          alt="MMR Amusements Showroom" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.9, filter: 'brightness(1.1) contrast(1.05)' }} 
        />
        {/* Grounding overlays: lightened to show the beautiful glowing showroom */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, transparent 15%, rgba(3,3,3,0.45) 80%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(3,3,3,0.85) 0%, rgba(3,3,3,0.4) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, var(--black) 0%, transparent 25%)' }} />
      </motion.div>

      {/* ── CONTENT LAYER ── */}
      <div className="mmr-container" style={{ position: 'relative', zIndex: 10, paddingTop: '7rem', paddingBottom: '5rem', width: '100%' }}>
        <div style={{ maxWidth: '720px' }}>

          {/* Intro Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}
          >
            <div style={{ width: '40px', height: '2px', background: 'var(--accent)' }} />
            <span className="section-label" style={{ margin: 0, color: 'var(--accent)', fontWeight: 600 }}>
              The Nation's Premium Amusement Equipment Distributor
            </span>
          </motion.div>

          {/* Headline */}
          <div style={{ overflow: 'hidden', marginBottom: '2px' }}>
            <motion.h1
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.22, duration: 0.88, ease: [0.16,1,0.3,1] }}
              className="font-display"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', lineHeight: 0.92, color: '#fff' }}
            >
              PREMIUM SKILL
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
            <motion.h1
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.32, duration: 0.88, ease: [0.16,1,0.3,1] }}
              className="font-display"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', lineHeight: 0.92, color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}
            >
              AMUSEMENT CABINETS
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.88, duration: 0.65 }}
            className="font-body"
            style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', maxWidth: '540px', marginBottom: '2.5rem' }}
          >
            Industrial-grade multi-player fish tables, countertop terminals, Cherry Master 8-liner cabinets, multi-game PCBs, and secure bill validators. Engineered for high earnings, route reliability, and premium tavern/convenience store setups.
          </motion.p>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '3rem' }}
          >
            {[
              { icon: <ShieldCheck size={16} />, t: '2-Year Equipment & Board Warranty' },
              { icon: <Zap size={16} />, t: 'Secure Freight Shipping Nationwide' },
            ].map((x, i) => (
              <div key={i} className="font-body" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#fff', fontWeight: 500 }}>
                <span style={{ color: 'var(--accent)' }}>{x.icon}</span> {x.t}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.65, ease: [0.16,1,0.3,1] }}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
          >
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
              <Link to="/gaming-carts" className="btn btn-accent" style={{ cursor: 'none', fontSize: '15px', padding: '16px 36px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <ShoppingCart size={18} style={{ marginRight: '6px' }} /> Shop Cabinets & Parts
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
              <Link to="/deals" className="btn btn-outline" style={{ cursor: 'none', fontSize: '15px', padding: '16px 36px', background: 'rgba(255,255,255,0.03)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                View Clearance Specials <ArrowRight size={16} style={{ marginLeft: '6px' }} />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
