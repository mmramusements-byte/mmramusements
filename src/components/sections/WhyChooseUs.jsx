import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Shield, Clock, Globe, MessageCircle, Award } from 'lucide-react';

const features = [
  { icon: <Zap size={19} />, title: 'Instant Fun', desc: 'No queuing. Walk in, tap your wristband, and jump straight into any attraction.' },
  { icon: <Shield size={19} />, title: 'Fully Safe', desc: 'All rides and equipment are certified, maintained daily, and staffed by trained professionals.' },
  { icon: <Clock size={19} />, title: 'Open Late', desc: 'We stay open until 11pm on weekends so the fun never has to end early.' },
  { icon: <Globe size={19} />, title: 'Any Occasion', desc: 'Birthdays, corporate outings, date nights, school trips — we handle every format.' },
  { icon: <MessageCircle size={19} />, title: 'Friendly Staff', desc: 'Our team is here on-site every opening hour and available online 24/7 to assist you.' },
  { icon: <Award size={19} />, title: 'Award Winning', desc: 'Voted #1 indoor entertainment venue three years running by the local community.' },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="mmr-section mmr-section-pad" style={{ background: 'var(--surface)' }}>
      <div className="mmr-container">

        {/* Full-width cinematic image banner */}
        <div style={{
          position: 'relative', width: '100%', height: 'clamp(220px, 28vw, 380px)',
          borderRadius: '14px', overflow: 'hidden', marginBottom: '56px',
        }}>
          <img src="/carnival.png" alt="MMR rides" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(8,8,8,0.94) 25%, rgba(8,8,8,0.5) 60%, rgba(8,8,8,0.12) 100%)',
          }} />
          <div ref={ref} style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', padding: 'clamp(24px, 5vw, 56px)',
          }}>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="section-label"
              style={{ marginBottom: '10px' }}
            >
              Why MMR
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-display"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', color: '#fff', lineHeight: 0.95 }}
            >
              BUILT FOR<br />
              <span style={{ color: 'var(--accent)' }}>MAXIMUM FUN</span>
            </motion.h2>
          </div>
        </div>

        {/* Features — 3 columns, full width */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          width: '100%',
        }}
          className="why-grid"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.6 }}
              whileHover={{ y: -5 }}
              style={{
                padding: '24px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                cursor: 'none',
                transition: 'border-color 0.25s, box-shadow 0.25s',
                width: '100%',
              }}
              className="why-card"
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '9px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)',
                color: 'var(--accent)', marginBottom: '16px',
                transition: 'transform 0.25s',
              }}>
                {f.icon}
              </div>
              <h3 className="font-heading" style={{ fontWeight: 600, color: '#fff', fontSize: '15px', letterSpacing: '0.05em', marginBottom: '8px' }}>
                {f.title}
              </h3>
              <p className="font-body" style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.75 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .why-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px)  { .why-grid { grid-template-columns: 1fr !important; } }
        .why-card:hover { border-color: rgba(245,158,11,0.28) !important; box-shadow: 0 6px 24px rgba(245,158,11,0.06); }
      `}</style>

      <div className="rule" style={{ marginTop: '80px' }} />
    </section>
  );
}
