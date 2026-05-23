import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, PhoneCall, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { playClickSound, playHoverSound } from '../../utils/audio';
import { useSettingsStore } from '../../store/useSettingsStore';

// ── Mega-menu data ──────────────────────────────────────────────────────────
const megaMenuData = {
  columns: [
    {
      heading: 'Game Boards',
      links: [
        { label: 'All Game Boards', to: '/categories/game-boards' },
        { label: 'Amigo Boards', to: '/categories/game-boards/amigo-game-boards' },
        { label: 'Amcoe Boards', to: '/categories/game-boards/amcoe-game-boards' },
        { label: 'Astro Boards', to: '/categories/game-boards/astro-game-boards' },
        { label: 'Banilla Boards', to: '/categories/game-boards/banilla-game-boards' },
        { label: 'Big Daddy Boards', to: '/categories/game-boards/big-daddy-game-boards' },
        { label: 'Black Clover', to: '/categories/game-boards/black-clover-game-boards' },
        { label: 'Borden Boards', to: '/categories/game-boards/borden-game-boards' },
        { label: 'Dyna Boards', to: '/categories/game-boards/dyna-game-boards' },
        { label: 'IGS Boards', to: '/categories/game-boards/igs-game-boards' },
        { label: 'Jenka Lab', to: '/categories/game-boards/jenka-lab-game-boards' },
        { label: 'Master Panda', to: '/categories/game-boards/master-panda-game-boards' },
        { label: 'Ocean King', to: '/categories/game-boards/ocean-king-game-boards' },
        { label: 'Primero Boards', to: '/categories/game-boards/primero-game-boards' },
        { label: 'Subsino Boards', to: '/categories/game-boards/subsino-game-boards' },
        { label: 'Trestle Boards', to: '/categories/game-boards/trestle-game-boards' },
        { label: 'Zydexo Boards', to: '/categories/game-boards/zydexo-game-boards' },
      ],
    },
    {
      heading: 'Gaming Systems',
      links: [
        { label: 'All Gaming Systems', to: '/categories/game-systems' },
        { label: 'Arcade Games', to: '/categories/game-systems/arcade-games' },
        { label: 'Fish Games', to: '/categories/game-systems/fish-games' },
        { label: 'Coin Pushers', to: '/categories/game-systems/coin-quarter-pushers' },
        { label: 'Skill Games', to: '/categories/game-systems/nudge-skill-games' },
        { label: 'Preview / No Chance', to: '/categories/game-systems/preview-no-chance-games' },
        { label: 'Multi-Game Systems', to: '/categories/game-systems/multi-game-systems' },
        { label: 'Progressive Linking', to: '/categories/game-systems/progressive-linking-systems' },
        { label: 'Redemption Kiosks', to: '/categories/game-systems/redemption-kiosk' },
      ],
    },
    {
      heading: 'Cabinets & Hardware',
      links: [
        { label: 'All Cabinets', to: '/categories/cabinets-hardware' },
        { label: 'Board Ready Cabinets', to: '/categories/cabinets-hardware/board-ready-cabinets' },
        { label: 'Mobile Game Kiosks', to: '/categories/cabinets-hardware/mobile-game-kiosk' },
        { label: 'Upright Cabinets', to: '/categories/cabinets-hardware/upright-cabinets' },
        { label: 'Countertop Terminals', to: '/categories/cabinets-hardware/countertop-cabinets' },
        { label: 'Touchscreen Cabinets', to: '/categories/cabinets-hardware/touchscreen-cabinets' },
        { label: 'Gaming Stools', to: '/categories/cabinets-hardware/gaming-stools' },
      ],
    },
    {
      heading: 'Parts & Supplies',
      links: [
        { label: 'All Parts & Supplies', to: '/categories/parts-supplies' },
        { label: 'Bill Acceptors', to: '/categories/parts-supplies/bill-acceptors-accessories' },
        { label: 'LCD Monitors', to: '/categories/parts-supplies/lcd-monitors' },
        { label: 'Power Supplies', to: '/categories/parts-supplies/power-supplies' },
        { label: 'Harnesses & Cables', to: '/categories/parts-supplies/harnesses' },
        { label: 'Pushbuttons', to: '/categories/parts-supplies/pushbuttons' },
        { label: 'Card Readers', to: '/categories/parts-supplies/card-reader-solutions' },
        { label: 'Cabinet Parts', to: '/categories/parts-supplies/cabinet-parts-supplies' },
      ],
    },
  ],
  quickLinks: [
    { label: 'Weekly Deals', to: '/deals', accent: true },
    { label: 'Full Catalog', to: '/gaming-carts' },
    { label: 'Popular Products', to: '/popular' },
  ],
};

const topLinks = [
  { label: 'Request Quote', to: '/custom-quote' },
  { label: 'Best Sellers', to: '/popular' },
  { label: 'Deals & Clearance', to: '/deals' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const location = useLocation();
  const settings = useSettingsStore((state) => state.settings);
  const shopRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShopOpen(false);
  }, [location.pathname]);

  const openShop = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setShopOpen(true);
  };
  const closeShop = () => {
    closeTimer.current = setTimeout(() => setShopOpen(false), 120);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? 'rgba(3,3,3,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Top utility bar removed as requested */}

        <div className="mmr-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px clamp(1.25rem, 4vw, 5rem)' }}>

          {/* LOGO */}
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'none', textDecoration: 'none', flexShrink: 0 }}
            onMouseEnter={() => playHoverSound()}
            onClick={() => playClickSound()}
          >
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt="MMR Amusements"
                style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
              />
            ) : (
              <img
                src="/Logo_NoBackground.png"
                alt="MMR Amusements"
                style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
              />
            )}
          </Link>

          {/* DESKTOP NAV */}
          <nav className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '6px' }}>

            {/* SHOP mega trigger */}
            <div ref={shopRef} style={{ position: 'relative' }} onMouseEnter={openShop} onMouseLeave={closeShop}>
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className="nav-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  background: 'transparent', border: 'none', color: shopOpen ? 'var(--accent)' : 'rgba(255,255,255,0.82)',
                  fontSize: '13px', fontFamily: "'Oswald',sans-serif", fontWeight: 500,
                  letterSpacing: '0.09em', textTransform: 'uppercase', cursor: 'none',
                  padding: '10px 14px', borderRadius: '6px', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { playHoverSound(); e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = shopOpen ? 'var(--accent)' : 'rgba(255,255,255,0.82)'; e.currentTarget.style.background = 'transparent'; }}
              >
                Shop
                <motion.span animate={{ rotate: shopOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} />
                </motion.span>
              </button>

              {/* MEGA MENU PANEL */}
              <AnimatePresence>
                {shopOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={openShop}
                    onMouseLeave={closeShop}
                    style={{
                      position: 'fixed',
                      top: '80px',
                      left: 0,
                      right: 0,
                      background: 'rgba(10,10,12,0.97)',
                      backdropFilter: 'blur(24px)',
                      borderTop: '1px solid rgba(255,255,255,0.07)',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      zIndex: 200,
                      padding: '40px clamp(1.25rem, 4vw, 5rem) 36px',
                    }}
                  >
                    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.4fr 1.2fr 1.4fr', gap: '48px', marginBottom: '32px' }}>
                        {megaMenuData.columns.map((col) => (
                          <div key={col.heading}>
                            <div style={{ fontSize: '10px', fontFamily: "'Oswald',sans-serif", fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '16px', borderBottom: '1px solid rgba(239,68,68,0.2)', paddingBottom: '8px' }}>
                              {col.heading}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              {col.links.map((link) => (
                                <Link
                                  key={link.label}
                                  to={link.to}
                                  onClick={() => { playClickSound(); setShopOpen(false); }}
                                  style={{ fontSize: '13px', color: 'rgba(240,240,255,0.6)', textDecoration: 'none', padding: '5px 0', transition: 'color 0.15s', fontFamily: "'Inter',sans-serif", cursor: 'none' }}
                                  onMouseEnter={(e) => { playHoverSound(); e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '6px'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,240,255,0.6)'; e.currentTarget.style.paddingLeft = '0'; }}
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick access bar */}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Oswald',sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase' }}>Quick Access:</span>
                        {megaMenuData.quickLinks.map((ql) => (
                          <Link
                            key={ql.label}
                            to={ql.to}
                            onClick={() => { playClickSound(); setShopOpen(false); }}
                            style={{
                              fontSize: '12px', fontFamily: "'Oswald',sans-serif", fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                              color: ql.accent ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
                              textDecoration: 'none', padding: '6px 14px', borderRadius: '4px',
                              border: `1px solid ${ql.accent ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
                              cursor: 'none', transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => { playHoverSound(); e.currentTarget.style.background = ql.accent ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            {ql.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Regular top links */}
            {topLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="font-heading"
                  onMouseEnter={(e) => { playHoverSound(); e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isActive ? 'var(--accent)' : 'rgba(255,255,255,0.82)'; e.currentTarget.style.background = 'transparent'; }}
                  onClick={() => playClickSound()}
                  style={{
                    fontSize: '13px', letterSpacing: '0.09em', textTransform: 'uppercase',
                    color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.82)',
                    fontWeight: isActive ? 600 : 500, transition: 'all 0.2s',
                    cursor: 'none', textDecoration: 'none', padding: '10px 14px', borderRadius: '6px',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="tel:+12103888416"
              className="desktop-only"
              style={{
                background: 'var(--accent)', border: 'none', color: '#000',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 22px', borderRadius: '6px', fontWeight: 700,
                fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.07em',
                textDecoration: 'none', fontFamily: "'Oswald',sans-serif", transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { playHoverSound(); e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#000'; }}
              onClick={() => playClickSound()}
            >
              <PhoneCall size={14} /> +1 (210) 388-8416
            </a>

            <button
              className="mobile-only"
              onClick={() => { setMobileMenuOpen(!mobileMenuOpen); playClickSound(); }}
              onMouseEnter={() => playHoverSound()}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'none', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '6px' }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{
              position: 'fixed', top: '80px', left: 0, right: 0,
              background: 'rgba(10,10,12,0.98)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.07)', zIndex: 99,
              padding: '24px clamp(1.25rem, 4vw, 5rem)', maxHeight: '80vh', overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link to="/gaming-carts" onClick={() => playClickSound()} className="font-heading" style={{ fontSize: '16px', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.08em' }}>Shop All Equipment</Link>
              <Link to="/custom-quote" onClick={() => playClickSound()} className="font-heading" style={{ fontSize: '16px', textTransform: 'uppercase', color: 'var(--accent)', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.08em' }}>Request Quote</Link>
              <Link to="/popular" onClick={() => playClickSound()} className="font-heading" style={{ fontSize: '16px', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.08em' }}>Best Sellers</Link>
              <Link to="/deals" onClick={() => playClickSound()} className="font-heading" style={{ fontSize: '16px', textTransform: 'uppercase', color: 'var(--accent)', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.08em' }}>Deals & Clearance</Link>
              <Link to="/about" onClick={() => playClickSound()} className="font-heading" style={{ fontSize: '16px', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.08em' }}>About Us</Link>
              <Link to="/contact" onClick={() => playClickSound()} className="font-heading" style={{ fontSize: '16px', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.08em' }}>Contact / Queries</Link>
              <Link to="/careers" onClick={() => playClickSound()} className="font-heading" style={{ fontSize: '16px', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.08em' }}>Careers</Link>
              <Link to="/support" onClick={() => playClickSound()} style={{ marginTop: '16px', background: 'var(--accent)', color: '#fff', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', textAlign: 'center', textDecoration: 'none', fontFamily: "'Oswald',sans-serif" }}>
                Get a Quote / B2B Support
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .mobile-only { display: none !important; }
          .utility-bar { display: block !important; }
        }
        @media (max-width: 1023px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </>
  );
}
