import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BadgeCheck, Star } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

function ReviewCard({ review }) {
  return (
    <div style={{
      flexShrink: 0, width: '290px', margin: '0 8px',
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '18px',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      {/* Stars */}
      <div style={{ display: 'flex', gap: '3px' }}>
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={11}
            style={{ fill: i <= review.rating ? 'var(--accent)' : 'transparent', color: i <= review.rating ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="font-body" style={{ fontSize: '13px', color: '#e5e7eb', lineHeight: 1.65, flex: 1 }}>
        "{review.comment}"
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: review.avatarColor,
            fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: '11px', color: '#fff',
          }}>
            {review.avatar}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <p className="font-heading" style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{review.name}</p>
              {review.verified && <BadgeCheck size={10} style={{ color: 'var(--accent)' }} />}
            </div>
            <p className="font-body" style={{ fontSize: '10px', color: '#e5e7eb' }}>{review.handle}</p>
          </div>
        </div>
        <div className="font-body" style={{ fontSize: '10px', color: '#e5e7eb' }}>
          {review.icon}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const d1 = [...testimonials, ...testimonials];
  const d2 = [...[...testimonials].reverse(), ...[...testimonials].reverse()];

  return (
    <section id="events" className="mmr-section mmr-section-pad" style={{ background: 'var(--black)', overflow: 'hidden' }}>
      <div className="mmr-container">
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-label"
            style={{ marginBottom: '12px' }}
          >
            Reviews
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', color: '#fff', lineHeight: 0.95, marginBottom: '18px' }}
          >
            LOVED BY<br />
            <span style={{ color: 'var(--accent)' }}>50,000+ GAMERS</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              border: '1px solid var(--border)', borderRadius: '99px', padding: '8px 20px',
            }}
          >
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={12} style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />
              ))}
            </div>
            <span className="font-display" style={{ color: '#fff', fontSize: '1.2rem' }}>4.9</span>
            <span className="font-body" style={{ fontSize: '11px', color: '#e5e7eb' }}>from 8,000+ reviews</span>
          </motion.div>
        </div>
      </div>

      {/* Row 1 — scrolls left, edge-to-edge */}
      <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '12px' }}>
        <div className="marquee-left">
          {d1.map((r, i) => <ReviewCard key={`a${i}`} review={r} />)}
        </div>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '80px', background: 'linear-gradient(to right, var(--black), transparent)', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '80px', background: 'linear-gradient(to left, var(--black), transparent)', pointerEvents: 'none', zIndex: 2 }} />
      </div>

      {/* Row 2 — scrolls right */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="marquee-right">
          {d2.map((r, i) => <ReviewCard key={`b${i}`} review={r} />)}
        </div>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '80px', background: 'linear-gradient(to right, var(--black), transparent)', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '80px', background: 'linear-gradient(to left, var(--black), transparent)', pointerEvents: 'none', zIndex: 2 }} />
      </div>

      <div className="rule" style={{ marginTop: '80px' }} />
    </section>
  );
}

