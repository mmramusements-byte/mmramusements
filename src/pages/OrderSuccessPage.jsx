import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { playSuccessSound, playHoverSound, playClickSound } from '../utils/audio';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, email } = location.state || {};

  useEffect(() => {
    if (!orderNumber) {
      navigate('/');
    } else {
      playSuccessSound();
    }
  }, [orderNumber, navigate]);

  if (!orderNumber) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', paddingBottom: '100px', background: 'var(--black)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '48px clamp(24px, 5vw, 64px)',
          maxWidth: '680px', width: '100%', margin: '0 24px', position: 'relative', overflow: 'hidden', textAlign: 'center'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent)' }} />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
          style={{ width: '80px', height: '80px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}
        >
          <CheckCircle size={40} style={{ color: '#22c55e' }} />
        </motion.div>

        <h1 className="font-display" style={{ fontSize: '3rem', color: '#fff', marginBottom: '16px', lineHeight: 1.1 }}>ORDER RECEIVED</h1>
        <p className="font-body" style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '440px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          Thank you for choosing MMR Amusements. Your commercial order request has been successfully submitted.
        </p>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
            <span style={{ color: 'var(--muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Number</span>
            <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '18px', fontWeight: 700 }}>{orderNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirmation Email</span>
            <span className="font-body" style={{ color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {email}</span>
          </div>
        </div>

        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '24px', textAlign: 'left', marginBottom: '40px' }}>
          <h3 className="font-heading" style={{ color: '#60a5fa', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} /> What happens next?
          </h3>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
            Because commercial arcade equipment requires specialized freight shipping and specific configuration, an MMR representative will contact you shortly to finalize shipping details, discuss any customizations, and confirm delivery timelines.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            onClick={playClickSound}
            onMouseEnter={(e) => { playHoverSound(); e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#000'; }}
            style={{
              padding: '16px 32px', background: 'var(--accent)', color: '#000', borderRadius: '8px',
              textDecoration: 'none', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em',
              display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', cursor: 'pointer'
            }}
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
          <a
            href="tel:+12103888416"
            onClick={playClickSound}
            onMouseEnter={(e) => { playHoverSound(); e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            style={{
              padding: '16px 32px', background: 'transparent', color: '#fff', border: '1px solid var(--border)', borderRadius: '8px',
              textDecoration: 'none', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em',
              display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', cursor: 'pointer'
            }}
          >
            Contact Support
          </a>
        </div>
        
        <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--muted)', fontSize: '12px' }}>
          <ShieldCheck size={14} /> Official MMR Amusements Order
        </div>

      </motion.div>
    </div>
  );
}
