import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, ArrowRight, Tag, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deals } from '../../data/products';
import { playHoverSound, playClickSound, playSuccessSound } from '../../utils/audio';
import InquiryModal from '../common/InquiryModal';

function DealCard({ pkg, i, onInquire }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    
    // Mouse position relative to the center of the card
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Normalize coordinates to -1 to 1
    const normX = x / (box.width / 2);
    const normY = y / (box.height / 2);

    // Apply rotation limits (max 8 degrees tilt)
    setTilt({
      x: -normY * 8,
      y: normX * 8
    });
  };

  const handleMouseEnter = () => {
    setHovered(true);
    playHoverSound();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="ticket-border"
      style={{
        background: i === 1 ? 'var(--surface)' : 'var(--card)',
        outline: i === 1 ? `1px solid var(--accent)` : 'none',
        outlineOffset: '-1px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 14px 40px rgba(0,0,0,0.5), 0 0 25px var(--accent)25` : '0 4px 20px rgba(0,0,0,0.3)',
        cursor: 'none'
      }}
      data-cursor="view"
    >
      {/* Top accent line for highlighted */}
      {i === 1 && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--accent)' }} />
      )}
      
      <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
        <span className="badge" style={{ background: i === 1 ? 'var(--accent)' : 'var(--muted)', color: '#000', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tag size={10} /> {pkg.discount}
        </span>
      </div>

      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Name + Price */}
        <div style={{ marginBottom: '22px' }}>
          <p className="font-heading" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
            {pkg.category}
          </p>
          <h3 className="font-display" style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '12px', minHeight: '44px', lineHeight: 1.2 }}>
            {pkg.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="font-display" style={{ fontSize: '3rem', lineHeight: 1, color: i === 1 ? 'var(--accent)' : '#fff' }}>
              ₹{pkg.price}
            </span>
            <span className="font-body" style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'line-through' }}>₹{pkg.originalPrice}</span>
          </div>
        </div>

        <div className="rule" style={{ marginBottom: '22px' }} />

        {/* Features */}
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, marginBottom: '28px' }}>
          {pkg.features.map((f, j) => (
            <motion.li
              key={j}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + j * 0.05 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
            >
              <span style={{
                marginTop: '2px', width: '16px', height: '16px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <Check size={9} style={{ color: 'var(--accent)' }} strokeWidth={3} />
              </span>
              <span className="font-body" style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>{f}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            playSuccessSound();
            onInquire({
              id: pkg.id,
              title: pkg.title,
              category: pkg.category,
              price: pkg.price,
              image: '/hero_marketplace.png', // valid default deal image
              badge: pkg.discount,
              badgeColor: 'var(--accent)',
              accentColor: 'var(--accent)',
              description: pkg.features.join(', ')
            });
          }}
          style={{
            cursor: 'none', width: '100%',
            padding: '13px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: '13px',
            letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s',
            background: i === 1 ? 'var(--accent)' : 'transparent',
            color: i === 1 ? '#000' : '#fff',
            border: i === 1 ? 'none' : '1px solid rgba(255,255,255,0.1)',
          }}
          data-cursor="buy"
        >
          <MessageSquare size={13} /> Inquire Bundle
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function AccountDeals() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const handleInquire = (item) => {
    setSelectedItem(item);
    setIsInquiryOpen(true);
  };

  return (
    <section id="deals-section" className="mmr-section mmr-section-pad" style={{ background: 'var(--black)' }}>
      <div className="mmr-container">

        {/* Header */}
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '56px' }}>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-label"
            style={{ marginBottom: '12px' }}
          >
            Flash Drops
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4.2rem)', color: '#fff', lineHeight: 0.95, marginBottom: '14px' }}
          >
            LIMITED TIME<br />
            <span style={{ color: 'var(--accent)' }}>OFFERS</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body"
            style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.75 }}
          >
            Highly-discounted route bundles, parts clearances, and OEM components. Extreme values ready for secure dispatch!
          </motion.p>
        </div>

        {/* 3 equal cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          width: '100%',
          alignItems: 'stretch',
          paddingTop: '16px'
        }}
          className="packages-grid"
        >
          {deals.map((pkg, i) => (
            <DealCard key={pkg.id} pkg={pkg} i={i} onInquire={handleInquire} />
          ))}
        </div>

        {/* B2B enquiry strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          style={{
            marginTop: '36px', width: '100%',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
            gap: '16px', padding: '22px 28px',
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px',
          }}
        >
          <div>
            <p className="font-heading" style={{ color: '#fff', fontSize: '14px', fontWeight: 600, letterSpacing: '0.06em' }}>
              Operating a Skill Game Route or Tavern?
            </p>
            <p className="font-body" style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '3px' }}>
              We buy used Cherry Master countertop slot cabinets, fish game boards, and route terminal inventories. Get competitive cash payouts.
            </p>
          </div>
          <motion.div
            whileHover={{ x: 4 }}
            style={{ cursor: 'none', flexShrink: 0 }}
          >
            <Link
              to="/support"
              className="btn btn-outline btn-sm"
              style={{ cursor: 'none', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Get Route Equipment Valuation <ArrowRight size={12} />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Reusable B2B Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        item={selectedItem}
      />

      <style>{`
        @media (max-width: 900px)  { .packages-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
