import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { playClickSound, playHoverSound } from '../../utils/audio';

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    playClickSound();
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '440px',
              background: 'var(--black)',
              borderLeft: '1px solid var(--border)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShoppingCart style={{ color: 'var(--accent)' }} />
                <h2 className="font-display" style={{ fontSize: '24px', margin: 0 }}>YOUR CART</h2>
              </div>
              <button
                onClick={closeCart}
                onMouseEnter={playHoverSound}
                style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {items.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', textAlign: 'center' }}>
                  <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                  <h3 className="font-heading" style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>Your cart is empty</h3>
                  <p className="font-body" style={{ fontSize: '14px', maxWidth: '250px' }}>Looks like you haven't added any arcade equipment yet.</p>
                  <button 
                    onClick={closeCart}
                    style={{ marginTop: '24px', padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {items.map((item) => (
                    <motion.div 
                      layout
                      key={item.id} 
                      style={{ display: 'flex', gap: '16px', background: 'var(--surface)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}
                    >
                      <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: 'var(--card)' }}>
                        <img src={item.image_url || item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', margin: '0 0 4px' }}>{item.brand || 'MMR'}</p>
                            <h4 className="font-heading" style={{ fontSize: '14px', color: '#fff', margin: '0 0 4px', lineHeight: 1.2 }}>{item.title}</h4>
                            <p className="font-mono" style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>${(item.discount_price || item.price).toLocaleString()}</p>
                          </div>
                          <button onClick={() => { playClickSound(); removeItem(item.id); }} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--black)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                            <button onClick={() => { playClickSound(); updateQuantity(item.id, item.quantity - 1); }} style={{ padding: '4px 8px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><Minus size={12} /></button>
                            <span className="font-mono" style={{ fontSize: '12px', padding: '0 8px', color: '#fff' }}>{item.quantity}</span>
                            <button onClick={() => { playClickSound(); updateQuantity(item.id, item.quantity + 1); }} style={{ padding: '4px 8px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><Plus size={12} /></button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span className="font-heading" style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subtotal</span>
                  <span className="font-mono" style={{ color: '#fff', fontSize: '18px', fontWeight: 600 }}>${getSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <p className="font-body" style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '24px' }}>
                  Shipping & taxes calculated at checkout.
                </p>
                <button
                  onClick={handleCheckout}
                  onMouseEnter={(e) => { playHoverSound(); e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#000'; }}
                  style={{
                    width: '100%', padding: '16px', background: 'var(--accent)', color: '#000', border: 'none',
                    borderRadius: '8px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
