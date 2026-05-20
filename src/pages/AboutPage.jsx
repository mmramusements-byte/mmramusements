import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Target, Eye, Heart, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* Parallax Hero */}
      <section ref={containerRef} style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div style={{ position: 'absolute', inset: 0, y, opacity }}>
          <img src="/arcade.png" alt="About MMR Amusements" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--black) 0%, rgba(8,8,8,0.4) 100%)' }} />
        </motion.div>
        
        <div className="mmr-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display" 
            style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', lineHeight: 1, color: '#fff', marginBottom: '16px' }}
          >
            MMR<br />
            <span style={{ color: 'var(--accent)' }}>AMUSEMENTS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body"
            style={{ color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', fontSize: '15px', lineHeight: 1.6 }}
          >
            The nation's premium distributor of physical skill-gaming machines, custom cabinets, 8-liner motherboards, and electronic validators since 1993.
          </motion.p>
        </div>
      </section>

      {/* Core Values */}
      <section className="mmr-section mmr-section-pad" style={{ background: 'var(--surface)', position: 'relative', zIndex: 20 }}>
        <div className="mmr-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            width: '100%'
          }}>
            {[
              { icon: <Target size={24} />, title: 'Mission', desc: 'To provide commercial amusement route operators, taverns, and arcades with high-yield cabinets and genuine OEM parts.' },
              { icon: <Eye size={24} />, title: 'Vision', desc: 'To remain the most trusted, legal nationwide standard for premium cabinet builds and electronic component logistics.' },
              { icon: <Heart size={24} />, title: 'Values', desc: 'Technical excellence, absolute hardware authenticity, and dedicated route support. Every machine undergoes 48-hour QC testing.' }
            ].map((v, i) => (
              <motion.div 
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ padding: '32px', background: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}
              >
                <div style={{ color: 'var(--accent)', marginBottom: '20px' }}>{v.icon}</div>
                <h3 className="font-heading" style={{ fontSize: '20px', color: '#fff', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>{v.title}</h3>
                <p className="font-body" style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mmr-section mmr-section-pad" style={{ background: 'var(--black)' }}>
        <div className="mmr-container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', lineHeight: 1, marginBottom: '24px' }}>
              OUR AMUSEMENT<br />
              <span style={{ color: 'var(--accent)' }}>TIMELINE</span>
            </h2>
            <p className="font-body" style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, marginBottom: '40px' }}>
              Over three decades of hardware engineering, stable payout software integrations, and route operator logistics.
            </p>
          </div>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'var(--border)', transform: 'translateX(-50%)' }} />
            
            {[
              { year: '1993', title: 'Midwest Coin-Op Beginnings', desc: 'Founded as a localized coin-operated gaming machine routing partner and repair facility in Wisconsin.' },
              { year: '2012', title: '8-Liner PCB Innovations', desc: 'Introduced custom countertop cabinet lines pre-wired with custom 36-pin wiring systems, supporting Cherry Master builds.' },
              { year: '2026', title: 'MMR V2 Portal', desc: 'Launched our modern B2B ordering portal providing national logistics, certified freight dispatches, and validator updates.' }
            ].map((item, i) => (
              <motion.div 
                key={item.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                  display: 'flex', 
                  flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '80px',
                  width: '100%'
                }}
              >
                <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left', padding: '0 40px' }}>
                  <h3 className="font-display" style={{ fontSize: '3rem', color: 'var(--accent)', lineHeight: 1 }}>{item.year}</h3>
                  <h4 className="font-heading" style={{ fontSize: '18px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{item.title}</h4>
                  <p className="font-body" style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
                
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent)', position: 'relative', zIndex: 2, boxShadow: '0 0 20px rgba(239,68,68,0.5)' }} />
                
                <div style={{ flex: 1 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Mosaic */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', height: '400px', width: '100%' }}>
        {[
          '/arcade.png',
          '/vr.png',
          '/gokart.png',
          '/hero.png'
        ].map((img, i) => (
          <div key={i} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              src={img} 
              alt="MMR Cabinets & Assembly Floor" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'none' }} 
            />
          </div>
        ))}
      </section>

    </div>
  );
}
