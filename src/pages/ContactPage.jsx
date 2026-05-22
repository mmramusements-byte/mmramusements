import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Clock, MessageSquare, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../lib/api';

const CONTACT_INFO = [
  { icon: <Phone size={20} />, title: 'Sales & Support Hotline', value: '+1 (210) 388-8416', href: 'tel:+12103888416', color: '#ef4444' },
  { icon: <Mail size={20} />, title: 'General Inquiries', value: 'info@mmramusements.com', href: 'mailto:info@mmramusements.com', color: '#3b82f6' },
  { icon: <MapPin size={20} />, title: 'Distribution Center', value: '2543 Boardwalk St, San Antonio, TX 78240', href: 'https://maps.google.com/?q=2543+Boardwalk+st,+San+Antonio,+TX+78240', color: '#22c55e' },
  { icon: <Clock size={20} />, title: 'Business Hours', value: 'Mon–Fri: 8AM–6PM CST · Sat: 9AM–2PM CST', href: null, color: '#f97316' },
];

const QUERY_TYPES = [
  'Product & Pricing Inquiry',
  'Bulk / Wholesale Order',
  'Technical Support Request',
  'Shipping & Freight Question',
  'Parts & Supplies Inquiry',
  'Partnership / Distributor Inquiry',
  'Warranty & Returns',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', company: '', subject: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.subject || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post('/queries', form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send your query. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>

      {/* ── HEADER ── */}
      <div className="mmr-container" style={{ paddingTop: 'clamp(3rem,6vw,5rem)', paddingBottom: '56px', borderBottom: '1px solid var(--border)' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ maxWidth: '700px' }}>
          <span className="section-label" style={{ marginBottom: '14px', display: 'block' }}>Get In Touch</span>
          <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 0.92, color: '#fff', marginBottom: '20px' }}>
            SEND US YOUR<br /><span style={{ color: 'var(--accent)' }}>QUERY</span>
          </h1>
          <p className="font-body" style={{ fontSize: 'clamp(14px,1.8vw,16px)', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '520px' }}>
            Whether you're a route operator, entertainment center owner, or parts buyer — our team responds within 1–2 business days.
          </p>
        </motion.div>
      </div>

      <div className="mmr-container" style={{ paddingTop: '56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '48px', alignItems: 'start' }} className="contact-layout">

          {/* LEFT — Contact Info */}
          <div>
            <h2 className="font-display" style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '24px' }}>CONTACT <span style={{ color: 'var(--accent)' }}>INFO</span></h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              {CONTACT_INFO.map((c) => (
                <motion.div key={c.title} whileHover={{ x: 4 }} style={{ display: 'flex', gap: '16px', padding: '18px 20px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', textDecoration: 'none', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${c.color}50`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, flexShrink: 0 }}>
                    {c.icon}
                  </div>
                  <div>
                    <div className="font-heading" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{c.title}</div>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        style={{ fontSize: '14px', color: '#fff', textDecoration: 'none', cursor: 'none', fontFamily: "'Inter',sans-serif", transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = c.color}
                        onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                      >{c.value}</a>
                    ) : (
                      <div style={{ fontSize: '14px', color: '#fff', fontFamily: "'Inter',sans-serif" }}>{c.value}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.03))', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MessageSquare size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div className="font-heading" style={{ fontSize: '13px', color: '#fff', fontWeight: 600, marginBottom: '6px' }}>B2B Route Operators</div>
                  <p className="font-body" style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
                    For bulk pricing, fleet orders, and dedicated account management, select "Bulk / Wholesale Order" as your query type.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Query Form */}
          <div>
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ background: 'var(--card)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px', padding: '64px 40px', textAlign: 'center' }}>
                <CheckCircle size={60} style={{ color: '#22c55e', margin: '0 auto 20px' }} />
                <h2 className="font-display" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '12px' }}>QUERY SENT!</h2>
                <p className="font-body" style={{ color: 'var(--muted)', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 24px' }}>
                  We've received your message and will respond to <strong style={{ color: '#fff' }}>{form.email}</strong> within 1–2 business days.
                </p>
                <p className="font-body" style={{ fontSize: '13px', color: 'var(--muted)' }}>
                  For urgent matters, call us at <a href="tel:+12103888416" style={{ color: 'var(--accent)', textDecoration: 'none' }}>+1 (210) 388-8416</a>
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: 'clamp(28px,5vw,44px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                  <Building2 size={20} style={{ color: 'var(--accent)' }} />
                  <h2 className="font-display" style={{ fontSize: '1.6rem', color: '#fff', margin: 0 }}>SEND A QUERY</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }} className="form-grid-2">
                  {[
                    { name: 'full_name', label: 'Full Name *', type: 'text', placeholder: 'John Smith', span: 1 },
                    { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'john@company.com', span: 1 },
                    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', span: 1 },
                    { name: 'company', label: 'Company / Business Name', type: 'text', placeholder: 'Your Business LLC', span: 1 },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="font-heading" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '7px' }}>{f.label}</label>
                      <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange}
                        style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '11px 14px', color: '#fff', fontSize: '14px', fontFamily: "'Inter',sans-serif", outline: 'none', cursor: 'none' }}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label className="font-heading" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '7px' }}>Query Type / Subject *</label>
                  <select name="subject" value={form.subject} onChange={handleChange}
                    style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '11px 14px', color: form.subject ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: '14px', fontFamily: "'Inter',sans-serif", outline: 'none', cursor: 'none' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  >
                    <option value="" style={{ background: 'var(--card)' }}>Select query type...</option>
                    {QUERY_TYPES.map(t => <option key={t} value={t} style={{ background: 'var(--card)', color: '#fff' }}>{t}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label className="font-heading" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '7px' }}>Your Message *</label>
                  <textarea name="message" rows={6} placeholder="Describe your query in detail — product names, quantities, or technical issues..." value={form.message} onChange={handleChange}
                    style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '11px 14px', color: '#fff', fontSize: '14px', fontFamily: "'Inter',sans-serif", outline: 'none', resize: 'vertical', cursor: 'none', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '18px' }}>
                    <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                    <span className="font-body" style={{ fontSize: '13px', color: '#ef4444' }}>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  style={{ width: '100%', background: submitting ? 'rgba(239,68,68,0.5)' : 'var(--accent)', border: 'none', color: '#fff', padding: '15px', borderRadius: '10px', cursor: 'none', fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#dc2626'; }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = 'var(--accent)'; }}
                >
                  <Send size={16} />
                  {submitting ? 'Sending Your Query...' : 'Send Query'}
                </button>

                <p className="font-body" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '16px', lineHeight: 1.5 }}>
                  Your query will be sent to info@mmramusements.com. We respond within 1–2 business days.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .form-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
