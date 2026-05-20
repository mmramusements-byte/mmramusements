import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Phone, MapPin, Mail, Heart } from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';

const footerNav = [
  { label: 'Home', href: '/' },
  { label: 'Amusement Equipment', href: '/gaming-carts' },
  { label: 'Top Earners', href: '/popular' },
  { label: 'Deals & Clearance', href: '/deals' },
  { label: 'Reviews', href: '/reviews' },
];

const supportNav = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Security', href: '/security' },
  { label: 'Refund Policy', href: '/refund-policy' },
];

const socials = [
  { icon: <FaInstagram size={16} />, label: 'Instagram', href: '#' },
  { icon: <FaYoutube size={16} />, label: 'YouTube', href: '#' },
  { icon: <FaXTwitter size={16} />, label: 'X / Twitter', href: '#' },
  { icon: <FaWhatsapp size={16} />, label: 'WhatsApp', href: '#' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--black)',
      borderTop: '1px solid var(--border)',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient glowing background element to make it feel cinematic */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '200px', background: 'radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="mmr-container" style={{ paddingTop: '80px', paddingBottom: '40px', position: 'relative', zIndex: 10 }}>

        {/* Top grid: 4 columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr 1fr 1fr',
          gap: '48px',
          marginBottom: '64px',
          width: '100%',
        }}
          className="footer-grid"
        >
          {/* Column 1: Brand */}
          <div>
            <h2 className="font-display" style={{ fontSize: '4rem', color: '#fff', lineHeight: 1, marginBottom: '2px' }}>MMR</h2>
            <p className="font-heading" style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '24px' }}>
              AMUSEMENT MACHINE DISTRIBUTOR
            </p>
            <p className="font-body" style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '320px', marginBottom: '32px' }}>
              The nation's premium distributor of skill-gaming machines, custom Cherry Master cabinets, 8-liner boards, bill acceptors, and genuine amusement hardware parts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <Phone size={14} />, text: '+91 98765 43210 (Sales & Support)' },
                { icon: <Mail size={14} />, text: 'sales@mmramusements.com' },
                { icon: <MapPin size={14} />, text: 'National Equipment Distribution Center' },
              ].map((c, i) => (
                <div key={i} className="font-body" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{c.icon}</span> {c.text}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-heading" style={{ fontSize: '12px', color: '#fff', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px' }}>Navigation</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none' }}>
              {footerNav.map(l => (
                <li key={l.label}>
                  <NavLink to={l.href} style={{ cursor: 'none', textDecoration: 'none', position: 'relative' }}
                    className={({ isActive }) => `font-body footer-link ${isActive ? 'active-footer-link' : ''}`}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-heading" style={{ fontSize: '12px', color: '#fff', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px' }}>Support</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none' }}>
              {supportNav.map(l => (
                <li key={l.label}>
                  <NavLink to={l.href} style={{ cursor: 'none', textDecoration: 'none', position: 'relative' }}
                    className={({ isActive }) => `font-body footer-link ${isActive ? 'active-footer-link' : ''}`}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h4 className="font-heading" style={{ fontSize: '12px', color: '#fff', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px' }}>Connect</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {socials.map(s => (
                <motion.a key={s.label} href={s.href} aria-label={s.label}
                  whileHover={{ x: 5, color: '#fff' }}
                  style={{ cursor: 'none', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                    {s.icon}
                  </div>
                  <span className="font-body" style={{ fontSize: '13px' }}>{s.label}</span>
                </motion.a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="rule" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between', width: '100%' }}>
          <p className="font-body" style={{ fontSize: '11px', color: 'var(--muted)', opacity: 0.6, lineHeight: 1.6, margin: 0 }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>DISCLAIMER:</span> All equipment, cabinets, multi-game motherboards, and acceptors sold on MMR AMUSEMENTS are marketed exclusively for entertainment, legal skill-gaming, and amusement routing purposes. Operation, licensing, and compliance are subject to state, local, and municipal vending regulations.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%', marginTop: '12px' }}>
            <p className="font-body" style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              © 2026 MMR Amusements Distributing. Built for Route Operators & Amusement Specialists. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link { font-size: 14px; color: var(--muted); transition: color 0.3s; padding-bottom: 2px; }
        .footer-link:hover { color: #fff; }
        
        .footer-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 1px; background: var(--accent); transform: scaleX(0); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); transform-origin: left; }
        .footer-link:hover::after { transform: scaleX(1); }
        .active-footer-link { color: #fff; }
        .active-footer-link::after { transform: scaleX(1); }

        @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
