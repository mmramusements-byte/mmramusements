import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { playClickSound } from '../utils/audio';

const faqs = [
  {
    category: "Freight & Logistics",
    questions: [
      { q: "How fast do you dispatch complete cabinets?", a: "Complete cabinets are built-to-order and undergo a rigorous 48-hour diagnostic burn-in testing cycle. They are safely strapped to heavy-duty pallets, wrapped, and dispatched via certified LTL freight shipping within 3 to 5 business days of check clearing." },
      { q: "Do you coordinate residential lift-gate deliveries?", a: "Yes. LTL freight carriers can coordinate residential address deliveries and premium lift-gate setups (unloading the pallet from the truck bed to ground level). Please notify your sales agent prior to freight dispatch." },
      { q: "Are amusement cabinets shipped fully assembled?", a: "Custom vertical terminals, Cherry Master countertops, and tabletop units are shipped 100% fully assembled and plug-and-play. Large multi-player fish tables may require minor leg bolt attachments and bezel mounting." }
    ]
  },
  {
    category: "Hardware & PCB Motherboards",
    questions: [
      { q: "What is the standard Cherry Master cabinet pinout?", a: "All countertop cabinets come pre-wired with standard 36-pin wiring harnesses. They support Cherry Master, Pot-O-Gold, or standard 8-liner board edge connectors. Simply secure the board onto the plastic standoffs and connect the 36-pin edge card connector." },
      { q: "How do I configure or adjust payout ratios on game boards?", a: "Payout ratios, maximum bets, and credit limits are adjusted using physical DIP switches on the PCB or via software configuration screens. Check the dip-switch reference card shipped with your board, or open a technical ticket." },
      { q: "Do you supply pre-configured harnesses and wire kits?", a: "Yes. We sell authentic 36-pin harnesses, standard wiring kits, custom push-buttons, coin doors, and power supplies under the Parts & Accessories catalog." }
    ]
  },
  {
    category: "Validators & Warranties",
    questions: [
      { q: "What currency notes do MMR AMUSEMENTS bill acceptors support?", a: "All pre-installed validators (Pyramid Apex 5400 and ICT A6) are pre-configured to accept all standard US dollar bills ($1, $5, $10, $20, $50, and $100). Bezel LED lighting prompts users on correct insertion directions." },
      { q: "What is your hardware component warranty protocol?", a: "All brand new complete cabinets carry a 2-Year MMR Amusements warranty. Motherboards and bill acceptors have a 1-Year warranty, while refurbished boards and clearance parts carry a standard 90-day certified replacement guarantee." }
    ]
  }
];

function Accordion({ q, a }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
      <button 
        onClick={() => {
          setOpen(!open);
          playClickSound();
        }}
        style={{ cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', color: '#fff', textAlign: 'left' }}
      >
        <span className="font-body" style={{ fontSize: '16px', fontWeight: 500 }}>{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: 'var(--accent)', flexShrink: 0 }}
        >
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
            style={{ overflow: 'hidden' }}
          >
            <p className="font-body" style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, marginTop: '16px', paddingRight: '24px' }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px' }}>
      <section className="mmr-section" style={{ padding: '60px 0' }}>
        <div className="mmr-container" style={{ maxWidth: '800px' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--surface)', borderRadius: '50%', color: 'var(--accent)', marginBottom: '24px' }}>
              <HelpCircle size={32} />
            </div>
            <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1, color: '#fff', marginBottom: '16px' }}>
              OPERATOR<br />
              <span style={{ color: 'var(--accent)' }}>RESOURCES</span>
            </h1>
            <p className="font-body" style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              Frequently asked questions regarding freight cabinet dispatches, motherboard DIP switches, and warranties.
            </p>
          </motion.div>

          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '40px', border: '1px solid var(--border)' }}>
            {faqs.map((cat, i) => (
              <motion.div 
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ marginBottom: i !== faqs.length - 1 ? '48px' : 0 }}
              >
                <h3 className="font-heading" style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', marginBottom: '8px' }}>
                  {cat.category}
                </h3>
                <div>
                  {cat.questions.map((item, j) => (
                    <Accordion key={j} q={item.q} a={item.a} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
