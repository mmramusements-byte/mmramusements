import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { playClickSound } from '../utils/audio';

const filters = ['All', 'Cabinets Testimonials', 'Boards & PCBs', 'Technical Parts'];

const testimonials = [
  { rating: 5, comment: "Added two vertical skill terminals and a 6-player fish table to our tavern bar counter. Our monthly net yield has spiked significantly! The LTL freight packaging was extremely robust.", avatarColor: '#ef4444', avatar: 'JC', name: 'James C.', handle: 'Tavern Route Operator' },
  { rating: 5, comment: "Genuine Pot-O-Gold 510 board arrived pre-flashed and ready to play. Dip switches were preset perfectly. MMR support guided us through our older cabinet wiring in minutes.", avatarColor: '#3b82f6', avatar: 'RM', name: 'Richard M.', handle: 'Commercial Vending Co.' },
  { rating: 5, comment: "Bought a set of custom laminate Cherry Master countertop cabinets. The wood-grain finish is beautiful, wood cuts are highly premium, and coin acceptors work flawlessly.", avatarColor: '#22c55e', avatar: 'SH', name: 'Sarah H.', handle: 'Arcade & Bowling Manager' },
  { rating: 5, comment: "Ordered 5 ICT A6 bill validators for our laundromat coin-up setups. They were pre-programmed to accept new rupee notes and dispatched the exact same afternoon. Exceptional service.", avatarColor: '#e040fb', avatar: 'VJ', name: 'Vijay J.', handle: 'Multi-Store Proprietor' },
  { rating: 5, comment: "The 36-pin wiring harnesses and heavy-duty coin doors are authentic OEM quality. Highly recommend MMR Amusements to any route operator looking for reliable component suppliers.", avatarColor: '#eab308', avatar: 'NK', name: 'Naman K.', handle: 'Amusement Route Lead' },
  { rating: 5, comment: "Professional technical support. They provided clear wiring schematics for their dual-screen cabinets, and helped resolve note validator stacking alerts quickly. Unmatched B2B service.", avatarColor: '#ef4444', avatar: 'PK', name: 'Priya K.', handle: 'Coin-Op Technician' }
];

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const allReviews = [...testimonials, ...testimonials].map((r, i) => ({ ...r, id: i }));

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px' }}>
      
      {/* Header */}
      <section className="mmr-section" style={{ padding: '40px 0 60px', borderBottom: '1px solid var(--border)' }}>
        <div className="mmr-container" style={{ textAlign: 'center' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display" 
            style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1, color: '#fff', marginBottom: '40px' }}
          >
            OPERATOR<br />
            <span style={{ color: 'var(--accent)' }}>TESTIMONIALS</span>
          </motion.h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', marginBottom: '56px' }}>
            {[
              { value: '2.5K+', label: 'Active Routes' },
              { value: '4.9', label: 'B2B Trustpilot Rating', star: true },
              { value: '15K+', label: 'Machines Dispatched' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span className="font-display" style={{ fontSize: '3rem', color: 'var(--accent)', lineHeight: 1 }}>{stat.value}</span>
                  {stat.star && <Star size={24} style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />}
                </div>
                <span className="font-heading" style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  playClickSound();
                }}
                style={{
                  cursor: 'none', padding: '8px 20px', borderRadius: '99px',
                  fontFamily: 'Oswald, sans-serif', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase',
                  border: `1px solid ${activeFilter === f ? 'var(--accent)' : 'var(--border)'}`,
                  background: activeFilter === f ? 'var(--accent)' : 'transparent',
                  color: activeFilter === f ? '#000' : 'var(--muted)',
                  transition: 'all 0.3s'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="mmr-section mmr-section-pad" style={{ background: 'var(--surface)' }}>
        <div className="mmr-container">
          <div style={{ 
            columnCount: 3, 
            columnGap: '24px',
            width: '100%',
          }} className="reviews-masonry">
            {allReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (i % 5) * 0.1 }}
                style={{
                  breakInside: 'avoid',
                  marginBottom: '24px',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={14} style={{ fill: star <= review.rating ? 'var(--accent)' : 'transparent', color: star <= review.rating ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }} />
                  ))}
                </div>
                
                <p className="font-body" style={{ fontSize: i % 3 === 0 ? '16px' : '14px', color: '#fff', lineHeight: 1.7, fontStyle: 'italic' }}>
                  \"{review.comment}\"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: review.avatarColor,
                    fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: '14px', color: '#fff',
                  }}>
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-heading" style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '0.05em' }}>{review.name}</p>
                    <p className="font-body" style={{ fontSize: '11px', color: 'var(--muted)' }}>{review.handle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="mmr-section" style={{ background: 'var(--accent)', padding: '40px 0' }}>
        <div className="mmr-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: '3rem', color: '#000', lineHeight: 1 }}>OPERATE COIN-OP GAMES?</h2>
            <p className="font-body" style={{ color: 'rgba(0,0,0,0.7)', fontSize: '15px' }}>Share your equipment pictures on WhatsApp or support tickets for exclusive discounts on your next motherboard order!</p>
          </div>
          <button 
            onClick={() => playClickSound()}
            style={{ cursor: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', background: '#000', color: '#fff', borderRadius: '8px', fontFamily: 'Oswald, sans-serif', fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, border: 'none' }}
          >
            <MessageSquare size={16} /> Submit Equipment Review
          </button>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) { .reviews-masonry { column-count: 2 !important; } }
        @media (max-width: 640px) { .reviews-masonry { column-count: 1 !important; } }
      `}</style>
    </div>
  );
}
