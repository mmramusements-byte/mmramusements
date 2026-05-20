import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Globe, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const info = [
  {
    icon: <Clock size={17} style={{ color: 'var(--accent)' }} />,
    label: 'Fast Dispatch & Shipping',
    lines: ['Commercial freight shipping', 'Carefully packed & padded', 'Nationwide door-to-door delivery'],
  },
  {
    icon: <Globe size={17} style={{ color: 'var(--accent)' }} />,
    label: 'Verified route performance',
    lines: ['Pre-configured boards & wiring', 'Optimized yield payout setup', 'Field-tested in local venues'],
  },
  {
    icon: <ShieldCheck size={17} style={{ color: 'var(--accent)' }} />,
    label: 'Certified Hardware',
    lines: ['100% original OEM parts', 'Stress-tested by expert techs', 'Industry-standard secure warranty'],
  },
];

const mosaicPhotos = [
  { src: '/arcade.png', label: 'Fish Game Tables' },
  { src: '/hero_marketplace.png', label: 'Arcade Cabinets' },
  { src: '/vr.png', label: 'Skill Terminals' },
  { src: '/gokart.png', label: 'Amusement Rigs' },
];

export default function CategoryExperience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="about" className="mmr-section mmr-section-pad" style={{ background: 'var(--dark)' }}>
      <div className="mmr-container">
        {/* Two-col: text left, photo mosaic right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(32px, 5vw, 80px)',
          alignItems: 'center',
          width: '100%',
        }}
          className="about-grid"
        >
          {/* LEFT — Text */}
          <div ref={ref}>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="section-label"
              style={{ marginBottom: '12px' }}
            >
              Why Choose Us
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-display"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', color: '#fff', lineHeight: 0.95, marginBottom: '20px' }}
            >
              THE AMUSEMENT<br />
              <span style={{ color: 'var(--accent)' }}>REVOLUTION</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="font-body"
              style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '14px' }}
            >
              MMR Amusements was built with one mission: to empower route operators, arcade centers, and local taverns with heavy-duty, high-yielding amusement consoles. We provide the most reliable, legal, and premium cabinets and component setups with dedicated freight logistics.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.28 }}
              className="font-body"
              style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '32px' }}
            >
              Whether you are looking to install a massive multi-player fish table that serves as a visual crowd-puller, or need genuine motherboard kits (Cherry Master, Pot-O-Gold) and secure bill validators to keep coin-operated revenue running smoothly, our certified technicians are ready to deliver pre-configured systems directly to your venue.
            </motion.p>

            {/* Info blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
              {info.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)',
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-heading" style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '0.06em', marginBottom: '4px' }}>
                      {item.label}
                    </p>
                    {item.lines.map((l, j) => (
                      <p key={j} className="font-body" style={{ fontSize: '12px', color: 'var(--muted)' }}>{l}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 }}
              whileHover={{ scale: 1.02, y: -1 }}
              style={{ cursor: 'none', display: 'inline-flex' }}
            >
              <Link to="/gaming-carts" className="btn btn-accent" style={{ cursor: 'none', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Browse Equipment <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — Photo mosaic, fills full column */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              width: '100%',
            }}
          >
            {mosaicPhotos.map((g, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.38 }}
                className="img-card"
                style={{ height: i === 0 || i === 3 ? '210px' : '165px', width: '100%', overflow: 'hidden', borderRadius: '10px', cursor: 'none' }}
              >
                <img src={g.src} alt={g.label} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <div className="img-card-overlay" />
                <div style={{ position: 'absolute', bottom: '10px', left: '12px', zIndex: 10 }}>
                  <p className="font-heading" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                    {g.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .about-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="rule" style={{ marginTop: '80px' }} />
    </section>
  );
}
