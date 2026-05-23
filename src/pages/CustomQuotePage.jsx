import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { playClickSound, playSuccessSound } from '../utils/audio';

// Validation Schema
const quoteSchema = z.object({
  full_name: z.string().min(2, "Full Name is required"),
  phone: z.string().optional(),
  email: z.string().email("Valid email is required"),
  company: z.string().optional(),
  message: z.string().min(10, "Please provide more details for your quote request")
});

export default function CustomQuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(quoteSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      phone: '',
      email: '',
      company: '',
      message: ''
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    playClickSound();

    try {
      const payload = {
        ...data,
        subject: "Custom Quote Request"
      };

      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to submit quote request');

      setIsSuccess(true);
      playSuccessSound();
      toast.success("Quote request submitted successfully!", {
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid var(--accent)' },
        iconTheme: { primary: 'var(--accent)', secondary: '#000' }
      });
    } catch (err) {
      toast.error("An error occurred. Please try again.", {
        style: { background: '#ef4444', color: '#fff' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mmr-container" style={{ padding: '120px clamp(1.25rem, 4vw, 5rem)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--card)', border: '1px solid var(--accent)', padding: '60px 40px', borderRadius: '16px', textAlign: 'center', maxWidth: '600px', width: '100%' }}
        >
          <CheckCircle size={64} style={{ color: 'var(--accent)', margin: '0 auto 24px' }} />
          <h1 className="font-display" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Quote Requested</h1>
          <p className="font-body" style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: '32px' }}>
            Thank you for your interest in our products. We have received your custom quote request and a representative will contact you shortly with pricing and availability.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ padding: '16px 32px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; playClickSound(); }}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Return to Store
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mmr-container" style={{ padding: '120px clamp(1.25rem, 4vw, 5rem) 60px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }} className="quote-grid">
        
        {/* Left Side: Context */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent)', marginBottom: '16px' }}>
            <FileText size={24} />
            <span className="font-heading" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontSize: '14px' }}>Custom Orders</span>
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '24px' }}>
            Request<br/>Quote
          </h1>
          <p className="font-body" style={{ color: '#e5e7eb', fontSize: '18px', lineHeight: 1.6, marginBottom: '32px' }}>
            Thank you for your interest in MMR Amusements. Please fill out our quote request form and we will contact you shortly with a personalized commercial proposal.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '12px' }}>
            <h3 className="font-heading" style={{ color: 'var(--accent)', fontSize: '14px', textTransform: 'uppercase', marginBottom: '16px' }}>In the Details field please include:</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--muted)' }} className="font-body">
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                Specific Product Name(s)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                Quantity Requested
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                Ship-to Address for Freight Quote
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                Timeline or Special Requirements
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ background: 'var(--card)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', gap: '20px' }} className="form-row-mobile">
              <div style={{ flex: 1 }}>
                <label className="font-heading" style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Full Name <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <input 
                  type="text" 
                  {...register('full_name')}
                  style={{ width: '100%', padding: '14px 16px', background: 'var(--bg)', border: errors.full_name ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', outline: 'none' }}
                />
                {errors.full_name && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.full_name.message}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <label className="font-heading" style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Phone Number
                </label>
                <input 
                  type="text" 
                  {...register('phone')}
                  style={{ width: '100%', padding: '14px 16px', background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }} className="form-row-mobile">
              <div style={{ flex: 1 }}>
                <label className="font-heading" style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Email Address <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <input 
                  type="email" 
                  {...register('email')}
                  style={{ width: '100%', padding: '14px 16px', background: 'var(--bg)', border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', outline: 'none' }}
                />
                {errors.email && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email.message}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <label className="font-heading" style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Company Name
                </label>
                <input 
                  type="text" 
                  {...register('company')}
                  style={{ width: '100%', padding: '14px 16px', background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label className="font-heading" style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                Comments / Details <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <textarea 
                {...register('message')}
                rows={6}
                style={{ width: '100%', padding: '16px', background: 'var(--bg)', border: errors.message ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
                placeholder="Product names, quantities, shipping address, etc..."
              />
              {errors.message && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.message.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              style={{
                width: '100%', padding: '18px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: isSubmitting || !isValid ? 'not-allowed' : 'pointer', opacity: isSubmitting || !isValid ? 0.7 : 1, transition: 'all 0.2s',
                marginTop: '12px'
              }}
              onMouseEnter={(e) => { if (!isSubmitting && isValid) e.currentTarget.style.background = '#fff'; playClickSound(); }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; }}
            >
              {isSubmitting ? 'Sending Request...' : 'Submit Quote Request'} <Send size={16} />
            </button>

          </form>
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .quote-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 600px) {
          .form-row-mobile {
            flex-direction: column;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
