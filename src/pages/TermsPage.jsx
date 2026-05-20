import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsPage() {
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
              <FileText size={32} />
            </div>
            <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1, color: '#fff', marginBottom: '16px' }}>
              TERMS &<br />
              <span style={{ color: 'var(--accent)' }}>CONDITIONS</span>
            </h1>
            <p className="font-body" style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              Last updated: May 2026
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ background: 'var(--surface)', borderRadius: '16px', padding: '40px', border: '1px solid var(--border)' }}
          >
            <div className="prose" style={{ color: 'var(--muted)' }}>
              <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>1. B2B Commercial Agreement & Entity Status</h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
                By ordering equipment from MMR Amusements, you certify that you are operating as a business entity, route operator, or licensed commercial venue coordinator. All purchases represent commercial B2B sales of physical amusement equipment and diagnostics components.
              </p>

              <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>2. Freight Liability & Risk of Loss</h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
                All complete game cabinets and terminal shipments are sent FOB Origin. Risk of physical loss or damage shifts to the route operator once the carrier signs for the cargo at our distribution docks. It is the buyer's strict obligation to inspect LTL pallets before signing the delivery receipt.
              </p>

              <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>3. Vending Compliance & State Laws</h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
                The operator assumes full operational responsibility for complying with municipal, county, and state regulations governing amusement coin-op machines, sweepstakes terminals, and non-gaming skill laws. MMR Amusements supplies hardware exclusively and does not offer licensing or legal operational guarantees.
              </p>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
