import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShieldAlert, PhoneCall } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { playClickSound, playHoverSound } from '../../utils/audio';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Amusement Equipment', path: '/gaming-carts' },
  { name: 'Top Earners', path: '/popular' },
  { name: 'Deals & Clearance', path: '/deals' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Technical Support', path: '/support' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? 'rgba(3, 3, 3, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
          transition: 'all 0.3s ease', padding: '16px 0'
        }}
      >
        <div className="mmr-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* LOGO */}
          <Link 
            to="/" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'none', textDecoration: 'none' }}
            onMouseEnter={() => playHoverSound()}
            onClick={() => playClickSound()}
          >
            <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={18} color="#000" strokeWidth={2.5} />
            </div>
            <span className="font-display" style={{ fontSize: '1.6rem', color: '#fff', letterSpacing: '0.05em' }}>
              MMR <span style={{ color: 'var(--accent)' }}>AMUSEMENTS</span>
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="desktop-nav" style={{ display: 'none', gap: '32px', alignItems: 'center' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="font-heading"
                  onMouseEnter={() => playHoverSound()}
                  onClick={() => playClickSound()}
                  style={{
                    fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: isActive ? 'var(--accent)' : 'var(--text)',
                    fontWeight: isActive ? 600 : 400, transition: 'color 0.2s', cursor: 'none', textDecoration: 'none'
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              to="/support"
              style={{ 
                background: 'var(--accent)', 
                border: 'none', 
                color: '#000', 
                cursor: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 20px', 
                borderRadius: '6px', 
                fontWeight: 600, 
                fontSize: '13px', 
                textTransform: 'uppercase',
                textDecoration: 'none'
              }}
              className="desktop-only"
              onMouseEnter={() => playHoverSound()}
              onClick={() => playClickSound()}
            >
              <PhoneCall size={14} /> B2B Support
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-only"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                playClickSound();
              }}
              onMouseEnter={() => playHoverSound()}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'none', display: 'flex', alignItems: 'center' }}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: '70px', left: 0, right: 0, background: 'var(--card)', borderBottom: '1px solid var(--border)', zIndex: 99, padding: '24px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="font-heading"
                  onClick={() => playClickSound()}
                  style={{ fontSize: '16px', textTransform: 'uppercase', color: '#fff', textDecoration: 'none' }}
                >
                  {link.name}
                </Link>
              ))}
              <div className="rule" />
              <Link 
                to="/support"
                onClick={() => playClickSound()}
                style={{ 
                  width: '100%', 
                  background: 'var(--accent)', 
                  color: '#000', 
                  border: 'none', 
                  padding: '14px', 
                  borderRadius: '8px', 
                  fontWeight: 600, 
                  fontSize: '14px', 
                  textTransform: 'uppercase',
                  display: 'block',
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                Connect B2B Hotline
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-only { display: none !important; }
        }
        @media (max-width: 899px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </>
  );
}
