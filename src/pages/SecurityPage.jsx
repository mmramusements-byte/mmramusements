import { motion } from 'framer-motion';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function SecurityPage() {
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
              EQUIPMENT &<br />
              <span style={{ color: 'var(--accent)' }}>SECURITY</span>
            </h1>
            <p className="font-body" style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              Genuine anti-tamper hardware, optical validator anti-fraud, and certified B2B escrow protection.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gap: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              style={{ background: 'var(--surface)', borderRadius: '16px', padding: '32px', border: '1px solid var(--border)', display: 'flex', gap: '24px' }}
            >
              <div style={{ color: 'var(--accent)' }}><Lock size={24} /></div>
              <div>
                <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>B2B Transaction & Escrow Protection</h3>
                <p className="font-body" style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)' }}>
                  All high-value cabinet orders, multi-terminal sets, and custom route builds are handled via secure commercial escrow terms. Your deposit is held safely while production, board installation, and freight crating are fully logged and verified.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              style={{ background: 'var(--surface)', borderRadius: '16px', padding: '32px', border: '1px solid var(--border)', display: 'flex', gap: '24px' }}
            >
              <div style={{ color: 'var(--accent)' }}><CheckCircle2 size={24} /></div>
              <div>
                <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>Genuine ROMs & Anti-Tamper Security</h3>
                <p className="font-body" style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)' }}>
                  Every game motherboard (including Pot-O-Gold, Cherry Master, and skill-board variants) undergoes rigorous diagnostic screening. We check all software signatures, guarantee original microchips, and ensure compliance with strict physical state operator requirements.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
              style={{ background: 'var(--surface)', borderRadius: '16px', padding: '32px', border: '1px solid var(--border)', display: 'flex', gap: '24px' }}
            >
              <div style={{ color: 'var(--accent)' }}><ShieldCheck size={24} /></div>
              <div>
                <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>Anti-Fraud Bill Acceptor Technologies</h3>
                <p className="font-body" style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)' }}>
                  All integrated ICT A6, Pyramid Apex, and custom bill validators feature physical anti-stringing mechanisms, advanced multi-wavelength optical sensors, and secure lockable cash canisters to protect route operations from bad currency.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  );
}
