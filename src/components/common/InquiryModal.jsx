import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MessageCircle, ExternalLink, ShieldCheck, Truck, Award, Zap } from 'lucide-react';
import { playClickSound, playHoverSound } from '../../utils/audio';

export default function InquiryModal({ isOpen, onClose, item }) {
  if (!item) return null;

  const emailSubject = encodeURIComponent(`B2B Inquiry: ${item.title}`);
  const emailBody = encodeURIComponent(`Hello MMR Amusements Sales Team,\n\nI am interested in acquiring/inquiring about your commercial equipment:\n\n- Product: ${item.title}\n- Category: ${item.category}\n- Condition: ${item.condition || 'Inspected'}\n- Catalog Price: ₹${item.price}\n\nPlease contact me regarding secure freight dispatch, harness wiring, and available route settings.\n\nThank you.`);
  
  const whatsappText = encodeURIComponent(`Hello MMR Amusements, I'm interested in the "${item.title}" (${item.category}, ₹${item.price}). Please connect me with a commercial routing specialist.`);

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
            }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(3, 3, 3, 0.85)',
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
                flexDirection: 'column'
              }}
            >
              {/* Header Visual */}
              <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.75)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--card) 0%, rgba(3,3,3,0.3) 100%)' }} />
                
                {/* Close button */}
                <button
                  onClick={() => {
                    onClose();
                    playClickSound();
                  }}
                  onMouseEnter={() => playHoverSound()}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(3,3,3,0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <X size={18} />
                </button>

                {/* Title and Category */}
                <div style={{ position: 'absolute', bottom: '16px', left: '24px' }}>
                  <span className="font-heading" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: item.accentColor || 'var(--accent)', fontWeight: 700 }}>
                    {item.category} • {item.condition || 'Commercial'}
                  </span>
                  <h2 className="font-display" style={{ fontSize: '2rem', color: '#fff', margin: '4px 0 0', lineHeight: 1.1 }}>
                    {item.title}
                  </h2>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Product Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="modal-specs-grid">
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <p className="font-heading" style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.05em' }}>B2B Freight</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#fff' }}>
                      <Truck size={12} style={{ color: 'var(--accent)' }} />
                      <span className="font-heading" style={{ fontSize: '11px', fontWeight: 600 }}>Secure Dispatch</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <p className="font-heading" style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.05em' }}>Warranty</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#fff' }}>
                      <Award size={12} style={{ color: 'var(--accent)' }} />
                      <span className="font-heading" style={{ fontSize: '11px', fontWeight: 600 }}>{item.warranty || '6 Months'}</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <p className="font-heading" style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.05em' }}>DIP Settings</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#fff' }}>
                      <Zap size={12} style={{ color: 'var(--accent)' }} />
                      <span className="font-heading" style={{ fontSize: '11px', fontWeight: 600 }}>Pre-Configured</span>
                    </div>
                  </div>
                </div>

                {/* Description & Value */}
                <div>
                  <p className="font-body" style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                    {item.description || 'Premium commercial route terminal and hardware modules. Fully burn-in tested, pre-loaded with latest system software, and wired according to custom standards.'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '12px 18px', borderRadius: '8px' }}>
                    <span className="font-body" style={{ fontSize: '12px', color: 'var(--muted)' }}>Catalog Reference Valuation:</span>
                    <span className="font-display" style={{ fontSize: '1.8rem', color: item.accentColor || 'var(--accent)', fontWeight: 'bold' }}>₹{item.price}</span>
                  </div>
                </div>

                <div className="rule" />

                {/* Direct B2B Inquiry Channels */}
                <div>
                  <h4 className="font-heading" style={{ fontSize: '12px', textTransform: 'uppercase', color: '#fff', letterSpacing: '0.05em', marginBottom: '14px', textAlign: 'center' }}>
                    SELECT SECURE B2B COMMUNICATIONS CHANNEL
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Call Channel */}
                    <a
                      href="tel:+18005556677"
                      onClick={() => playClickSound()}
                      onMouseEnter={() => playHoverSound()}
                      style={{
                        cursor: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 20px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                      className="channel-row"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                          <Phone size={16} />
                        </div>
                        <div>
                          <p className="font-heading" style={{ fontSize: '13px', color: '#fff', margin: 0, fontWeight: 600 }}>Call Commercial Hotline</p>
                          <p className="font-body" style={{ fontSize: '11px', color: 'var(--muted)', margin: 0 }}>Instant routing coordination (8 AM - 6 PM EST)</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="font-mono" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 'bold' }}>1-800-555-6677</span>
                        <ExternalLink size={12} style={{ color: 'var(--muted)' }} />
                      </div>
                    </a>

                    {/* WhatsApp Channel */}
                    <a
                      href={`https://wa.me/18005556677?text=${whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playClickSound()}
                      onMouseEnter={() => playHoverSound()}
                      style={{
                        cursor: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 20px',
                        background: 'rgba(34, 197, 94, 0.05)',
                        border: '1px solid rgba(34, 197, 94, 0.15)',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                      className="channel-row"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#22c55e' }}>
                          <MessageCircle size={16} />
                        </div>
                        <div>
                          <p className="font-heading" style={{ fontSize: '13px', color: '#fff', margin: 0, fontWeight: 600 }}>Message via WhatsApp</p>
                          <p className="font-body" style={{ fontSize: '11px', color: 'var(--muted)', margin: 0 }}>Connect with a route specialist in under 5 minutes</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="font-heading" style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: '4px' }}>LIVE CHAT</span>
                        <ExternalLink size={12} style={{ color: '#22c55e' }} />
                      </div>
                    </a>

                    {/* Email Channel */}
                    <a
                      href={`mailto:orders@mmramusements.com?subject=${emailSubject}&body=${emailBody}`}
                      onClick={() => playClickSound()}
                      onMouseEnter={() => playHoverSound()}
                      style={{
                        cursor: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 20px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                      className="channel-row"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                          <Mail size={16} />
                        </div>
                        <div>
                          <p className="font-heading" style={{ fontSize: '13px', color: '#fff', margin: 0, fontWeight: 600 }}>Submit Purchase Request</p>
                          <p className="font-body" style={{ fontSize: '11px', color: 'var(--muted)', margin: 0 }}>Receive hardware wiring documents and pro-forma invoice</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="font-mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>orders@mmramusements.com</span>
                        <ExternalLink size={12} style={{ color: 'var(--muted)' }} />
                      </div>
                    </a>
                  </div>
                </div>

                {/* Escrow note */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--muted)', fontSize: '11px' }}>
                  <ShieldCheck size={13} style={{ color: '#22c55e' }} />
                  <span className="font-body">All direct transactions are secured via corporate escrow routing channels.</span>
                </div>
              </div>
            </motion.div>
          </div>

          <style>{`
            .channel-row:hover {
              background: rgba(255,255,255,0.06) !important;
              border-color: var(--accent) !important;
            }
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
