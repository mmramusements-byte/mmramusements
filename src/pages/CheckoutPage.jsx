import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Trash2, MapPin, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { playClickSound, playHoverSound } from '../utils/audio';
import api from '../lib/api';

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  shipping_address: z.string().min(5, 'Shipping address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip_code: z.string().min(3, 'ZIP / Postal Code is required'),
  country: z.string().min(2, 'Country is required'),
  notes: z.string().optional(),
  preferred_contact_method: z.enum(['Email', 'Phone', 'Text Message']),
});

// ── Input style helper ──────────────────────────────────────────
const inputStyle = (hasError) => ({
  width: '100%',
  padding: '14px',
  background: 'var(--card)',
  border: `1px solid ${hasError ? '#ef4444' : 'var(--border)'}`,
  borderRadius: '8px',
  color: '#fff',
  outline: 'none',
  fontSize: '14px',
  boxSizing: 'border-box',
});

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--muted)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart, removeItem } = useCartStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [locLoading, setLocLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      preferred_contact_method: 'Email',
      country: 'United States',
    },
  });

  const subtotal = getSubtotal();
  const estimatedTotal = subtotal;

  // ── Geolocation autofill using OpenStreetMap Nominatim ────────
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};

          // Build a human-readable street line
          const streetNumber = addr.house_number || '';
          const streetName = addr.road || addr.pedestrian || addr.footway || '';
          const streetLine = [streetNumber, streetName].filter(Boolean).join(' ');

          setValue('shipping_address', streetLine || data.display_name?.split(',')[0] || '', { shouldValidate: true });
          setValue('city', addr.city || addr.town || addr.village || addr.county || '', { shouldValidate: true });
          setValue('state', addr.state || '', { shouldValidate: true });
          setValue('zip_code', addr.postcode || '', { shouldValidate: true });
          setValue('country', addr.country || '', { shouldValidate: true });
        } catch {
          alert('Could not retrieve address. Please fill it in manually.');
        } finally {
          setLocLoading(false);
        }
      },
      (err) => {
        setLocLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          alert('Location access denied. Please allow location access in your browser and try again.');
        } else {
          alert('Unable to retrieve your location. Please fill in the address manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        ...data,
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.title,
          quantity: item.quantity,
          unit_price: item.discount_price || item.price,
          subtotal: (item.discount_price || item.price) * item.quantity,
        })),
        subtotal,
        total: estimatedTotal,
        paypal_transaction_id: 'PAYPAL-MOCK-TXN-PLACEHOLDER',
      };

      const response = await api.post('/orders', payload);

      playClickSound();
      clearCart();
      navigate('/order-success', { state: { orderNumber: response.order_number, email: data.email } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitting) {
    return (
      <div style={{ padding: '160px 24px', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '16px' }}>
          Your cart is empty
        </h2>
        <p className="font-body" style={{ color: 'var(--muted)', marginBottom: '32px' }}>
          Add some products before proceeding to checkout.
        </p>
        <Link
          to="/"
          onClick={playClickSound}
          style={{ padding: '12px 24px', background: 'var(--accent)', color: '#000', borderRadius: '6px', textDecoration: 'none', fontWeight: 700 }}
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--black)' }}>
      <div className="mmr-container" style={{ padding: '40px clamp(1rem, 4vw, 5rem)' }}>

        <Link
          to="/"
          onClick={playClickSound}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', textDecoration: 'none', marginBottom: '32px', fontSize: '14px' }}
        >
          <ArrowLeft size={16} /> Back to Shopping
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>

          {/* ── Checkout Form ────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '32px', textTransform: 'uppercase' }}>
              Secure Checkout
            </h1>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* ── Section 1: Contact Information ── */}
              <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h2 className="font-heading" style={{ fontSize: '18px', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', background: 'var(--accent)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>1</span>
                  Contact Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Full Name *</label>
                    <input {...register('customer_name')} style={inputStyle(errors.customer_name)} placeholder="John Doe" />
                    {errors.customer_name && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.customer_name.message}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input {...register('email')} type="email" style={inputStyle(errors.email)} placeholder="john@example.com" />
                    {errors.email && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email.message}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input {...register('phone')} style={inputStyle(errors.phone)} placeholder="(555) 123-4567" />
                    {errors.phone && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.phone.message}</span>}
                  </div>
                </div>
              </div>

              {/* ── Section 2: Shipping Information ── */}
              <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <h2 className="font-heading" style={{ fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                    <span style={{ width: '28px', height: '28px', background: 'var(--accent)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>2</span>
                    Shipping Information
                  </h2>
                  {/* ── Use My Location button ── */}
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={locLoading}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      padding: '9px 16px', background: locLoading ? 'rgba(var(--accent-rgb,239,68,68),0.1)' : 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px',
                      color: 'var(--accent)', fontSize: '13px', fontWeight: 600,
                      cursor: locLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s', opacity: locLoading ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => { if (!locLoading) e.currentTarget.style.background = 'rgba(239,68,68,0.16)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                  >
                    {locLoading
                      ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Detecting…</>
                      : <><MapPin size={14} /> Use My Location</>
                    }
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Address *</label>
                    <input {...register('shipping_address')} style={inputStyle(errors.shipping_address)} placeholder="123 Main St, Suite 100" />
                    {errors.shipping_address && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.shipping_address.message}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <input {...register('city')} style={inputStyle(errors.city)} placeholder="San Antonio" />
                    {errors.city && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.city.message}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>State / Province *</label>
                    <input {...register('state')} style={inputStyle(errors.state)} placeholder="TX" />
                    {errors.state && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.state.message}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>ZIP / Postal Code *</label>
                    <input {...register('zip_code')} style={inputStyle(errors.zip_code)} placeholder="78240" />
                    {errors.zip_code && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.zip_code.message}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>Country *</label>
                    <input {...register('country')} style={inputStyle(errors.country)} />
                    {errors.country && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.country.message}</span>}
                  </div>
                </div>
              </div>

              {/* ── Section 3: Additional Notes ── */}
              <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h2 className="font-heading" style={{ fontSize: '18px', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', background: 'var(--accent)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>3</span>
                  Additional Notes
                </h2>
                <div>
                  <label style={labelStyle}>Preferred Contact Method *</label>
                  <select {...register('preferred_contact_method')} style={{ ...inputStyle(false), appearance: 'none', marginBottom: '16px' }}>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Text Message">Text Message</option>
                  </select>
                  <textarea
                    {...register('notes')}
                    rows={4}
                    style={{ ...inputStyle(false), resize: 'vertical' }}
                    placeholder="Any special instructions or questions about shipping?"
                  />
                </div>
              </div>

            </form>
          </motion.div>

          {/* ── Order Summary ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ position: 'sticky', top: '120px' }}
          >
            <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h2 className="font-heading" style={{ fontSize: '20px', color: '#fff', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '340px', overflowY: 'auto' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    {/* Thumbnail */}
                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: 'var(--card)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.image_url || item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 className="font-heading" style={{ fontSize: '13px', color: '#fff', margin: '0 0 4px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--muted)', fontSize: '12px' }}>Qty: {item.quantity}</span>
                        <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '13px' }}>
                          ${((item.discount_price || item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* ── Remove item button ── */}
                    <button
                      type="button"
                      onClick={() => { removeItem(item.id); playClickSound(); }}
                      title={`Remove ${item.title}`}
                      style={{
                        background: 'none', border: 'none', padding: '6px',
                        color: 'rgba(239,68,68,0.5)', cursor: 'pointer',
                        borderRadius: '6px', transition: 'all 0.18s', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        outline: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = 'rgba(239,68,68,0.5)';
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '14px' }}>
                  <span>Subtotal</span>
                  <span className="font-mono">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '14px' }}>
                  <span>Estimated Shipping</span>
                  <span className="font-mono" style={{ color: '#fff' }}>TBD manually</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '20px', fontWeight: 700, marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <span>Total</span>
                  <span className="font-mono">${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* PayPal Button */}
              <div style={{ marginTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '12px', justifyContent: 'center', marginBottom: '16px' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--accent)' }} /> 100% Secure Transaction
                </div>

                {!isValid && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center', fontWeight: 700 }}>
                    ⚠️ Please fill out the entire form to complete checkout.
                  </div>
                )}

                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || !isValid}
                  style={{
                    width: '100%', padding: '16px', background: '#ffc439', color: '#000', border: 'none', borderRadius: '4px',
                    fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                    cursor: isSubmitting || !isValid ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting || !isValid ? 0.7 : 1, transition: 'all 0.2s',
                    fontFamily: 'Helvetica Neue, Arial, sans-serif', fontStyle: 'italic',
                  }}
                  onMouseEnter={(e) => { if (!isSubmitting && isValid) e.currentTarget.style.filter = 'brightness(1.1)'; playHoverSound(); }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
                >
                  <span style={{ color: '#003087' }}>Pay</span><span style={{ color: '#0079C1' }}>Pal</span> Checkout
                </button>

                <p style={{ color: 'var(--muted)', fontSize: '11px', textAlign: 'center', marginTop: '16px', lineHeight: 1.5 }}>
                  By completing this order request, an MMR Amusements representative will contact you manually to confirm freight shipping and finalize your transaction.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
