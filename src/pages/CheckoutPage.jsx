import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { playClickSound, playHoverSound } from '../utils/audio';
import api from '../lib/api';

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  company_name: z.string().optional(),
  business_type: z.string().min(2, 'Business type is required'),
  shipping_address: z.string().min(5, 'Shipping address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip_code: z.string().min(5, 'ZIP Code is required'),
  country: z.string().min(2, 'Country is required'),
  notes: z.string().optional(),
  preferred_contact_method: z.enum(['Email', 'Phone', 'Text Message']),
});

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      preferred_contact_method: 'Email',
      country: 'United States'
    }
  });

  const subtotal = getSubtotal();
  // Assume flat tax/shipping placeholder or 0 for now until manual review
  const estimatedTotal = subtotal;

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const payload = {
        ...data,
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.title,
          quantity: item.quantity,
          unit_price: item.discount_price || item.price,
          subtotal: (item.discount_price || item.price) * item.quantity
        })),
        subtotal,
        total: estimatedTotal,
        // Mock PayPal Transaction ID for placeholder flow
        paypal_transaction_id: 'PAYPAL-MOCK-TXN-PLACEHOLDER'
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
        <h2 className="font-display" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '16px' }}>Your cart is empty</h2>
        <p className="font-body" style={{ color: 'var(--muted)', marginBottom: '32px' }}>Add some products before proceeding to checkout.</p>
        <Link to="/" onClick={playClickSound} style={{ padding: '12px 24px', background: 'var(--accent)', color: '#000', borderRadius: '6px', textDecoration: 'none', fontWeight: 700 }}>
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--black)' }}>
      <div className="mmr-container" style={{ padding: '40px clamp(1rem, 4vw, 5rem)' }}>
        
        <Link to="/" onClick={playClickSound} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', textDecoration: 'none', marginBottom: '32px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Back to Shopping
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
          
          {/* Checkout Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '32px', textTransform: 'uppercase' }}>Secure Checkout</h1>
            
            {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h2 className="font-heading" style={{ fontSize: '18px', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', background: 'var(--accent)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>1</span>
                  Contact Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name *</label>
                    <input {...register('customer_name')} style={{ width: '100%', padding: '14px', background: 'var(--card)', border: `1px solid ${errors.customer_name ? '#ef4444' : 'var(--border)'}`, borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="John Doe" />
                    {errors.customer_name && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.customer_name.message}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address *</label>
                    <input {...register('email')} type="email" style={{ width: '100%', padding: '14px', background: 'var(--card)', border: `1px solid ${errors.email ? '#ef4444' : 'var(--border)'}`, borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="john@example.com" />
                    {errors.email && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email.message}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number *</label>
                    <input {...register('phone')} style={{ width: '100%', padding: '14px', background: 'var(--card)', border: `1px solid ${errors.phone ? '#ef4444' : 'var(--border)'}`, borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="(555) 123-4567" />
                    {errors.phone && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.phone.message}</span>}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h2 className="font-heading" style={{ fontSize: '18px', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', background: 'var(--accent)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>2</span>
                  Business Details
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company Name</label>
                    <input {...register('company_name')} style={{ width: '100%', padding: '14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="Company LLC" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Type *</label>
                    <select {...register('business_type')} style={{ width: '100%', padding: '14px', background: 'var(--card)', border: `1px solid ${errors.business_type ? '#ef4444' : 'var(--border)'}`, borderRadius: '8px', color: '#fff', outline: 'none', appearance: 'none' }}>
                      <option value="">Select Type...</option>
                      <option value="Arcade / FEC">Arcade / FEC</option>
                      <option value="Bar / Route Operator">Bar / Route Operator</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Individual / Home Use">Individual / Home Use</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.business_type && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.business_type.message}</span>}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h2 className="font-heading" style={{ fontSize: '18px', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', background: 'var(--accent)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>3</span>
                  Shipping Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address *</label>
                    <input {...register('shipping_address')} style={{ width: '100%', padding: '14px', background: 'var(--card)', border: `1px solid ${errors.shipping_address ? '#ef4444' : 'var(--border)'}`, borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="123 Main St, Suite 100" />
                    {errors.shipping_address && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.shipping_address.message}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>City *</label>
                    <input {...register('city')} style={{ width: '100%', padding: '14px', background: 'var(--card)', border: `1px solid ${errors.city ? '#ef4444' : 'var(--border)'}`, borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="San Antonio" />
                    {errors.city && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.city.message}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>State *</label>
                    <input {...register('state')} style={{ width: '100%', padding: '14px', background: 'var(--card)', border: `1px solid ${errors.state ? '#ef4444' : 'var(--border)'}`, borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="TX" />
                    {errors.state && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.state.message}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ZIP Code *</label>
                    <input {...register('zip_code')} style={{ width: '100%', padding: '14px', background: 'var(--card)', border: `1px solid ${errors.zip_code ? '#ef4444' : 'var(--border)'}`, borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="78240" />
                    {errors.zip_code && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.zip_code.message}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Country *</label>
                    <input {...register('country')} style={{ width: '100%', padding: '14px', background: 'var(--card)', border: `1px solid ${errors.country ? '#ef4444' : 'var(--border)'}`, borderRadius: '8px', color: '#fff', outline: 'none' }} />
                    {errors.country && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.country.message}</span>}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h2 className="font-heading" style={{ fontSize: '18px', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '28px', height: '28px', background: 'var(--accent)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>4</span>
                  Additional Notes
                </h2>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preferred Contact Method *</label>
                  <select {...register('preferred_contact_method')} style={{ width: '100%', padding: '14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', outline: 'none', appearance: 'none', marginBottom: '16px' }}>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Text Message">Text Message</option>
                  </select>
                  <textarea {...register('notes')} rows={4} style={{ width: '100%', padding: '14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'vertical' }} placeholder="Any special instructions or questions about shipping?" />
                </div>
              </div>

            </form>
          </motion.div>

          {/* Order Summary & Checkout Action */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} style={{ position: 'sticky', top: '120px' }}>
            <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h2 className="font-heading" style={{ fontSize: '20px', color: '#fff', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Order Summary</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '300px', overflowY: 'auto' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: 'var(--card)', overflow: 'hidden' }}>
                      <img src={item.image_url || item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 className="font-heading" style={{ fontSize: '14px', color: '#fff', margin: '0 0 4px', lineHeight: 1.2 }}>{item.title}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--muted)', fontSize: '12px' }}>Qty: {item.quantity}</span>
                        <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '13px' }}>${((item.discount_price || item.price) * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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

              {/* PAYPAL CHECKOUT PLACEHOLDER */}
              <div style={{ marginTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '12px', justifyContent: 'center', marginBottom: '16px' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--accent)' }} /> 100% Secure Transaction
                </div>
                
                {(!isValid) && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center', fontWeight: 700 }}>
                    ⚠️ You must fill out the entire form above to complete checkout.
                  </div>
                )}
                
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || !isValid}
                  style={{
                    width: '100%', padding: '16px', background: '#ffc439', color: '#000', border: 'none', borderRadius: '4px',
                    fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                    cursor: isSubmitting || !isValid ? 'not-allowed' : 'pointer', opacity: isSubmitting || !isValid ? 0.7 : 1, transition: 'all 0.2s',
                    fontFamily: 'Helvetica Neue, Arial, sans-serif', fontStyle: 'italic'
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
    </div>
  );
}
