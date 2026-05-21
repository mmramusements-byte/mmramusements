import { useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import { useBannerStore } from '../store/useBannerStore';
import PageHeader from '../components/ui/PageHeader';
import { Star, TrendingUp, Zap, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { truncate } from '../utils/formatters';

function AdminToggle({ checked, onChange, label, description }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--adm-card)', border: '1px solid var(--adm-border)', borderRadius: '12px', marginBottom: '16px' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--adm-text)' }}>{label}</div>
        {description && <div style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>{description}</div>}
      </div>
      <button type="button" onClick={() => onChange(!checked)} className={`adm-toggle ${checked ? 'on' : ''}`} />
    </div>
  );
}

export default function HomepagePage() {
  const products = useProductStore(state => state.products);
  const toggleFeatured = useProductStore(state => state.toggleFeatured);
  const featured = useProductStore(state => state.getFeatured());
  const trending = useProductStore(state => state.getTrending());
  const bestSellers = useProductStore(state => state.getBestSellers());
  
  const [activeTab, setActiveTab] = useState('featured');
  const [toggles, setToggles] = useState({
    hero: true,
    featured: true,
    trending: true,
    deals: true,
    reviews: true
  });

  return (
    <div>
      <PageHeader 
        title="Homepage Layout" 
        subtitle="Manage the visibility and content of sections on the storefront homepage."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
        
        {/* Left sidebar: sections list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--adm-muted)', marginBottom: '8px', paddingLeft: '8px' }}>
            Storefront Sections
          </div>
          
          <button 
            className={`adm-nav-link ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
            style={{ width: '100%', border: 'none', background: activeTab === 'hero' ? 'rgba(99,102,241,0.1)' : 'transparent' }}
          >
            <ImageIcon size={16} /> Hero Banners
          </button>
          
          <button 
            className={`adm-nav-link ${activeTab === 'featured' ? 'active' : ''}`}
            onClick={() => setActiveTab('featured')}
            style={{ width: '100%', border: 'none', background: activeTab === 'featured' ? 'rgba(99,102,241,0.1)' : 'transparent' }}
          >
            <Star size={16} /> Featured Products
          </button>

          <button 
            className={`adm-nav-link ${activeTab === 'trending' ? 'active' : ''}`}
            onClick={() => setActiveTab('trending')}
            style={{ width: '100%', border: 'none', background: activeTab === 'trending' ? 'rgba(99,102,241,0.1)' : 'transparent' }}
          >
            <TrendingUp size={16} /> Trending & Best
          </button>

          <button 
            className={`adm-nav-link ${activeTab === 'deals' ? 'active' : ''}`}
            onClick={() => setActiveTab('deals')}
            style={{ width: '100%', border: 'none', background: activeTab === 'deals' ? 'rgba(99,102,241,0.1)' : 'transparent' }}
          >
            <Zap size={16} /> Deals Strip
          </button>

          <button 
            className={`adm-nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
            style={{ width: '100%', border: 'none', background: activeTab === 'reviews' ? 'rgba(99,102,241,0.1)' : 'transparent' }}
          >
            <MessageSquare size={16} /> Customer Reviews
          </button>
        </div>

        {/* Right content panel */}
        <div>
          {activeTab === 'hero' && (
            <div>
              <AdminToggle checked={toggles.hero} onChange={(v) => setToggles({...toggles, hero: v})} label="Hero Banners Section" description="Show the rotating hero banners at the top of the homepage." />
              <p style={{ fontSize: '13px', color: 'var(--adm-muted)' }}>To edit the actual banners, go to <b>Content › Banners</b>.</p>
            </div>
          )}

          {activeTab === 'featured' && (
            <div>
              <AdminToggle checked={toggles.featured} onChange={(v) => setToggles({...toggles, featured: v})} label="Featured Products Section" description="Display the grid of featured products on the homepage." />
              
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Select Featured Products</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {products.map(p => (
                    <div 
                      key={p.id} 
                      className="adm-card" 
                      style={{ padding: '12px', cursor: 'pointer', borderColor: p.featured ? 'var(--adm-accent)' : 'var(--adm-border)', background: p.featured ? 'rgba(99,102,241,0.05)' : 'var(--adm-card)' }}
                      onClick={() => toggleFeatured(p.id)}
                    >
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="checkbox" className="adm-checkbox" checked={p.featured} readOnly style={{ pointerEvents: 'none', marginTop: '2px' }} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--adm-text)', lineHeight: 1.3 }}>{truncate(p.title, 35)}</div>
                          <div style={{ fontSize: '11px', color: 'var(--adm-muted)', marginTop: '4px' }}>{p.category}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trending' && (
            <div>
              <AdminToggle checked={toggles.trending} onChange={(v) => setToggles({...toggles, trending: v})} label="Trending & Best Sellers Sections" description="Show the horizontal scrolling carousels on the homepage." />
              <p style={{ fontSize: '13px', color: 'var(--adm-muted)' }}>Currently displaying <b>{trending.length}</b> trending and <b>{bestSellers.length}</b> best seller items.</p>
              <p style={{ fontSize: '13px', color: 'var(--adm-muted)', marginTop: '8px' }}>To edit these lists, go to <b>Catalog › Products</b> and edit individual products.</p>
            </div>
          )}

          {activeTab === 'deals' && (
            <div>
              <AdminToggle checked={toggles.deals} onChange={(v) => setToggles({...toggles, deals: v})} label="Deals Strip" description="Show the promotional deals banner on the homepage." />
              <p style={{ fontSize: '13px', color: 'var(--adm-muted)' }}>To manage deals, go to <b>Catalog › Deals</b>.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <AdminToggle checked={toggles.reviews} onChange={(v) => setToggles({...toggles, reviews: v})} label="Reviews Section" description="Show the customer testimonials on the homepage." />
              <p style={{ fontSize: '13px', color: 'var(--adm-muted)' }}>To manage reviews, go to <b>Content › Reviews</b>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
