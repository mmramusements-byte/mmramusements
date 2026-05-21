import { Search, Bell, Menu, ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

/**
 * Converts a URL segment to a readable title.
 * e.g. "add-product" → "Add Product", "products" → "Products"
 */
function segmentToTitle(segment) {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Builds breadcrumb parts from pathname.
 * /admin/products/add → [{ label: 'Admin', to: '/admin' }, { label: 'Products', to: '/admin/products' }, { label: 'Add', to: null }]
 */
function buildBreadcrumbs(pathname) {
  const parts = pathname.split('/').filter(Boolean); // remove empty strings
  const crumbs = [];

  // Always start with Admin
  crumbs.push({ label: 'Admin', to: '/admin/dashboard' });

  let accumulated = '';
  parts.forEach((part, idx) => {
    if (part === 'admin') return; // skip 'admin' prefix, already added
    accumulated += `/${part}`;
    const isLast = idx === parts.length - 1;
    crumbs.push({
      label: segmentToTitle(part),
      to: isLast ? null : `/admin${accumulated}`,
    });
  });

  return crumbs;
}

export default function AdminHeader({ onMobileMenuToggle }) {
  const location = useLocation();
  const breadcrumbs = buildBreadcrumbs(location.pathname);

  return (
    <header className="adm-header">
      {/* ── Mobile hamburger ── */}
      <button
        onClick={onMobileMenuToggle}
        aria-label="Toggle menu"
        style={{
          display: 'none', // shown via media query workaround using inline style below
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.07)',
          color: 'rgba(241,241,243,0.7)',
          flexShrink: 0,
        }}
        className="adm-mobile-menu-btn"
      >
        <Menu size={18} />
      </button>

      {/* ── Breadcrumb ── */}
      <nav className="adm-breadcrumb" style={{ flex: 'none' }}>
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <span
              key={idx}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {idx > 0 && (
                <ChevronRight
                  size={13}
                  className="adm-breadcrumb-sep"
                  style={{ opacity: 0.3 }}
                />
              )}
              {crumb.to && !isLast ? (
                <Link
                  to={crumb.to}
                  style={{
                    color: 'rgba(241,241,243,0.45)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f1f1f3')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(241,241,243,0.45)')
                  }
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'adm-breadcrumb-current' : ''}
                  style={
                    isLast
                      ? { color: '#f1f1f3', fontWeight: 500, fontSize: '13px' }
                      : { color: 'rgba(241,241,243,0.45)', fontSize: '13px' }
                  }
                >
                  {crumb.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Search bar ── */}
      <div className="adm-search-wrap" style={{ flexShrink: 0 }}>
        <Search size={15} />
        <input
          type="text"
          placeholder="Search…"
          className="adm-input adm-search-input"
          style={{ width: '240px', padding: '7px 14px 7px 38px', fontSize: '13px' }}
          readOnly
        />
      </div>

      {/* ── Bell notification ── */}
      <button
        aria-label="Notifications"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          color: 'rgba(241,241,243,0.7)',
          flexShrink: 0,
          transition: 'all 0.18s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = '#f1f1f3';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.color = 'rgba(241,241,243,0.7)';
        }}
      >
        <Bell size={17} />
        {/* Red dot indicator */}
        <span
          style={{
            position: 'absolute',
            top: '7px',
            right: '7px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#ef4444',
            border: '1.5px solid #161618',
          }}
        />
      </button>

      {/* ── Admin Avatar ── */}
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: '#6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '14px',
          color: '#fff',
          flexShrink: 0,
          border: '2px solid rgba(99,102,241,0.4)',
          letterSpacing: '-0.3px',
        }}
        title="Admin"
      >
        A
      </div>

      {/* Inline style to show mobile button on small screens */}
      <style>{`
        @media (max-width: 1024px) {
          .adm-mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
