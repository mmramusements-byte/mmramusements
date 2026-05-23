import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, ChevronDown, Cpu, Truck, Phone, MessageCircle, MapPin, Clock, FileText } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';

const faqs = [
  {
    question: "What is the standard Cherry Master & PCB cabinet harness wiring standard?",
    answer: "All of our custom countertop, tabletop, and vertical cabinets come pre-wired with standard 36-pin Cherry Master harnesses or standard JAMMA connectors. Game boards like Pot-O-Gold and multi-game 8-liners plug directly into the harness without complex hand-soldering."
  },
  {
    question: "How do I configure dip-switches for payout settings?",
    answer: "Each genuine PCB motherboard contains physical dip-switch blocks or software setup menus. These control parameters like payout percentages, game limits, and validator signal pulse counts. You can download the official manual for your motherboard from our documentation repository or ask an MMR technician."
  },
  {
    question: "How do you coordinate freight shipping for massive cabinets?",
    answer: "Complete cabinets (e.g., 6-player fish tables) are securely strapped to heavy-duty pallets, shrink-wrapped, and dispatched via certified commercial LTL freight shipping. We coordinate lift-gate delivery and notify your route representative 24 hours prior to delivery."
  },
  {
    question: "Do you offer firmware support for Pyramid and ICT bill acceptors?",
    answer: "Yes. All bill validators sold (Pyramid Apex 5400, ICT A6) are pre-flashed with the latest firmware. If you encounter currency acceptance issues or require programming cards for specific note values, our technicians can supply flashing tools and configuration instructions."
  }
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
    playClickSound();
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="mmr-container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="section-label" style={{ marginBottom: '12px' }}>Technical Helpdesk</span>
          <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 6vw, 4.8rem)', color: '#fff', lineHeight: 1 }}>
            SUPPORT & <span style={{ color: 'var(--accent)' }}>TRUST</span>
          </h1>
          <p className="font-body" style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '500px', margin: '12px auto 0', lineHeight: 1.6 }}>
            Connect with certified MMR technicians for cabinet diagnostic harness schematics and validator tuning guides.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '40px',
          width: '100%',
          alignItems: 'start'
        }}
          className="support-layout-grid"
        >
          {/* LEFT — FAQs & Guarantee */}
          <div>
            {/* Trust Shield banner */}
            <div style={{
              background: 'rgba(34, 197, 94, 0.05)',
              border: '1px solid rgba(34, 197, 94, 0.15)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              gap: '16px',
              marginBottom: '32px',
              alignItems: 'center'
            }}>
              <ShieldCheck size={32} style={{ color: '#22c55e', flexShrink: 0 }} />
              <div>
                <h3 className="font-heading" style={{ fontSize: '14px', color: '#fff', fontWeight: 600, marginBottom: '4px' }}>B2B Freight & Hardware Warranties</h3>
                <p className="font-body" style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  All custom amusement machines and components undergo extensive 48-hour burn-in testing prior to palette dispatch. Motherboards are backed by a certified replacement warranty, ensuring route operation continuity.
                </p>
              </div>
            </div>

            {/* Accordion FAQ list */}
            <h2 className="font-display" style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '24px' }}>OPERATOR FAQ</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      style={{
                        cursor: 'pointer',
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left'
                      }}
                    >
                      <span className="font-heading" style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{faq.question}</span>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                        <ChevronDown size={16} style={{ color: 'var(--muted)' }} />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                            <p className="font-body" style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Premium Technical Support Directory */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div>
              <h3 className="font-display" style={{ fontSize: '2rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={22} style={{ color: 'var(--accent)' }} /> TECHNICAL DIRECTORY
              </h3>
              <p className="font-body" style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px', lineHeight: 1.5 }}>
                Encountering technical board anomalies, harness wiring errors, or bill acceptor issues? Connect with our master technicians directly via premium secure channels.
              </p>
            </div>

            <div className="rule" />

            {/* Support Channels Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Telephone Hotline */}
              <a
                href="tel:+12103888416"
                onClick={() => playClickSound()}
                onMouseEnter={() => playHoverSound()}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                className="directory-row"
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-heading" style={{ fontSize: '13px', color: '#fff', margin: 0, fontWeight: 600 }}>Tavern & Route Hotline</p>
                  <p className="font-mono" style={{ fontSize: '12px', color: 'var(--accent)', margin: '2px 0 0', fontWeight: 'bold' }}>+1 (210) 388-8416</p>
                </div>
              </a>

              {/* Technical WhatsApp support */}
              <a
                href="https://wa.me/12103888416?text=Hello%20MMR%20Amusements%20Support,%20I%20have%20a%20technical%20question%20regarding%20my%20route%20equipment."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                onMouseEnter={() => playHoverSound()}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  background: 'rgba(34, 197, 94, 0.05)',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                className="directory-row"
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="font-heading" style={{ fontSize: '13px', color: '#fff', margin: 0, fontWeight: 600 }}>Live Wiring & Tuning Chat</p>
                  <p className="font-body" style={{ fontSize: '11px', color: '#22c55e', margin: '2px 0 0', fontWeight: 600 }}>Instant technical troubleshooting</p>
                </div>
              </a>

              {/* Technical Diagnostics Email */}
              <a
                href="mailto:info@mmramusements.com?subject=Technical%20Cabinet%20Diagnostics%20Request"
                onClick={() => playClickSound()}
                onMouseEnter={() => playHoverSound()}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                className="directory-row"
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-heading" style={{ fontSize: '13px', color: '#fff', margin: 0, fontWeight: 600 }}>Schematics & Manuals</p>
                  <p className="font-mono" style={{ fontSize: '12px', color: 'var(--muted)', margin: '2px 0 0' }}>info@mmramusements.com</p>
                </div>
              </a>

              {/* Manual Downloads Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <p className="font-heading" style={{ fontSize: '13px', color: '#fff', margin: 0, fontWeight: 600 }}>DIP Switch manual vault</p>
                  <p className="font-body" style={{ fontSize: '11px', color: 'var(--muted)', margin: '2px 0 0' }}>Supplied upon secure buyer verification</p>
                </div>
              </div>

            </div>

            <div className="rule" />

            {/* Warehouse Logistics & Hours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Working Hours */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Clock size={16} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p className="font-heading" style={{ fontSize: '11px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operational Hours</p>
                  <p className="font-body" style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0', lineHeight: 1.5 }}>
                    Monday - Friday: 8:00 AM - 6:00 PM EST<br />
                    Saturday: 9:00 AM - 2:00 PM EST<br />
                    <span style={{ color: '#ef4444' }}>Sunday & Holidays: Closed</span>
                  </p>
                </div>
              </div>

              {/* Distribution Hub */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p className="font-heading" style={{ fontSize: '11px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distribution Center</p>
                  <a
                    href="https://maps.google.com/?q=2543+Boardwalk+st,+San+Antonio,+TX+78240"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClickSound()}
                    onMouseEnter={() => playHoverSound()}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      marginTop: '4px',
                      transition: 'color 0.2s'
                    }}
                    className="font-body maps-link"
                  >
                    MMR Texas Distribution Hub<br />
                    2543 Boardwalk st<br />
                    San Antonio, TX 78240
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      <style>{`
        .directory-row:hover {
          background: rgba(255,255,255,0.06) !important;
          border-color: var(--accent) !important;
        }
        .maps-link {
          color: var(--muted);
          line-height: 1.5;
          font-size: 12px;
        }
        .maps-link:hover {
          color: #fff !important;
        }
        @media (max-width: 900px) {
          .support-layout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
