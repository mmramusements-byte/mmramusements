import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '100px' }}>
      <section className="mmr-section" style={{ padding: '60px 0' }}>
        <div className="mmr-container" style={{ maxWidth: '800px' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--surface)', borderRadius: '50%', color: 'var(--accent)', marginBottom: '24px' }}>
              <ShieldCheck size={32} />
            </div>
            <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1, color: '#fff', marginBottom: '16px' }}>
              PRIVACY<br />
              <span style={{ color: 'var(--accent)' }}>POLICY</span>
            </h1>
            <p className="font-body" style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              How we handle route operator records, freight logistics coordinates, and business registration data.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ background: 'var(--surface)', borderRadius: '16px', padding: '40px', border: '1px solid var(--border)' }}
          >
            <div className="prose" style={{ color: 'var(--muted)' }}>
              <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>B2B Operator & Tax Registration</h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
                We collect business entity details, including corporate name, trade name, tax registration/EIN/GST, route operations credentials, and phone numbers. This is solely for the purposes of B2B client verification, compliance with state vending laws, and commercial invoice generation.
              </p>

              <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>LTL Freight & Logistics Dispatch</h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
                To ensure correct delivery of heavy equipment, complete gaming cabinets, and modular terminals, your address and forklift availability details are shared exclusively with our contracted LTL common freight carriers (e.g., FedEx Freight, R&L, Estes) for shipment routing and delivery scheduling.
              </p>

              <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>Payment & ACH Wire Security</h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
                Payment information, whether credit cards, physical bank wire transfers, or ACH credentials, are processed securely through certified gateway platforms and secure escrow services. We do not store internal bank routing numbers, physical credit card details, or banking passwords on our local servers.
              </p>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
