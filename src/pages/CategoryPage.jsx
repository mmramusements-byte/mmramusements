import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Zap, Award, Layers, Sparkles, Truck, MessageSquare, ChevronRight, ShoppingCart } from 'lucide-react';
import { useProductStore } from '../admin/store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { playHoverSound, playClickSound, playSuccessSound } from '../utils/audio';
import InquiryModal from '../components/common/InquiryModal';
import api from '../lib/api';

export default function CategoryPage() {
  const { mainCategorySlug, subcategorySlug } = useParams();
  const currentSlug = subcategorySlug || mainCategorySlug;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState(null);
  const [mainCategoryData, setMainCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Sync brand state if URL changes
  useEffect(() => {
    setSelectedBrand(searchParams.get('brand') || 'All');
  }, [searchParams]);

  const handleInquire = (item) => {
    setSelectedItem(item);
    setIsInquiryOpen(true);
  };

  // Fetch category data from DB — parallel calls for speed
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        // Special case for dynamic meta categories without DB records
        if (currentSlug === 'clearance') {
          setCategoryData({ name: 'Deals & Clearance', description: 'Massive discounts on premium arcade equipment and hardware.', isSpecial: 'clearance' });
          setMainCategoryData(null);
        } else if (currentSlug === 'best-sellers') {
          setCategoryData({ name: 'Best Sellers', description: 'Our most popular and highest-yielding equipment across the nation.', isSpecial: 'best_seller' });
          setMainCategoryData(null);
        } else if (currentSlug === 'new-arrivals') {
          setCategoryData({ name: 'New Arrivals', description: 'The latest boards, cabinets, and parts to hit the market.', isSpecial: 'new_arrival' });
          setMainCategoryData(null);
        } else {
          // Fire both category lookups IN PARALLEL for speed
          const requests = [api.get(`/categories/${currentSlug}`)];
          if (subcategorySlug && mainCategorySlug) {
            requests.push(api.get(`/categories/${mainCategorySlug}`));
          }
          const [catData, mainCatData] = await Promise.all(requests);
          setCategoryData(catData);
          setMainCategoryData(mainCatData || null);
        }
      } catch (err) {
        console.error(err);
        setError('Category not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [currentSlug, mainCategorySlug, subcategorySlug]);

  const products = useProductStore(state => state.products);
  const activeProducts = products.filter(prod => prod.active);

  // Derive products and dynamic brands list based on category
  const { filteredProducts, availableBrands } = useMemo(() => {
    if (!categoryData) return { filteredProducts: [], availableBrands: ['All'] };

    let baseProducts = activeProducts;

    // Filter by special category or actual category name
    if (categoryData.isSpecial === 'clearance') {
      baseProducts = baseProducts.filter(p => p.clearance || p.discount_price);
    } else if (categoryData.isSpecial === 'best_seller') {
      baseProducts = baseProducts.filter(p => p.best_seller || p.popular);
    } else if (categoryData.isSpecial === 'new_arrival') {
      baseProducts = baseProducts.filter(p => p.new_arrival);
    } else {
      if (subcategorySlug && mainCategoryData) {
        baseProducts = baseProducts.filter(p => 
          (p.category === mainCategoryData.name || p.category === mainCategoryData.slug) && 
          (p.subcategory === categoryData.name || p.subcategory === categoryData.slug)
        );
      } else {
        baseProducts = baseProducts.filter(p => p.category === categoryData.name || p.category === categoryData.slug);
      }
    }

    // Extract brands
    const brands = new Set(['All']);
    baseProducts.forEach(p => {
      if (p.brand && p.brand.trim() !== '') brands.add(p.brand);
    });

    // Apply filters
    const finalProducts = baseProducts.filter(prod => {
      const matchesSearch = prod.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            prod.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'All' || prod.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });

    return { filteredProducts: finalProducts, availableBrands: Array.from(brands).sort() };
  }, [categoryData, activeProducts, searchTerm, selectedBrand]);

  const handleBrandChange = (brand) => {
    playClickSound();
    setSelectedBrand(brand);
    if (brand === 'All') {
      searchParams.delete('brand');
    } else {
      searchParams.set('brand', brand);
    }
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
        <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
        <div className="mmr-container">
          {/* Skeleton header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px', gap: '16px' }}>
            <div style={{ width: '160px', height: '14px', borderRadius: '8px', background: 'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ width: '300px', height: '48px', borderRadius: '8px', background: 'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          </div>
          {/* Skeleton cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="storefront-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: '440px', borderRadius: '16px', background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', border: '1px solid var(--border)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)', color: '#fff', flexDirection: 'column', gap: '20px' }}>
        <h1 className="font-display" style={{ fontSize: '3rem' }}>Category Not Found</h1>
        <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Return to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Category Hero Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '40vh',
        minHeight: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)'
      }}>
        {categoryData.image_url ? (
          <img 
            src={categoryData.image_url} 
            alt={categoryData.name} 
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.4 }} 
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.1) 0%, var(--black) 80%)', zIndex: 0 }} />
        )}
        
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--black), transparent)', zIndex: 1 }} />

        <div className="mmr-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px', fontSize: '12px', color: 'var(--muted)', fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={12} />
            {mainCategoryData && subcategorySlug ? (
              <>
                <Link to={`/categories/${mainCategorySlug}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{mainCategoryData.name}</Link>
                <ChevronRight size={12} />
                <span style={{ color: 'var(--accent)' }}>{categoryData.name}</span>
              </>
            ) : (
              <span style={{ color: 'var(--accent)' }}>{categoryData.name}</span>
            )}
          </div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display" 
            style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: '#fff', lineHeight: 1, textTransform: 'uppercase' }}
          >
            {categoryData.name}
          </motion.h1>
          {categoryData.description && (
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-body" 
              style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', maxWidth: '600px', margin: '16px auto 0', lineHeight: 1.6 }}
            >
              {categoryData.description}
            </motion.p>
          )}
        </div>
      </div>

      <div className="mmr-container" style={{ paddingTop: '40px' }}>
        
        {/* Search & Filter Bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '40px'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input
              type="text"
              placeholder={`Search ${categoryData.name.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px 12px 48px', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Dynamic Brand Tags */}
          {availableBrands.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--muted)', fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '8px' }}>Brand:</span>
              {availableBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandChange(brand)}
                  style={{
                    cursor: 'pointer', padding: '8px 18px', borderRadius: '6px', fontFamily: 'Oswald, sans-serif', fontSize: '12px', textTransform: 'uppercase',
                    border: `1px solid ${selectedBrand === brand ? 'var(--accent)' : 'var(--border)'}`,
                    background: selectedBrand === brand ? 'var(--accent)' : 'transparent',
                    color: selectedBrand === brand ? '#000' : 'var(--muted)', transition: 'all 0.2s'
                  }}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Count Indicator */}
        <div style={{ marginBottom: '24px' }}>
          <p className="font-heading" style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Showing {filteredProducts.length} Equipment {filteredProducts.length === 1 ? 'Match' : 'Matches'}
          </p>
        </div>

        {/* Listings Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
              className="storefront-grid"
            >
              {filteredProducts.map((item, index) => (
                <ProductCatalogCard key={item.id} item={item} index={index} onInquire={handleInquire} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}
            >
              <Sparkles size={40} style={{ color: 'var(--muted)', marginBottom: '16px' }} />
              <h3 className="font-display" style={{ fontSize: '2rem', color: '#fff', marginBottom: '8px' }}>NO EQUIPMENT FOUND</h3>
              <p className="font-body" style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '300px', margin: '0 auto' }}>
                Try adjusting your search terms or choosing a different brand filter.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <InquiryModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} item={selectedItem} />

      <style>{`
        @media (max-width: 1024px) { .storefront-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .storefront-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

// Reusing the ProductCatalogCard logic 
function ProductCatalogCard({ item, index, onInquire }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setTilt({ x: -(y / (box.height / 2)) * 8, y: (x / (box.width / 2)) * 8 });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setHovered(true); playHoverSound(); }}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onClick={() => { playClickSound(); navigate(`/product/${item.id}`); }}
      style={{
        position: 'relative', cursor: 'pointer', height: '440px', borderRadius: '16px', overflow: 'hidden',
        border: '1px solid var(--border)', background: 'var(--card)',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 14px 40px rgba(0,0,0,0.6), 0 0 25px rgba(34,197,94,0.15)` : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <motion.img
          src={item.image_url}
          alt={item.title}
          animate={{ scale: hovered ? 1.08 : 1, filter: hovered ? 'brightness(1.1)' : 'brightness(1)' }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 100%)', transition: 'opacity 0.3s', opacity: hovered ? 1 : 0.8 }} />
      </div>

      {/* Badges */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
          {item.clearance && <span style={{ background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '10px', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Clearance</span>}
          {item.new_arrival && <span style={{ background: '#3b82f6', color: '#fff', fontWeight: 700, fontSize: '10px', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>New</span>}
        </div>
        <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '5px', background: 'rgba(3,3,3,0.85)', color: 'var(--accent)', border: '1px solid var(--accent)', height: 'max-content' }}>
          ${item.price}
        </span>
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '24px' }}>
        <p className="font-heading" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '6px', fontWeight: 600 }}>
          {item.brand ? `${item.brand} • ` : ''}{item.condition}
        </p>
        <h3 className="font-display" style={{ fontSize: '1.8rem', color: '#fff', lineHeight: 1.1, marginBottom: '12px' }}>
          {item.title}
        </h3>

        <motion.div initial={false} animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
          <p className="font-body" style={{ fontSize: '13px', color: '#e5e7eb', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-body" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fff', fontWeight: 500 }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent)' }} /> Verified
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); playClickSound(); navigate(`/product/${item.id}`); }}
              style={{ cursor: 'pointer', background: 'var(--accent)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              ORDER NOW <ShoppingCart size={14} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{ position: 'absolute', inset: 0, border: `1px solid var(--accent)`, borderRadius: '16px', pointerEvents: 'none', zIndex: 20 }}
      />
    </motion.div>
  );
}
