import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Flame, MessageSquare, CheckCircle2, Truck } from 'lucide-react';
import { useProductStore } from '../admin/store/useProductStore';
import { playHoverSound, playClickSound, playSuccessSound } from '../utils/audio';
import InquiryModal from '../components/common/InquiryModal';

function EliteEquipmentCard({ item, index, onInquire }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    const normX = x / (box.width / 2);
    const normY = y / (box.height / 2);

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.8fr',
        background: 'var(--card)',
        border: hovered ? `1px solid ${item.accentColor}` : '1px solid var(--border)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 14px 40px rgba(0,0,0,0.5), 0 0 25px ${item.accentColor}25` : '0 4px 20px rgba(0,0,0,0.3)',
        cursor: 'none'
      }}
      className="elite-item-row"
      data-cursor="view"
    >
      {/* Image Section */}
      <div style={{ position: 'relative', minHeight: '320px', overflow: 'hidden' }}>
        <motion.img
          src={item.image}
          alt={item.title}
          animate={{ scale: hovered ? 1.08 : 1, filter: hovered ? 'brightness(1.2)' : 'brightness(1.05)' }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 40%, rgba(3,3,3,0.65) 100%)' }} className="elite-image-overlay" />
        {item.badge && (
          <span className="badge" style={{ position: 'absolute', top: '20px', left: '20px', background: item.badgeColor, color: '#000', fontWeight: 700 }}>
            {item.badge}
          </span>
        )}
      </div>

      {/* Details Section */}
      <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="font-heading" style={{ fontSize: '11px', color: item.accentColor, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {item.category}
          </span>
          <span style={{ color: 'var(--muted)', fontSize: '12px' }}>•</span>
          <span className="font-body" style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.condition} Equipment</span>
        </div>

        <h3 className="font-display" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '16px', lineHeight: 1.1 }}>
          {item.title}
        </h3>

        <p className="font-body" style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
          {item.description}
        </p>

        {/* Technical Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }} className="specs-grid">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
            <p className="font-heading" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>WARRANTY</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--accent)' }}>
              <Award size={14} />
              <span className="font-display" style={{ fontSize: '1.4rem' }}>{item.warranty}</span>
            </div>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
            <p className="font-heading" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>SETUP YIELD</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#fff' }}>
              <Flame size={14} style={{ color: 'var(--accent)' }} />
              <span className="font-display" style={{ fontSize: '1.4rem' }}>{item.yield}</span>
            </div>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
            <p className="font-heading" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>SHIPPING</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#fff' }}>
              <Truck size={14} style={{ color: 'var(--accent)' }} />
              <span className="font-display" style={{ fontSize: '1.4rem', textTransform: 'uppercase' }}>Freight</span>
            </div>
          </div>
        </div>

        {/* Handover protocol info */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text)' }} className="font-body">
              <CheckCircle2 size={14} style={{ color: 'var(--accent)' }} /> Certified Board Harness
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text)' }} className="font-body">
              <ShieldCheck size={14} style={{ color: 'var(--accent)' }} /> Anti-Cheat Verified
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span className="font-display" style={{ fontSize: '2.2rem', color: 'var(--accent)' }}>${item.price}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSuccessSound();
                onInquire(item);
              }}
              style={{ cursor: 'none', background: 'var(--accent)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}
              data-cursor="buy"
            >
              Order Cabinet <MessageSquare size={12} />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default function PopularAccountsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const handleInquire = (item) => {
    setSelectedItem(item);
    setIsInquiryOpen(true);
  };

  const products = useProductStore(state => state.products);
  const activeProducts = products.filter(prod => prod.active);
  // Filter for elite top earner machines (Complete Cabinets & Genuine OEM boards)
  const eliteEquipment = activeProducts.filter(prod => prod.category === 'Cabinets' || prod.badge === 'Genuine OEM');

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="mmr-container">

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '6px 16px', borderRadius: '99px', marginBottom: '16px' }}>
            <Flame size={14} style={{ color: 'var(--accent)' }} />
            <span className="font-heading" style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>High Yield Equipment Only</span>
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 6vw, 4.8rem)', color: '#fff', lineHeight: 1 }}>
            TOP <span style={{ color: 'var(--accent)' }}>EARNERS</span>
          </h1>
          <p className="font-body" style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '500px', margin: '12px auto 0', lineHeight: 1.6 }}>
            Our most profitable skill terminals and classic multi-game machines proven to maximize route earnings and customer engagement.
          </p>
        </div>

        {/* Elite Catalog Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {eliteEquipment.map((item, index) => (
            <EliteEquipmentCard key={item.id} item={item} index={index} onInquire={handleInquire} />
          ))}
        </div>

      </div>

      {/* B2B Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        item={selectedItem}
      />

      <style>{`
        @media (max-width: 900px) {
          .elite-item-row { grid-template-columns: 1fr !important; }
          .elite-image-overlay { background: linear-gradient(0deg, rgba(3,3,3,0.95) 40%, transparent 100%) !important; }
        }
        @media (max-width: 600px) {
          .specs-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
        }
      `}</style>
    </div>
  );
}
