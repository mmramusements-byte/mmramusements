import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import ImageUpload from '../ui/ImageUpload';

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

function TagInput({ value = [], onChange }) {
  const [input, setInput] = useState('');
  const handleKey = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) onChange([...value, input.trim()]);
      setInput('');
    }
  };
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
        {value.map(tag => (
          <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '99px', fontSize: '12px', color: '#6366f1' }}>
            {tag}
            <button type="button" onClick={() => onChange(value.filter(t => t !== tag))} style={{ background: 'none', border: 'none', color: '#6366f1', lineHeight: 1 }}>×</button>
          </span>
        ))}
      </div>
      <input 
        className="adm-input" 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        onKeyDown={handleKey} 
        placeholder="Type tag and press Enter..." 
      />
    </div>
  );
}

export default function ProductForm({ defaultValues, onSubmit, onCancel, isSubmitting }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: defaultValues || {
      title: '',
      category: 'Cabinets',
      condition: 'Brand New',
      players: 1,
      price: '',
      discountPrice: '',
      discountLabel: '',
      badge: '',
      badgeColor: '#ef4444',
      accentColor: '#f97316',
      warranty: '1 Year',
      yield: 'Steady Yield',
      shipping: 'Freight Shipping',
      stock: 'In Stock',
      description: '',
      tags: [],
      featured: false,
      trending: false,
      bestSeller: false,
      active: true,
      image: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      
      {/* 1. Basic Info */}
      <div className="adm-form-section">
        <div className="adm-form-section-title">Basic Information</div>
        <div className="adm-form-section-desc">Primary details about the product.</div>
        
        <div className="adm-field">
          <label className="adm-label">Product Title *</label>
          <input className={`adm-input ${errors.title ? 'adm-input-error' : ''}`} {...register('title', { required: 'Title is required' })} placeholder="e.g. MMR Dragon Hunter 6-Player" />
          {errors.title && <div className="adm-error-msg">{errors.title.message}</div>}
        </div>
        
        <div className="adm-form-grid-3">
          <div className="adm-field">
            <label className="adm-label">Category *</label>
            <select className="adm-select" {...register('category', { required: true })}>
              <option value="Cabinets">Cabinets</option>
              <option value="Boards">Boards</option>
              <option value="Validators">Validators</option>
              <option value="Parts">Parts</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          
          <div className="adm-field">
            <label className="adm-label">Condition *</label>
            <select className="adm-select" {...register('condition', { required: true })}>
              <option value="Brand New">Brand New</option>
              <option value="Custom Pre-built">Custom Pre-built</option>
              <option value="Refurbished (A+)">Refurbished (A+)</option>
              <option value="Refurbished">Refurbished</option>
              <option value="Used">Used</option>
            </select>
          </div>

          <div className="adm-field">
            <label className="adm-label">Players</label>
            <input type="number" min="0" className="adm-input" {...register('players')} />
          </div>
        </div>
      </div>

      {/* 2. Pricing */}
      <div className="adm-form-section">
        <div className="adm-form-section-title">Pricing</div>
        <div className="adm-form-section-desc">Manage product pricing and discounts (in USD).</div>
        
        <div className="adm-form-grid-3">
          <div className="adm-field">
            <label className="adm-label">Price ($) *</label>
            <input className={`adm-input ${errors.price ? 'adm-input-error' : ''}`} {...register('price', { required: 'Price is required' })} placeholder="e.g. 5,800" />
            {errors.price && <div className="adm-error-msg">{errors.price.message}</div>}
          </div>
          <div className="adm-field">
            <label className="adm-label">Discount Price ($)</label>
            <input className="adm-input" {...register('discountPrice')} placeholder="e.g. 4,999 (optional)" />
          </div>
          <div className="adm-field">
            <label className="adm-label">Discount Label</label>
            <input className="adm-input" {...register('discountLabel')} placeholder="e.g. 15% OFF" />
          </div>
        </div>
      </div>

      {/* 3. Media & Branding */}
      <div className="adm-form-section">
        <div className="adm-form-section-title">Media & Branding</div>
        <div className="adm-form-section-desc">Product image, badges, and colors.</div>
        
        <div className="adm-field">
          <label className="adm-label">Image Path/URL</label>
          <input className="adm-input" {...register('image')} placeholder="/image_1.jpeg" />
          <div style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '4px' }}>Temporary string input for local images.</div>
        </div>

        <div className="adm-form-grid-3">
          <div className="adm-field">
            <label className="adm-label">Badge Text</label>
            <input className="adm-input" {...register('badge')} placeholder="e.g. Top Earner" />
          </div>
          <div className="adm-field">
            <label className="adm-label">Badge Color</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="color" className="adm-input" style={{ width: '50px', padding: '2px' }} {...register('badgeColor')} />
              <input className="adm-input" {...register('badgeColor')} />
            </div>
          </div>
          <div className="adm-field">
            <label className="adm-label">Accent Color</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="color" className="adm-input" style={{ width: '50px', padding: '2px' }} {...register('accentColor')} />
              <input className="adm-input" {...register('accentColor')} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Specifications */}
      <div className="adm-form-section">
        <div className="adm-form-section-title">Specifications & Logistics</div>
        
        <div className="adm-form-grid">
          <div className="adm-field">
            <label className="adm-label">Warranty</label>
            <select className="adm-select" {...register('warranty')}>
              <option value="90 Days">90 Days</option>
              <option value="6 Months">6 Months</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-label">Yield Category</label>
            <select className="adm-select" {...register('yield')}>
              <option value="Essential Part">Essential Part</option>
              <option value="Reliable">Reliable</option>
              <option value="Steady Yield">Steady Yield</option>
              <option value="High Yield">High Yield</option>
              <option value="Ultra Yield">Ultra Yield</option>
              <option value="Ultra Reliable">Ultra Reliable</option>
              <option value="Industry Standard">Industry Standard</option>
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-label">Shipping</label>
            <select className="adm-select" {...register('shipping')}>
              <option value="Standard Delivery">Standard Delivery</option>
              <option value="Express Delivery">Express Delivery</option>
              <option value="Same-Day Dispatch">Same-Day Dispatch</option>
              <option value="Freight Shipping">Freight Shipping</option>
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-label">Stock Status</label>
            <select className="adm-select" {...register('stock')}>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Pre-Order">Pre-Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Visibility */}
      <div className="adm-form-section">
        <div className="adm-form-section-title">Visibility & Status</div>
        <div className="adm-form-section-desc">Control where this product appears on the storefront.</div>
        
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <AdminToggle checked={field.value} onChange={field.onChange} label="Active Status" description="If inactive, the product is completely hidden from the storefront." />
          )}
        />
        <Controller
          name="featured"
          control={control}
          render={({ field }) => (
            <AdminToggle checked={field.value} onChange={field.onChange} label="Featured Product" description="Show in the Featured section on the homepage and catalog." />
          )}
        />
        <Controller
          name="trending"
          control={control}
          render={({ field }) => (
            <AdminToggle checked={field.value} onChange={field.onChange} label="Trending" description="Show in the Trending Accounts carousel." />
          )}
        />
        <Controller
          name="bestSeller"
          control={control}
          render={({ field }) => (
            <AdminToggle checked={field.value} onChange={field.onChange} label="Best Seller" description="Add Best Seller styling in the catalog." />
          )}
        />
      </div>

      {/* 6. Description */}
      <div className="adm-form-section">
        <div className="adm-form-section-title">Description</div>
        <div className="adm-field" style={{ marginTop: '16px' }}>
          <textarea className={`adm-textarea ${errors.description ? 'adm-input-error' : ''}`} {...register('description', { required: 'Description is required' })} placeholder="Detailed product description..." />
          {errors.description && <div className="adm-error-msg">{errors.description.message}</div>}
        </div>
      </div>

      {/* 7. Tags */}
      <div className="adm-form-section">
        <div className="adm-form-section-title">Tags</div>
        <div className="adm-field" style={{ marginTop: '16px' }}>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
        <button type="button" onClick={onCancel} className="adm-btn adm-btn-ghost">
          Cancel
        </button>
        <button type="submit" className="adm-btn adm-btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (defaultValues ? 'Save Changes' : 'Create Product')}
        </button>
      </div>

    </form>
  );
}
