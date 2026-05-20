import { motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';

export default function RefundPolicyPage() {
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
              <CalendarCheck size={32} />
            </div>
            <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1, color: '#fff', marginBottom: '16px' }}>
              WARRANTY &<br />
              <span style={{ color: 'var(--accent)' }}>RETURNS</span>
            </h1>
            <p className="font-body" style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              B2B equipment warranty standards, restocking fees, and LTL freight damage procedures.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ background: 'var(--surface)', borderRadius: '16px', padding: '40px', border: '1px solid var(--border)' }}
          >
            <div className="prose" style={{ color: 'var(--muted)' }}>
              <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>1. MMR Hardware Warranties</h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
                All brand new complete cabinets (vertical Touchscreen Terminals, countertops) carry a 2-Year MMR warranty covering internal electronics, monitors, wiring, and buttons. Motherboards (Pot-O-Gold 510, Cherry Master PCBs) carry a 1-Year replacement guarantee. Certified refurbished units and bill acceptors are covered for 90 days.
              </p>

              <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>2. LTL Freight Delivery & Shipping Damages</h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
                Complete amusement machines are strapped to pallets and fully insured prior to shipment. Operators must carefully inspect the freight upon arrival before signing the Bill of Lading (BOL). If any damage to the cabinet or glass is noted, it MUST be declared on the carrier's BOL. Document the damage with pictures and contact our sales office within 24 hours.
              </p>

              <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>3. Cancellations & Configuration Restocking Fees</h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
                Because cabinets undergo custom pre-shipment configurations (e.g. customized dip-switch presets, harness binding, and bill acceptor flashes), cancellations requested after assembly begins but before dispatch are subject to a 15% restocking fee. Once a cabinet has shipped, returns are not accepted.
              </p>

              <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>4. Component Exchange & Returns</h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
                For individual hardware components (printers, bill validators, wiring harnesses, game boards) that fail within their warranty period, please submit a diagnostic support ticket. MMR Amusements will supply a prepaid return shipping label and ship a tested replacement component upon verification.
              </p>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
