import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Tag,
  Zap,
  Star,
  Image,
  Home,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Share2,
  Briefcase,
  MessageSquare,
} from 'lucide-react';

const navItems = [
  {
    section: 'OVERVIEW',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
    ],
  },
  {
    section: 'CATALOG',
    items: [
      { icon: Package, label: 'Products', to: '/admin/products' },
      { icon: Tag, label: 'Categories', to: '/admin/categories' },
      { icon: Zap, label: 'Deals', to: '/admin/deals' },
    ],
  },
  {
    section: 'CONTENT',
    items: [
      { icon: Star, label: 'Reviews', to: '/admin/reviews' },
      { icon: Image, label: 'Banners', to: '/admin/banners' },
      { icon: Home, label: 'Homepage', to: '/admin/homepage' },
    ],
  },
  {
    section: 'CRM',
    items: [
      { icon: MessageSquare, label: 'Customer Queries', to: '/admin/queries' },
      { icon: Briefcase, label: 'Careers', to: '/admin/careers' },
    ],
  },
  {
    section: 'SYSTEM',
    items: [
      { icon: Settings, label: 'Settings', to: '/admin/settings' },
      { icon: Share2, label: 'Socials', to: '/admin/settings/socials' },
    ],
  },
];

export default function AdminSidebar({ collapsed, onCollapse }) {
  return (
    <aside className={`adm-sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* ── Logo Area ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '18px 16px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          overflow: 'hidden',
          minHeight: '60px',
        }}
      >
        {/* Logo */}
        <img
          src="/Logo_NoBackground.png"
          alt="MMR"
          style={{
            width: '32px',
            height: '32px',
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="logo-text"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '14.5px',
                  color: '#f1f1f3',
                  letterSpacing: '-0.3px',
                }}
              >
                MMR Admin
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav ── */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px 8px',
        }}
      >
        {navItems.map((group) => (
          <div key={group.section}>
            {/* Section label — hidden when collapsed */}
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  key={`section-${group.section}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="adm-nav-section"
                >
                  {group.section}
                </motion.div>
              )}
            </AnimatePresence>

            {/* When collapsed, add spacer */}
            {collapsed && <div style={{ height: '8px' }} />}

            {group.items.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `adm-nav-link${isActive ? ' active' : ''}`
                }
                style={
                  collapsed
                    ? { justifyContent: 'center', padding: '9px 0' }
                    : undefined
                }
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key={`label-${to}`}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Bottom: View Storefront + Collapse Toggle ── */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '8px 8px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        {/* View Storefront */}
        <Link
          to="/"
          title={collapsed ? 'View Storefront' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: collapsed ? '9px 0' : '9px 16px',
            justifyContent: collapsed ? 'center' : undefined,
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: 500,
            color: 'rgba(241,241,243,0.45)',
            textDecoration: 'none',
            transition: 'all 0.18s',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.color = '#f1f1f3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '';
            e.currentTarget.style.color = 'rgba(241,241,243,0.45)';
          }}
        >
          <ExternalLink size={17} style={{ flexShrink: 0 }} />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                View Storefront
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Collapse Toggle */}
        <button
          onClick={onCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: collapsed ? '9px 0' : '9px 16px',
            justifyContent: collapsed ? 'center' : undefined,
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: 500,
            color: 'rgba(241,241,243,0.45)',
            background: 'none',
            border: 'none',
            width: '100%',
            transition: 'all 0.18s',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.color = '#f1f1f3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '';
            e.currentTarget.style.color = 'rgba(241,241,243,0.45)';
          }}
        >
          {collapsed ? (
            <ChevronRight size={17} style={{ flexShrink: 0 }} />
          ) : (
            <>
              <ChevronLeft size={17} style={{ flexShrink: 0 }} />
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                Collapse
              </motion.span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
