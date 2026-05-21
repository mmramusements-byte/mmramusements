import { Link } from 'react-router-dom';
import { Package, Zap, Star, Activity, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProductStore } from '../store/useProductStore';
import { useDealStore } from '../store/useDealStore';
import { useReviewStore } from '../store/useReviewStore';
import StatCard from '../components/ui/StatCard';
import PageHeader from '../components/ui/PageHeader';
import { formatPrice, formatRelativeTime, truncate } from '../utils/formatters';

export default function AdminDashboard() {
  const products = useProductStore(state => state.products);
  const deals = useDealStore(state => state.deals);
  const reviews = useReviewStore(state => state.reviews);
  
  const featured = products.filter(p => p.featured && p.active);
  const activeDeals = deals.filter(d => d.active);
  const recentProducts = [...products].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentActivity = [...products].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  return (
    <div>
      <PageHeader 
        title={`Welcome back, Admin`} 
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      />

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <motion.div initial={{opacity:0, y:16}} animate={{opacity:1,y:0}} transition={{delay: 0.05}}>
          <StatCard title="Total Products" value={products.length} icon={<Package size={20} />} color="#6366f1" trend="+12%" />
        </motion.div>
        <motion.div initial={{opacity:0, y:16}} animate={{opacity:1,y:0}} transition={{delay: 0.1}}>
          <StatCard title="Active Deals" value={activeDeals.length} icon={<Zap size={20} />} color="#f59e0b" />
        </motion.div>
        <motion.div initial={{opacity:0, y:16}} animate={{opacity:1,y:0}} transition={{delay: 0.15}}>
          <StatCard title="Featured Items" value={featured.length} icon={<Star size={20} />} color="#a855f7" />
        </motion.div>
        <motion.div initial={{opacity:0, y:16}} animate={{opacity:1,y:0}} transition={{delay: 0.2}}>
          <StatCard title="Total Reviews" value={reviews.length} icon={<Activity size={20} />} color="#22c55e" trend="+4%" />
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Recent Products */}
        <motion.div initial={{opacity:0, y:16}} animate={{opacity:1,y:0}} transition={{delay: 0.25}} className="adm-card" style={{ padding: '0' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--adm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Recent Products</h3>
            <Link to="/admin/products" style={{ fontSize: '13px', color: 'var(--adm-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={p.image || '/fallback.png'} alt="" style={{ width:36, height:36, borderRadius:6, objectFit:'cover', background:'#1c1c1f' }} />
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '13px', color: 'var(--adm-text)' }}>{truncate(p.title, 30)}</div>
                          <div style={{ fontSize: '11px', color: 'var(--adm-muted)', marginTop: '2px' }}>{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--adm-success)', fontSize: '13px' }}>{formatPrice(p.price)}</td>
                    <td>
                      <span className={`adm-badge ${p.active ? 'adm-badge-success' : 'adm-badge-gray'}`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions & Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <motion.div initial={{opacity:0, y:16}} animate={{opacity:1,y:0}} transition={{delay: 0.3}} className="adm-card">
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/admin/products/add" className="adm-btn adm-btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Plus size={16} /> Add New Product
              </Link>
              <Link to="/admin/deals" className="adm-btn adm-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Zap size={16} /> Manage Deals
              </Link>
              <Link to="/admin/homepage" className="adm-btn adm-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Star size={16} /> Edit Homepage
              </Link>
              <a href="/" target="_blank" className="adm-btn adm-btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', border: '1px solid var(--adm-border)' }}>
                <ArrowRight size={16} /> View Storefront
              </a>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0, y:16}} animate={{opacity:1,y:0}} transition={{delay: 0.35}} className="adm-card">
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentActivity.map((activity, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--adm-accent)', marginTop: 6 }} />
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--adm-text)', lineHeight: 1.4 }}>
                      Product <span style={{ fontWeight: 500 }}>"{truncate(activity.title, 20)}"</span> was updated.
                    </p>
                    <p style={{ fontSize: '11.5px', color: 'var(--adm-muted)', marginTop: '4px' }}>
                      {formatRelativeTime(activity.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
