import { useState } from 'react';
import { Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '../hooks/useToast.jsx';
import PageHeader from '../components/ui/PageHeader';

function AdminToggle({ checked, onChange, label, description }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--adm-border)' }}>
      <div>
        <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--adm-text)' }}>{label}</div>
        {description && <div style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>{description}</div>}
      </div>
      <button type="button" onClick={() => onChange(!checked)} className={`adm-toggle ${checked ? 'on' : ''}`} />
    </div>
  );
}

export default function SettingsPage() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      storeName: 'MMR Amusements',
      tagline: 'Premium Amusement Equipment & Parts',
      email: 'support@mmramusements.com',
      phone: '+1 2103888416',
      address1: '2543 Boardwalk st',
      city: 'San Antonio',
      state: 'Texas',
      zip: '78240',
      country: 'United States',
      currency: 'USD',
      timezone: 'America/Chicago',
      orderAlerts: true,
      reviewAlerts: true
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate save
    toast.success('Store settings saved successfully');
    setIsSubmitting(false);
  };

  return (
    <div>
      <PageHeader 
        title="Store Settings" 
        subtitle="Manage global store configuration, contact details, and preferences."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        
        {/* Main Settings Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="adm-form-section">
            <div className="adm-form-section-title">Store Information</div>
            <div className="adm-form-section-desc">Public-facing details about your store.</div>
            
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Store Name</label>
                <input className="adm-input" {...register('storeName')} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Store Tagline</label>
                <input className="adm-input" {...register('tagline')} />
              </div>
            </div>

            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Support Email</label>
                <input className="adm-input" type="email" {...register('email')} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Contact Phone</label>
                <input className="adm-input" {...register('phone')} />
              </div>
            </div>
          </div>

          <div className="adm-form-section">
            <div className="adm-form-section-title">Physical Location</div>
            <div className="adm-form-section-desc">Your primary business address.</div>
            
            <div className="adm-field">
              <label className="adm-label">Address Line 1</label>
              <input className="adm-input" {...register('address1')} />
            </div>

            <div className="adm-form-grid-3">
              <div className="adm-field">
                <label className="adm-label">City</label>
                <input className="adm-input" {...register('city')} />
              </div>
              <div className="adm-field">
                <label className="adm-label">State / Province</label>
                <input className="adm-input" {...register('state')} />
              </div>
              <div className="adm-field">
                <label className="adm-label">ZIP / Postal Code</label>
                <input className="adm-input" {...register('zip')} />
              </div>
            </div>

            <div className="adm-field" style={{ maxWidth: '300px' }}>
              <label className="adm-label">Country</label>
              <select className="adm-select" {...register('country')}>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>

          <div className="adm-form-section">
            <div className="adm-form-section-title">Commerce & Preferences</div>
            
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Store Currency</label>
                <select className="adm-select" {...register('currency')}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-label">Timezone</label>
                <select className="adm-select" {...register('timezone')}>
                  <option value="America/Chicago">Central Time (US & Canada)</option>
                  <option value="America/New_York">Eastern Time (US & Canada)</option>
                  <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <Controller
                name="orderAlerts"
                control={control}
                render={({ field }) => (
                  <AdminToggle checked={field.value} onChange={field.onChange} label="Order Notifications" description="Receive email alerts when a new order is placed." />
                )}
              />
              <Controller
                name="reviewAlerts"
                control={control}
                render={({ field }) => (
                  <AdminToggle checked={field.value} onChange={field.onChange} label="Review Notifications" description="Receive alerts when a customer posts a new review." />
                )}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button type="submit" className="adm-btn adm-btn-primary" disabled={isSubmitting}>
              <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

        {/* Right Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="adm-card">
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>System Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--adm-success)', fontSize: '13px', fontWeight: 500 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--adm-success)' }} />
              All systems operational
            </div>
            <p style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '8px', lineHeight: 1.5 }}>
              Storefront is live and accepting traffic. Admin panel is running version 2.1.0.
            </p>
          </div>

          <div className="adm-card">
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Data & Storage</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--adm-muted)' }}>Database</span>
                  <span style={{ color: 'var(--adm-text)', fontWeight: 500 }}>24%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '24%', height: '100%', background: 'var(--adm-accent)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--adm-muted)' }}>Media Storage</span>
                  <span style={{ color: 'var(--adm-text)', fontWeight: 500 }}>68%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', background: '#f59e0b' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
