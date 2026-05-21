import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Tag, Clock, HelpCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deals } from '../data/products';
import { playHoverSound, playClickSound, playSuccessSound } from '../utils/audio';
import InquiryModal from '../components/common/InquiryModal';

export default function DealsPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 19 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const handleInquire = (item) => {
    setSelectedItem(item);
    setIsInquiryOpen(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n) => String(n).padStart(2, '0');

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="mmr-container">

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="section-label" style={{ marginBottom: '12px' }}>Inventory Clearouts</span>
          <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 6vw, 4.8rem)', color: '#fff', lineHeight: 1 }}>
            LIMITED <span style={{ color: 'var(--accent)' }}>DEALS</span>
          </h1>
          
          {/* Countdown Clock */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            <Clock size={16} style={{ color: 'var(--accent)' }} />
            <span className="font-heading" style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Next Stock Rotation In:</span>
            <div style={{ display: 'flex', gap: '4px', fontFamily: 'monospace', fontSize: '14px', background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '4px', color: 'var(--accent)', fontWeight: 'bold' }}>
              <span>{formatNum(timeLeft.hours)}</span>:
              <span>{formatNum(timeLeft.minutes)}</span>:
              <span>{formatNum(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          width: '100%',
          alignItems: 'stretch',
        }}
          className="deals-grid"
        >
          {deals.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                background: i === 1 ? 'var(--surface)' : 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Hot label */}
              {i === 1 && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--accent)' }} />
              )}
              
              <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                <span className="badge" style={{ background: i === 1 ? 'var(--accent)' : 'var(--muted)', color: '#000', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={10} /> {pkg.discount}
                </span>
              </div>

              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span className="font-heading" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>
                  {pkg.category}
                </span>
                
                <h3 className="font-display" style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '16px', minHeight: '44px', lineHeight: 1.2 }}>
                  {pkg.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
                  <span className="font-display" style={{ fontSize: '3rem', color: i === 1 ? 'var(--accent)' : '#fff' }}>
                    ${pkg.price}
                  </span>
                  <span className="font-body" style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'line-through' }}>
                    ${pkg.originalPrice}
                  </span>
                </div>

                <div className="rule" style={{ marginBottom: '24px' }} />

                {/* Features list */}
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, marginBottom: '32px' }}>
                  {pkg.features.map((feature, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{
                        marginTop: '2px', width: '16px', height: '16px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      }}>
                        <Check size={9} style={{ color: 'var(--accent)' }} strokeWidth={3} />
                      </span>
                      <span className="font-body" style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => {
                    playSuccessSound();
                    handleInquire({
                      id: pkg.id,
                      title: pkg.title,
                      category: pkg.category,
                      price: pkg.price,
                      image: '/hero_marketplace.png', // valid default image
                      badge: pkg.discount,
                      badgeColor: 'var(--accent)',
                      accentColor: 'var(--accent)',
                      description: pkg.features.join(', '),
                      warranty: '6 Months',
                      yield: 'High Yield',
                      shipping: 'Standard Express'
                    });
                  }}
                  style={{
                    cursor: 'none', width: '100%',
                    padding: '14px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: '13px',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    background: i === 1 ? 'var(--accent)' : 'transparent',
                    color: i === 1 ? '#000' : '#fff',
                    border: i === 1 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <MessageSquare size={13} /> Inquire Bundle
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sell / Valuation Section */}
        <div style={{
          marginTop: '64px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: '1.8fr 1.2fr',
          gap: '32px',
          alignItems: 'center'
        }}
          className="deals-cta-row"
        >
          <div>
            <h3 className="font-display" style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '8px' }}>Operate A Skill Routing Setup?</h3>
            <p className="font-body" style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7 }}>
              Looking to upgrade your convenience store terminals or trade in used cabinets? We purchase countertops, fish game boards, and bill validators. Contact our route specialists for an escrow payout estimate.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Link to="/support" className="btn btn-accent" style={{ cursor: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              <HelpCircle size={16} /> Request Route Valuation <ArrowRight size={14} />
            </Link>
          </div>
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
          .deals-grid { grid-template-columns: 1fr !important; }
          .deals-cta-row { grid-template-columns: 1fr !important; text-align: left !important; }
          .deals-cta-row div:last-child { text-align: left !important; }
        }
      `}</style>
    </div>
  );
}
