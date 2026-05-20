import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Zap, Award, Layers, Sparkles, Truck, MessageSquare } from 'lucide-react';
import { products } from '../data/products';
import { playHoverSound, playClickSound, playSuccessSound } from '../utils/audio';
import InquiryModal from '../components/common/InquiryModal';

const categoriesList = ['All', 'Cabinets', 'Boards', 'Validators', 'Parts'];

export default function GamingCartsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const handleInquire = (item) => {
    setSelectedItem(item);
    setIsInquiryOpen(true);
  };

  // Filter products based on search and category selection
  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prod.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="mmr-container">
        
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-label" style={{ marginBottom: '12px' }}>Route Operator Catalog</span>
          <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 6vw, 4.8rem)', color: '#fff', lineHeight: 1 }}>
            AMUSEMENT <span style={{ color: 'var(--accent)' }}>EQUIPMENT</span>
          </h1>
          <p className="font-body" style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '600px', margin: '12px auto 0', lineHeight: 1.6 }}>
            Premium commercial multi-game cabinets, high-yield PCB boards, bill acceptors, and genuine replacement parts.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '40px'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input
              type="text"
              placeholder="Search cabinets, boards, part numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '12px 16px 12px 48px',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Quick Filter Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  playClickSound();
                }}
                style={{
                  cursor: 'none',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontFamily: 'Oswald, sans-serif',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  border: `1px solid ${selectedCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
                  background: selectedCategory === cat ? 'var(--accent)' : 'transparent',
                  color: selectedCategory === cat ? '#000' : 'var(--muted)',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count Indicator */}
        <div style={{ marginBottom: '24px' }}>
          <p className="font-heading" style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Showing {filteredProducts.length} Premium {filteredProducts.length === 1 ? 'Product' : 'Products'}
          </p>
        </div>

        {/* Listings Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
              className="storefront-grid"
            >
              {filteredProducts.map((item, index) => {
                return (
                  <ProductCatalogCard key={item.id} item={item} index={index} onInquire={handleInquire} />
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: 'var(--surface)',
                borderRadius: '16px',
                border: '1px solid var(--border)'
              }}
            >
              <Sparkles size={40} style={{ color: 'var(--muted)', marginBottom: '16px' }} />
              <h3 className="font-display" style={{ fontSize: '2rem', color: '#fff', marginBottom: '8px' }}>NO EQUIPMENT FOUND</h3>
              <p className="font-body" style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '300px', margin: '0 auto' }}>
                Try adjusting your search terms or choosing a different equipment category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Reusable B2B Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        item={selectedItem}
      />

      <style>{`
        @media (max-width: 1024px) { .storefront-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .storefront-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function ProductCatalogCard({ item, index, onInquire }) {
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
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        cursor: 'none',
        height: '440px',
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
          animate={{ scale: hovered ? 1.08 : 1, filter: hovered ? 'brightness(1.2)' : 'brightness(1.05)' }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,3,3,0.7) 0%, rgba(3,3,3,0.35) 50%, transparent 100%)' }} />
      </div>

      {/* Badges */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        {item.badge ? (
          <span className="badge" style={{ background: item.badgeColor, color: '#000', fontWeight: 700, fontSize: '11px' }}>{item.badge}</span>
        ) : <div />}
        <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '5px', background: 'rgba(3,3,3,0.85)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
          ₹{item.price}
        </span>
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '24px' }}>
        <p className="font-heading" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: item.accentColor, marginBottom: '6px', fontWeight: 600 }}>
          {item.category} • {item.condition}
        </p>
        <h3 className="font-display" style={{ fontSize: '1.8rem', color: '#fff', lineHeight: 1.1, marginBottom: '12px' }}>
          {item.title}
        </h3>

        <motion.div
          initial={false}
          animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          {/* Key Stats Row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={13} style={{ color: 'var(--accent)' }} />
              <span className="font-heading" style={{ fontSize: '11px', color: 'var(--text)' }}>{item.warranty} Warranty</span>
            </div>
            {item.players > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={13} style={{ color: 'var(--accent)' }} />
                <span className="font-heading" style={{ fontSize: '11px', color: 'var(--text)' }}>{item.players}-Player</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Truck size={13} style={{ color: 'var(--accent)' }} />
              <span className="font-heading" style={{ fontSize: '11px', color: 'var(--text)' }}>{item.shipping}</span>
            </div>
          </div>

          <p className="font-body" style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '16px' }}>
            {item.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-body" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text)' }}>
              <ShieldCheck size={12} style={{ color: item.accentColor }} /> Inspected & Certified
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                playSuccessSound();
                onInquire(item);
              }}
              style={{ cursor: 'none', background: item.accentColor, color: '#000', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              data-cursor="buy"
            >
              Order Now <MessageSquare size={10} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{
          position: 'absolute', inset: 0,
          border: `1px solid ${item.accentColor}`,
          borderRadius: '16px', pointerEvents: 'none', zIndex: 20
        }}
      />
    </motion.div>
  );
}
