import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, ChevronRight, Star, Shield, Truck, Award, Zap,
  Tag, Package, Clock, Users, Wrench, ArrowLeft, Share2, Heart,
  CheckCircle, Info, BarChart2
} from 'lucide-react';
import { useProductStore } from '../admin/store/useProductStore';
import { playHoverSound, playClickSound, playSuccessSound } from '../utils/audio';
import InquiryModal from '../components/common/InquiryModal';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';

// Skeleton shimmer component
function Skeleton({ width = '100%', height = '20px', borderRadius = '8px' }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
  );
}

// Compact related product card
function RelatedCard({ item, navigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(239,68,68,0.15)' }}
      onMouseEnter={() => { setHovered(true); playHoverSound(); }}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { playClickSound(); navigate(`/product/${item.id}`); }}
      style={{
        cursor: 'pointer', borderRadius: '12px', overflow: 'hidden',
        border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        background: 'var(--card)', transition: 'border-color 0.3s'
      }}
    >
      <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
        <motion.img
          src={item.image_url}
          alt={item.title}
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
        <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.85)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
          ${item.price}
        </span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{item.brand || item.condition}</p>
        <h4 style={{ fontSize: '1rem', color: '#fff', fontFamily: "'Bebas Neue',sans-serif", lineHeight: 1.2 }}>{item.title}</h4>
      </div>
    </motion.div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const products = useProductStore(state => state.products);
  const isLoading = useProductStore(state => state.isLoading);
  const addItem = useCartStore(state => state.addItem);

  const product = useMemo(() => products.find(p => String(p.id) === String(id)), [products, id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => String(p.id) !== String(id) && p.active && (
        (p.subcategory && p.subcategory === product.subcategory) ||
        (p.category === product.category)
      ))
      .slice(0, 4);
  }, [products, id, product]);

  // All images (primary + any extras if product had multiple — stored as image_url for now)
  const images = product ? [product.image_url].filter(Boolean) : [];

  const handleAddToCart = () => {
    if (!product) return;
    playSuccessSound();
    for (let i = 0; i < quantity; i++) addItem(product);
    toast.success(`${quantity}x ${product.title} added to cart`, {
      style: { background: '#1a1a1a', color: '#fff', border: '1px solid var(--accent)' },
      iconTheme: { primary: 'var(--accent)', secondary: '#000' },
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!', { style: { background: '#1a1a1a', color: '#fff', border: '1px solid var(--accent)' } });
  };

  // Redirect to home if product not found (after initial load)
  useEffect(() => {
    if (!isLoading && products.length > 0 && !product) {
      navigate('/gaming-carts');
    }
  }, [product, isLoading, products, navigate]);

  // Loading skeleton
  if (isLoading || !product) {
    return (
      <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
        <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
        <div className="mmr-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
            <Skeleton height="520px" borderRadius="20px" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '20px' }}>
              <Skeleton height="14px" width="200px" />
              <Skeleton height="60px" />
              <Skeleton height="40px" width="140px" />
              <Skeleton height="16px" />
              <Skeleton height="16px" width="80%" />
              <Skeleton height="16px" width="60%" />
              <Skeleton height="60px" borderRadius="12px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const features = Array.isArray(product.features) ? product.features : [];
  const tags = Array.isArray(product.tags) ? product.tags : [];

  const badges = [
    product.best_seller && { label: 'Best Seller', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    product.new_arrival && { label: 'New Arrival', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    product.clearance && { label: 'Clearance', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
    product.trending && { label: 'Trending', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  ].filter(Boolean);

  const specs = [
    { icon: <Package size={16} />, label: 'Condition', value: product.condition },
    { icon: <Clock size={16} />, label: 'Warranty', value: product.warranty || 'Contact for details' },
    { icon: <BarChart2 size={16} />, label: 'Yield Category', value: product.yield || 'Standard' },
    { icon: <Users size={16} />, label: 'Players', value: product.players ? `${product.players} Player${product.players > 1 ? 's' : ''}` : 'N/A' },
    { icon: <Wrench size={16} />, label: 'Brand', value: product.brand || 'Generic' },
    { icon: <Tag size={16} />, label: 'Stock', value: product.stock || 'In Stock' },
  ];

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingBottom: '100px' }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @media (max-width: 1024px) { .pdp-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .pdp-related-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .pdp-related-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Hero Image Banner */}
      <div style={{ position: 'relative', height: '45vh', minHeight: '320px', overflow: 'hidden' }}>
        <motion.img
          key={images[activeImage]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src={images[activeImage] || '/placeholder.png'}
          alt={product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 60%, var(--black) 100%)' }} />

        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: '100px', left: 0, right: 0 }} className="mmr-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={12} />
            {product.category && (
              <>
                <Link to={`/categories/${product.category}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{product.category.replace(/-/g, ' ')}</Link>
                <ChevronRight size={12} />
              </>
            )}
            <span style={{ color: 'var(--accent)' }}>{product.title}</span>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ position: 'absolute', top: '100px', right: 0 }} className="mmr-container">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => navigate(-1)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backdropFilter: 'blur(10px)', fontFamily: 'Inter, sans-serif' }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mmr-container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '60px', alignItems: 'start' }} className="pdp-grid">

          {/* LEFT — Image Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', aspectRatio: '4/3', background: 'var(--card)' }}
            >
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src={images[activeImage] || '/placeholder.png'}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Badges overlay */}
              {badges.length > 0 && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {badges.map(b => (
                    <span key={b.label} style={{ background: b.bg, color: b.color, border: `1px solid ${b.color}40`, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {b.label}
                    </span>
                  ))}
                </div>
              )}
              {/* Price badge */}
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.9)', border: '1px solid var(--accent)', borderRadius: '8px', padding: '6px 14px' }}>
                <span style={{ fontSize: '1.4rem', fontFamily: "'Bebas Neue',sans-serif", color: 'var(--accent)', letterSpacing: '0.05em' }}>${product.price}</span>
                {product.discount_price && (
                  <span style={{ fontSize: '0.9rem', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: '8px' }}>${product.discount_price}</span>
                )}
              </div>
            </motion.div>

            {/* Trust Badges Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}
            >
              {[
                { icon: <Shield size={18} />, label: 'Verified Product' },
                { icon: <Truck size={18} />, label: 'Fast Shipping' },
                { icon: <Award size={18} />, label: 'Expert Support' },
              ].map(({ icon, label }) => (
                <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent)' }}>{icon}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif', lineHeight: 1.3 }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ paddingTop: '20px' }}
          >
            {/* Category & Brand label */}
            <p style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {product.brand && <><span>{product.brand}</span><span style={{ color: 'var(--border)' }}>•</span></>}
              <span>{product.condition}</span>
            </p>

            {/* Product Title */}
            <h1 className="font-display" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', color: '#fff', lineHeight: 1.0, marginBottom: '20px' }}>
              {product.title}
            </h1>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '2.2rem', fontFamily: "'Bebas Neue',sans-serif", color: 'var(--accent)', letterSpacing: '0.05em' }}>
                ${product.price}
              </span>
              {product.discount_price && (
                <span style={{ fontSize: '1.2rem', color: 'var(--muted)', textDecoration: 'line-through' }}>
                  ${product.discount_price}
                </span>
              )}
              <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                {product.stock || 'In Stock'}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '24px' }} />

            {/* Description */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>Description</h3>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.75, fontFamily: 'Inter, sans-serif' }}>
                {product.description || 'Contact us for detailed product specifications and availability.'}
              </p>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '14px' }}>Features</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {features.map((feat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
                    >
                      <CheckCircle size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{feat}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Qty Selector */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ background: 'var(--surface)', border: 'none', color: '#fff', width: '40px', height: '48px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>−</button>
                  <span style={{ width: '48px', textAlign: 'center', color: '#fff', fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.3rem' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} style={{ background: 'var(--surface)', border: 'none', color: '#fff', width: '40px', height: '48px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>+</button>
                </div>

                {/* Order Now */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { playSuccessSound(); setIsInquiryOpen(true); }}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '12px', padding: '16px 28px', fontSize: '15px', fontWeight: 800, fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
                >
                  <ShoppingCart size={18} /> Order Now
                </motion.button>

                {/* Share */}
                <motion.button
                  whileHover={{ scale: 1.08, background: 'rgba(255,255,255,0.1)' }}
                  onClick={handleShare}
                  style={{ width: '48px', height: '48px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                >
                  <Share2 size={16} />
                </motion.button>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)', margin: '24px 0' }} />

            {/* Specs Grid */}
            <div>
              <h3 style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>Specifications</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {specs.map(({ icon, label, value }) => value && (
                  <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>{icon}</span>
                    <div>
                      <p style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Oswald',sans-serif", marginBottom: '3px' }}>{label}</p>
                      <p style={{ fontSize: '13px', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>Tags</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {tags.map((tag, i) => (
                    <span key={i} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--accent)', border: '1px solid rgba(239,68,68,0.25)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginTop: '80px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>More Like This</p>
                <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff' }}>Related <span style={{ color: 'var(--accent)' }}>Products</span></h2>
              </div>
              <Link to="/gaming-carts" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '13px', fontFamily: "'Oswald',sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(239,68,68,0.3)', padding: '8px 18px', borderRadius: '8px', transition: 'all 0.2s' }}>
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="pdp-related-grid">
              {relatedProducts.map(item => (
                <RelatedCard key={item.id} item={item} navigate={navigate} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <InquiryModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} item={product} />
    </div>
  );
}
