import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Users, Zap, TrendingUp, Heart, Shield, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../lib/api';

const benefits = [
  { icon: <Heart size={24} />, title: 'Health & Wellness', desc: 'Comprehensive medical, dental, and vision coverage for you and your family.' },
  { icon: <TrendingUp size={24} />, title: 'Growth & Advancement', desc: 'Clear career paths, mentorship programs, and tuition reimbursement.' },
  { icon: <Zap size={24} />, title: 'Competitive Pay', desc: 'Market-leading salaries, performance bonuses, and profit-sharing.' },
  { icon: <Shield size={24} />, title: '401(k) Retirement', desc: 'Company-matched retirement savings to build long-term financial security.' },
  { icon: <Users size={24} />, title: 'Collaborative Culture', desc: 'Work alongside industry veterans in a fast-growing, team-first environment.' },
  { icon: <Clock size={24} />, title: 'Flexible Schedules', desc: 'Hybrid work options, generous PTO, and work-life balance policies.' },
];

const deptColors = {
  Operations: '#ef4444', Sales: '#f97316', Logistics: '#3b82f6',
  Technology: '#8b5cf6', Marketing: '#10b981',
};

export default function CareersPage() {
  const [openPositions, setOpenPositions] = useState([]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/careers/jobs');
        setOpenPositions(res.data);
      } catch (err) {
        console.error('Failed to load jobs', err);
      }
    };
    fetchJobs();
  }, []);

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', position: '', experience: '',
    portfolio_url: '', cover_letter: '', notes: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { setError('Only PDF, DOC, or DOCX files are accepted.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('File size must be under 10 MB.'); return; }
    setError('');
    setResumeFile(file);
  };

  const handleApply = (position) => {
    setSelectedPosition(position);
    setForm(f => ({ ...f, position: position.title }));
    document.getElementById('careers-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.position) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (resumeFile) formData.append('resume', resumeFile);
      await api.post('/careers', formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '100px' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(5rem,10vw,8rem) 0' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="mmr-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="section-label" style={{ marginBottom: '16px', display: 'block' }}>Join Our Team</span>
            <h1 className="font-display" style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', lineHeight: 0.9, color: '#fff', marginBottom: '24px' }}>
              BUILD THE<br />
              <span style={{ color: 'var(--accent)' }}>FUTURE OF</span><br />
              AMUSEMENT
            </h1>
            <p className="font-body" style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '540px', marginBottom: '40px' }}>
              MMR Amusements is growing fast. We're looking for driven, passionate people to join our team and help shape the future of the American amusement industry.
            </p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {[{ n: openPositions.length, l: 'Open Positions' }, { n: '50+', l: 'Team Members' }, { n: '15+', l: 'Years in Industry' }].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div className="font-display" style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>{s.n}</div>
                  <div className="font-body" style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) 0', borderTop: '1px solid var(--border)' }}>
        <div className="mmr-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-label">Why Join MMR</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', marginTop: '8px' }}>
              WORK THAT <span style={{ color: 'var(--accent)' }}>MATTERS</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.5 }} viewport={{ once: true }}
                style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', transition: 'border-color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>{b.icon}</div>
                <h3 className="font-heading" style={{ fontSize: '16px', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>{b.title}</h3>
                <p className="font-body" style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN POSITIONS ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) 0', borderTop: '1px solid var(--border)', background: 'var(--dark)' }}>
        <div className="mmr-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-label">Now Hiring</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#fff', marginTop: '8px' }}>
              OPEN <span style={{ color: 'var(--accent)' }}>POSITIONS</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {openPositions.map((pos, i) => (
              <motion.div key={pos.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07, duration: 0.45 }} viewport={{ once: true }}
                style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', transition: 'border-color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', fontFamily: "'Oswald',sans-serif", fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: `${deptColors[pos.dept] || '#6366f1'}20`, color: deptColors[pos.dept] || '#6366f1', padding: '3px 10px', borderRadius: '4px' }}>{pos.dept}</span>
                    <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', padding: '3px 10px', borderRadius: '4px', fontFamily: "'Oswald',sans-serif", letterSpacing: '0.1em' }}>{pos.type}</span>
                    <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', padding: '3px 10px', borderRadius: '4px', fontFamily: "'Oswald',sans-serif", letterSpacing: '0.1em' }}>{pos.level}</span>
                  </div>
                  <h3 className="font-heading" style={{ fontSize: '18px', color: '#fff', fontWeight: 600 }}>{pos.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: 'var(--muted)', fontSize: '12px' }}>
                    <MapPin size={12} /> {pos.location}
                  </div>
                </div>
                <button onClick={() => handleApply(pos)} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.07em', transition: 'all 0.2s', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
                >
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section id="careers-form" style={{ padding: 'clamp(4rem,8vw,7rem) 0', borderTop: '1px solid var(--border)' }}>
        <div className="mmr-container">
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span className="section-label">Apply Today</span>
              <h2 className="font-display" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#fff', marginTop: '8px' }}>
                {selectedPosition ? <span>APPLYING FOR <span style={{ color: 'var(--accent)' }}>{selectedPosition.title.split(' ')[0].toUpperCase()}</span></span> : <>START YOUR <span style={{ color: 'var(--accent)' }}>APPLICATION</span></>}
              </h2>
              {selectedPosition && <p className="font-body" style={{ color: 'var(--muted)', marginTop: '8px' }}>{selectedPosition.title} · {selectedPosition.dept} · {selectedPosition.location}</p>}
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '64px 40px', background: 'var(--card)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px' }}>
                <CheckCircle size={56} style={{ color: '#22c55e', margin: '0 auto 20px' }} />
                <h3 className="font-display" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '12px' }}>APPLICATION RECEIVED!</h3>
                <p className="font-body" style={{ color: 'var(--muted)', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto' }}>
                  Thank you for applying. Our team will review your application and reach out within 3–5 business days.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: 'clamp(28px,5vw,48px)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }} className="form-grid-2">
                  {[
                    { name: 'full_name', label: 'Full Name *', type: 'text', placeholder: 'John Smith' },
                    { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'john@email.com' },
                    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000' },
                    { name: 'experience', label: 'Years of Experience', type: 'text', placeholder: 'e.g. 3-5 years' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="font-heading" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>{f.label}</label>
                      <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange}
                        style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', fontFamily: "'Inter',sans-serif", outline: 'none', transition: 'border-color 0.2s', cursor: 'pointer' }}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="font-heading" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Position Applying For *</label>
                  <select name="position" value={form.position} onChange={handleChange}
                    style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px', color: form.position ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '14px', fontFamily: "'Inter',sans-serif", outline: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  >
                    <option value="" style={{ background: 'var(--card)' }}>Select a position...</option>
                    {openPositions.map(p => <option key={p.title} value={p.title} style={{ background: 'var(--card)' }}>{p.title}</option>)}
                    <option value="Other" style={{ background: 'var(--card)' }}>Other / General Application</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="font-heading" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Portfolio / LinkedIn URL</label>
                  <input name="portfolio_url" type="url" placeholder="https://linkedin.com/in/yourname" value={form.portfolio_url} onChange={handleChange}
                    style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', fontFamily: "'Inter',sans-serif", outline: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="font-heading" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Resume Upload (PDF / DOC / DOCX)</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface)', border: `1px dashed ${resumeFile ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '8px', padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <Upload size={20} style={{ color: resumeFile ? '#22c55e' : 'var(--muted)', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: resumeFile ? '#22c55e' : 'var(--muted)' }}>{resumeFile ? resumeFile.name : 'Click to browse or drag & drop your resume'}</span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="font-heading" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Cover Letter</label>
                  <textarea name="cover_letter" rows={5} placeholder="Tell us why you'd be a great fit for MMR Amusements..." value={form.cover_letter} onChange={handleChange}
                    style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', fontFamily: "'Inter',sans-serif", outline: 'none', resize: 'vertical', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label className="font-heading" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Additional Notes</label>
                  <textarea name="notes" rows={3} placeholder="Any additional information you'd like us to know..." value={form.notes} onChange={handleChange}
                    style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', fontFamily: "'Inter',sans-serif", outline: 'none', resize: 'vertical', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
                    <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                    <span className="font-body" style={{ fontSize: '13px', color: '#ef4444' }}>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  style={{ width: '100%', background: submitting ? 'rgba(239,68,68,0.5)' : 'var(--accent)', border: 'none', color: '#fff', padding: '16px', borderRadius: '10px', cursor: 'pointer', fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#dc2626'; }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = 'var(--accent)'; }}
                >
                  <Briefcase size={18} />
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .form-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
