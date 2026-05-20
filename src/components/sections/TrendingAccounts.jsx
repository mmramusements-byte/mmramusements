import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, MessageSquare, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { playHoverSound, playClickSound, playSuccessSound } from '../../utils/audio';
import InquiryModal from '../common/InquiryModal';

function TrendingCard({ item, index, onInquire }) {
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
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="store-card"
      style={{
        position: 'relative',
        cursor: 'none',
        height: '360px',
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--card)',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 14px 40px rgba(0,0,0,0.5), 0 0 25px ${item.accentColor}25` : '0 4px 20px rgba(0,0,0,0.3)',
      }}
      data-cursor="view"
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <motion.img
          src={item.image}
          alt={item.title}
          loading="lazy"
          animate={{ scale: hovered ? 1.08 : 1, filter: hovered ? 'brightness(1.2)' : 'brightness(1.05)' }}
          transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,3,3,0.7) 0%, rgba(3,3,3,0.35) 50%, transparent 100%)' }} />
      </div>

      {/* Badges */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
        {item.badge && (
          <span className="badge" style={{ background: item.badgeColor, color: '#000', fontWeight: 700, fontSize: '10px' }}>{item.badge}</span>
        )}
      </div>

      {/* Bottom Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '24px' }}>
        <span className="font-heading" style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
          <Flame size={10} style={{ color: 'var(--accent)' }} /> {item.category}
        </span>
        <h3 className="font-display" style={{ fontSize: '1.6rem', color: '#fff', lineHeight: 1.1, marginBottom: '6px' }}>
          {item.title}
        </h3>
        <p className="font-heading" style={{ fontSize: '11px', letterSpacing: '0.05em', color: item.accentColor, marginBottom: '12px' }}>
          {item.condition} • {item.warranty} Warranty
        </p>

        <motion.div
          initial={false}
          animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.32, ease: [0.16,1,0.3,1] }}
          style={{ overflow: 'hidden' }}
        >
          <p className="font-body" style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '16px' }}>
            {item.description}
          </p>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span className="font-display" style={{ fontSize: '1.6rem', color: hovered ? 'var(--accent)' : '#fff', transition: 'color 0.3s' }}>
            ₹{item.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              playSuccessSound();
              onInquire(item);
            }}
            style={{ cursor: 'none', background: item.accentColor || 'var(--accent)', color: '#000', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none', display: 'flex', alignItems: 'center', gap: '6px', opacity: hovered ? 1 : 0 }}
            data-cursor="buy"
          >
            <MessageSquare size={12} /> B2B Inquiry
          </motion.button>
        </div>
      </div>
      
      {/* Hover border glow */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute', inset: 0,
          border: `1px solid ${item.accentColor || 'var(--accent)'}`,
          borderRadius: '16px', pointerEvents: 'none', zIndex: 20
        }}
      />
    </motion.div>
  );
}

export default function TrendingAccounts() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const handleInquire = (item) => {
    setSelectedItem(item);
    setIsInquiryOpen(true);
  };

  // Get non-cabinet products (boards, validators, etc.)
  const hardwareList = products.filter(p => p.category !== 'Cabinets').slice(0, 3);

  return (
    <section id="trending-accounts" className="mmr-section mmr-section-pad" style={{ background: 'var(--black)' }}>
      <div className="mmr-container">
        {/* Header */}
        <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '48px' }}>
          <div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="section-label"
              style={{ marginBottom: '12px' }}
            >
              Hardware Parts & PCB Kits
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 4.2rem)', color: '#fff', lineHeight: 0.95 }}
            >
              TRENDING<br />
              <span style={{ color: 'var(--accent)' }}>PCB BOARDS</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body"
            style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '340px', lineHeight: 1.75 }}
          >
            Explore high-popularity replacement components, genuine OEM game motherboards, and stable payout skill boards to upgrade your route terminals.
          </motion.p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%' }} className="trending-grid">
          {hardwareList.map((item, i) => (
            <TrendingCard key={item.id} item={item} index={i} onInquire={handleInquire} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginTop: '56px' }}
        >
          <Link to="/popular" style={{ cursor: 'none', padding: '16px 36px', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} className="btn btn-outline">
            Browse Top Hardware <ArrowRight size={14} style={{ marginLeft: '6px' }} />
          </Link>
        </motion.div>
      </div>

      {/* Reusable B2B Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        item={selectedItem}
      />

      <style>{`
        @media (max-width: 1024px) { .trending-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .trending-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
