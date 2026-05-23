import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Zap, Award, Layers, Sparkles, Truck, MessageSquare, ShoppingCart } from 'lucide-react';
import {useSearchParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../admin/store/useProductStore';
import { playHoverSound, playClickSound, playSuccessSound } from '../utils/audio';
import InquiryModal from '../components/common/InquiryModal';
import { useCartStore } from '../store/useCartStore';

export default function GamingCartsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize from URL or default to 'All'
  const urlCat = searchParams.get('cat');
  const [selectedCategory, setSelectedCategory] = useState(urlCat || 'All');

  const [selectedItem, setSelectedItem] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Sync state if URL changes externally
  useEffect(() => {
    setSelectedCategory(searchParams.get('cat') || 'All');
  }, [searchParams]);

  // Dynamically derive categories from active products
  const products = useProductStore(state => state.products);
  const activeProducts = products.filter(prod => prod.active);

  const categoriesList = ['All', ...new Set(activeProducts.map(p => p.category).filter(Boolean))].sort();

  const handleInquire = (item) => {
    setSelectedItem(item);
    setIsInquiryOpen(true);
  };

  // Filter products based on search and category selection
  const filteredProducts = activeProducts.filter(prod => {
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
                  if (cat === 'All') {
                    searchParams.delete('cat');
                  } else {
                    searchParams.set('cat', cat);
                  }
                  setSearchParams(searchParams);
                  playClickSound();
                }}
                style={{
                  cursor: 'pointer',
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

      {/* Reusable ORDER NOW Modal */}
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
  const navigate = useNavigate();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const addItem = useCartStore(state => state.addItem);

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setHovered(true); playHoverSound(); }}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onClick={() => { playClickSound(); onInquire(item); }}
      style={{
        position: 'relative',
        cursor: 'pointer',
        height: '440px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--card)',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 14px 40px rgba(0,0,0,0.6), 0 0 25px rgba(34,197,94,0.15)` : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <motion.img
          src={item.image_url}
          alt={item.title}
          animate={{ scale: hovered ? 1.08 : 1, filter: hovered ? 'brightness(1.1)' : 'brightness(1)' }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 100%)', transition: 'opacity 0.3s', opacity: hovered ? 1 : 0.7, transition: 'opacity 0.3s', opacity: hovered ? 1 : 0.8 }} />
      </div>

      {/* Badges */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        {item.badge ? (
          <span className="badge" style={{ background: item.badgeColor, color: '#000', fontWeight: 700, fontSize: '11px' }}>{item.badge}</span>
        ) : <div />}
        <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '5px', background: 'rgba(3,3,3,0.85)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
          ${item.price}
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
          <p className="font-body" style={{ fontSize: '13px', color: '#e5e7eb', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.description}
          </p>

          </motion.div>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
            <span className="font-body" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fff', fontWeight: 500 }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent)' }} /> Verified
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.id}`); }}
              style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', cursor: 'pointer', background: 'var(--accent)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              ORDER NOW <ShoppingCart size={14} />
            </motion.button>
          </div>
        
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

