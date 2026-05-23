import { useForm, Controller } from 'react-hook-form';
import { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  Plus, 
  Link2, 
  AlertCircle 
} from 'lucide-react';

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

function ProductMediaManager({ value = [], onChange }) {
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (!urlPattern.test(urlInput.trim())) {
      setUrlError('Please enter a valid external image URL.');
      return;
    }

    setUrlError('');
    onChange([...value, urlInput.trim()]);
    setUrlInput('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragging(true);
    } else if (e.type === 'dragleave') {
      setDragging(false);
    }
  };

  const processFiles = (files) => {
    if (!files || files.length === 0) return;
    if (value.length >= 5) return;
    
    const newFiles = Array.from(files).slice(0, 5 - value.length);
    const promises = newFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Images => {
      onChange([...value, ...base64Images]);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemove = (index) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const handleMove = (index, direction) => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === value.length - 1) return;

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    const newImages = [...value];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    onChange(newImages);
  };

  const handleSetPrimary = (index) => {
    if (index === 0) return;
    const newImages = [...value];
    const [primary] = newImages.splice(index, 1);
    onChange([primary, ...newImages]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Dual Upload methods wrapper */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Method A: Upload Local Images */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="adm-label">Method A: Upload Local Images</label>
          {value.length < 5 ? (
            <div 
              className={`adm-dropzone ${dragging ? 'dragging' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ 
                cursor: 'pointer',
                border: '1px dashed var(--adm-border)',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                background: dragging ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s ease',
              }}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => processFiles(e.target.files)} 
                accept="image/*" 
                multiple 
                style={{ display: 'none' }} 
              />
              <Upload size={20} style={{ color: dragging ? 'var(--adm-accent)' : 'var(--adm-muted)', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--adm-text)', marginBottom: '2px' }}>
                Drag local files or click to browse
              </div>
              <div style={{ fontSize: '11px', color: 'var(--adm-muted)' }}>
                PNG, JPG, WEBP or GIF (max. 5)
              </div>
            </div>
          ) : (
            <div style={{ 
              border: '1px dashed var(--adm-border)',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              fontSize: '13px',
              color: 'var(--adm-muted)'
            }}>
              Max limit of 5 images reached. Remove an image to add more.
            </div>
          )}
        </div>

        {/* Method B: Paste Image URL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="adm-label">Method B: Paste Image URL</label>
          <div style={{ 
            border: '1px solid var(--adm-border)',
            borderRadius: '8px',
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            height: '100%',
            justifyContent: 'center',
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }}>
                  <Link2 size={14} />
                </span>
                <input
                  type="text"
                  placeholder="https://example.com/image.png"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className={`adm-input ${urlError ? 'adm-input-error' : ''}`}
                  style={{ paddingLeft: '32px', fontSize: '12.5px' }}
                />
              </div>
              <button 
                type="button"
                className="adm-btn adm-btn-secondary" 
                onClick={handleAddUrl}
                style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
            {urlError ? (
              <div style={{ color: 'var(--adm-danger)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} />
                {urlError}
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: 'var(--adm-muted)' }}>
                Input external URLs like <code style={{ color: '#fff' }}>https://example.com/product.jpg</code> to link web resources.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Preview and Reordering Grid */}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="adm-label">Image Gallery ({value.length} of 5)</label>
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
              gap: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--adm-border)',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            {value.map((img, i) => {
              const isPrimary = i === 0;
              return (
                <div 
                  key={i} 
                  style={{ 
                    position: 'relative', 
                    borderRadius: '8px', 
                    border: isPrimary ? '1px solid var(--adm-accent)' : '1px solid var(--adm-border)',
                    background: 'var(--adm-surface)',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: isPrimary ? '0 0 10px rgba(99,102,241,0.15)' : 'none',
                  }}
                >
                  {/* Aspect-ratio image box */}
                  <div style={{ 
                    position: 'relative', 
                    aspectRatio: '1', 
                    borderRadius: '6px', 
                    overflow: 'hidden', 
                    background: '#0d0d0f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={img} 
                      alt={`Product image ${i + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/600x400?text=Broken+Image+Link';
                        e.target.style.opacity = 0.5;
                      }}
                    />

                    {/* Primary Badge Overlay */}
                    {isPrimary && (
                      <div style={{ 
                        position: 'absolute', 
                        top: '4px', 
                        left: '4px', 
                        background: 'var(--adm-accent)', 
                        color: '#fff', 
                        fontSize: '9px', 
                        fontWeight: 600, 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        zIndex: 2,
                      }}>
                        <Star size={8} fill="currentColor" />
                        PRIMARY
                      </div>
                    )}

                    {/* X Remove Button */}
                    <button 
                      type="button"
                      onClick={() => handleRemove(i)}
                      style={{ 
                        position: 'absolute', 
                        top: '4px', 
                        right: '4px', 
                        background: 'rgba(13,13,15,0.75)', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '50%', 
                        width: '18px', 
                        height: '18px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        zIndex: 2,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--adm-danger)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(13,13,15,0.75)'}
                    >
                      <X size={10} />
                    </button>

                  </div>

                  {/* Thumbnail Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => handleMove(i, 'left')}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--adm-border)',
                          borderRadius: '4px',
                          padding: '2px 4px',
                          color: i === 0 ? 'rgba(255,255,255,0.1)' : 'var(--adm-text)',
                          cursor: i === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <ArrowLeft size={10} />
                      </button>
                      <button
                        type="button"
                        disabled={i === value.length - 1}
                        onClick={() => handleMove(i, 'right')}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--adm-border)',
                          borderRadius: '4px',
                          padding: '2px 4px',
                          color: i === value.length - 1 ? 'rgba(255,255,255,0.1)' : 'var(--adm-text)',
                          cursor: i === value.length - 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <ArrowRight size={10} />
                      </button>
                    </div>

                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(i)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--adm-accent)',
                          fontSize: '10px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          padding: '2px 4px',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        Set Primary
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductForm({ defaultValues, onSubmit, onCancel, isSubmitting, categories = [] }) {
  const preppedDefaultValues = defaultValues ? {
    ...defaultValues,
    images: defaultValues.images || (defaultValues.image ? [defaultValues.image] : [])
  } : {
    title: '',
    category: '',
    subcategory: '',
    brand: '',
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
    newArrival: false,
    popular: false,
    recommended: false,
    clearance: false,
    active: true,
    image: '',
    images: []
  };

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: preppedDefaultValues
  });

  const selectedMainCategory = watch('category');
  
  // Filter main categories and subcategories
  const mainCategories = categories.filter(c => !c.parent_id);
  const selectedMainCategoryObj = mainCategories.find(c => c.name === selectedMainCategory || c.slug === selectedMainCategory);
  const availableSubcategories = selectedMainCategoryObj 
    ? categories.filter(c => c.parent_id === selectedMainCategoryObj.id)
    : [];

  const handleFormSubmit = (data) => {
    const enrichedData = {
      ...data,
      image: data.images?.[0] || '',
    };
    onSubmit(enrichedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      
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
            <label className="adm-label">Main Category *</label>
            <select className="adm-select" {...register('category', { required: true })}>
              <option value="">Select a main category...</option>
              {mainCategories.map(c => (
                <option key={c.id || c._id || c.name || c} value={c.slug || c.name}>{c.name || c}</option>
              ))}
            </select>
          </div>
          
          <div className="adm-field">
            <label className="adm-label">Subcategory</label>
            <select 
              className="adm-select" 
              {...register('subcategory')}
              disabled={!selectedMainCategory || availableSubcategories.length === 0}
            >
              <option value="">Select a subcategory...</option>
              {availableSubcategories.map(c => (
                <option key={c.id || c.slug || c.name} value={c.slug || c.name}>{c.name}</option>
              ))}
            </select>
            {selectedMainCategory && availableSubcategories.length === 0 && (
              <div style={{ fontSize: '11px', color: 'var(--adm-muted)', marginTop: '4px' }}>
                No subcategories available.
              </div>
            )}
          </div>

          <div className="adm-field">
            <label className="adm-label">Brand</label>
            <input className="adm-input" {...register('brand')} placeholder="e.g. Nintendo" />
          </div>
        </div>

        <div className="adm-form-grid-3" style={{ marginTop: '16px' }}>
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
        <div className="adm-form-section-desc">Manage product visual gallery (local uploads & external URLs), labels, and branding accents.</div>
        
        <div className="adm-field">
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <ProductMediaManager value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="adm-form-grid-3" style={{ marginTop: '24px' }}>
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
            <AdminToggle checked={field.value} onChange={field.onChange} label="Best Seller" description="Show in the Best Sellers section on the homepage." />
          )}
        />
        <Controller
          name="newArrival"
          control={control}
          render={({ field }) => (
            <AdminToggle checked={field.value} onChange={field.onChange} label="New Arrival" description="Show in the New Arrivals section on the homepage." />
          )}
        />
        <Controller
          name="clearance"
          control={control}
          render={({ field }) => (
            <AdminToggle checked={field.value} onChange={field.onChange} label="Clearance" description="Mark product as clearance item." />
          )}
        />
        <Controller
          name="popular"
          control={control}
          render={({ field }) => (
            <AdminToggle checked={field.value} onChange={field.onChange} label="Popular Product" description="Show in the Popular Products section on the homepage." />
          )}
        />
        <Controller
          name="recommended"
          control={control}
          render={({ field }) => (
            <AdminToggle checked={field.value} onChange={field.onChange} label="Recommended" description="Show in the Recommended section on the homepage." />
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
