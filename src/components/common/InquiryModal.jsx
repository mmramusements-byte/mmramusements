import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Truck, Award, Zap, ShoppingCart, CreditCard, Plus, Minus } from 'lucide-react';
import { playClickSound, playHoverSound, playSuccessSound } from '../../utils/audio';
import { useCartStore } from '../../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function InquiryModal({ isOpen, onClose, item }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const navigate = useNavigate();

  if (!item) return null;

  const handleAddToCart = () => {
    playSuccessSound();
    for(let i=0; i<quantity; i++) {
      addItem(item);
    }
    toast.success(`${quantity}x ${item.title} added to cart`, {
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid var(--accent)'
      },
      iconTheme: {
        primary: 'var(--accent)',
        secondary: '#000',
      },
    });
    setQuantity(1);
  };

  const handleOrderNow = () => {
    handleAddToCart();
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              onClose();
              playClickSound();
              setQuantity(1);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(12px)',
              zIndex: 1000,
            }}
          />

          {/* Modal Container */}
          <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 1001,
            padding: '20px'
          }}>
            {/* Panel */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                pointerEvents: 'auto',
                width: '100%',
                maxWidth: '650px',
                background: 'linear-gradient(135deg, var(--card), var(--surface))',
                border: `1px solid ${item.accentColor || 'var(--accent)'}`,
                borderRadius: '24px',
                boxShadow: `0 24px 80px rgba(0,0,0,0.8), 0 0 40px ${(item.accentColor || 'var(--accent)')}15`,
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh'
              }}
            >
              {/* Header Visual */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden', flexShrink: 0 }}>
                <img
                  src={item.image_url || item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.75)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--card) 0%, rgba(0,0,0,0.5) 100%)' }} />
                
                {/* Close button */}
                <button
                  onClick={() => {
                    onClose();
                    playClickSound();
                    setQuantity(1);
                  }}
                  onMouseEnter={() => playHoverSound()}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    zIndex: 10
                  }}
                >
                  <X size={18} />
                </button>

                {/* Title and Category */}
                <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
                  <span className="font-heading" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: item.accentColor || 'var(--accent)', fontWeight: 700 }}>
                    {item.category} • {item.condition || 'Commercial'}
                  </span>
                  <h2 className="font-display" style={{ fontSize: '2rem', color: '#fff', margin: '4px 0 0', lineHeight: 1.1 }}>
                    {item.title}
                  </h2>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
                {/* Product Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="modal-specs-grid">
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <p className="font-heading" style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.05em' }}>Shipping</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#fff' }}>
                      <Truck size={12} style={{ color: 'var(--accent)' }} />
                      <span className="font-heading" style={{ fontSize: '11px', fontWeight: 600 }}>{item.shipping || 'Freight Dispatch'}</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <p className="font-heading" style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.05em' }}>Warranty</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#fff' }}>
                      <Award size={12} style={{ color: 'var(--accent)' }} />
                      <span className="font-heading" style={{ fontSize: '11px', fontWeight: 600 }}>{item.warranty || '6 Months'}</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <p className="font-heading" style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.05em' }}>Availability</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#fff' }}>
                      <Zap size={12} style={{ color: 'var(--accent)' }} />
                      <span className="font-heading" style={{ fontSize: '11px', fontWeight: 600 }}>{item.stock || 'In Stock'}</span>
                    </div>
                  </div>
                </div>

                {/* Description & Value */}
                <div>
                  <p className="font-body" style={{ fontSize: '14px', color: '#e5e7eb', lineHeight: 1.6, margin: 0 }}>
                    {item.description || 'Premium commercial route terminal and hardware modules. Fully burn-in tested, pre-loaded with latest system software, and wired according to custom standards.'}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', borderRadius: '12px' }}>
                    <div>
                      <span className="font-body" style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Unit Price</span>
                      <span className="font-display" style={{ fontSize: '2rem', color: '#fff', fontWeight: 'bold', lineHeight: 1 }}>${item.price}</span>
                    </div>
                    
                    {/* Quantity Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '4px' }}>
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{ background: 'transparent', border: 'none', color: '#fff', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-mono" style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        style={{ background: 'transparent', border: 'none', color: '#fff', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--accent)',
                      color: 'var(--accent)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(34,197,94,0.1)';
                      playHoverSound();
                    }}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    <ShoppingCart size={16} /> ADD TO CART
                  </button>

                  <button
                    onClick={handleOrderNow}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: 'var(--accent)',
                      border: 'none',
                      color: '#000',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      playHoverSound();
                    }}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <CreditCard size={16} /> ORDER NOW
                  </button>
                </div>

                {/* Guarantee note */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--muted)', fontSize: '11px', marginTop: '8px' }}>
                  <ShieldCheck size={13} style={{ color: 'var(--accent)' }} />
                  <span className="font-body">Secure commercial transaction processing and freight handling.</span>
                </div>
              </div>
            </motion.div>
          </div>

          <style>{`
            @media (max-width: 500px) {
              .modal-specs-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
