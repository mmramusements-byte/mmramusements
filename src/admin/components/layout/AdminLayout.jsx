import '../../admin.css';
import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminToast from '../ui/AdminToast';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useAdminUIStore } from '../../store/useAdminUIStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    confirmDialog,
    handleConfirmAction,
    handleCancelAction,
  } = useAdminUIStore();

  const handleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);
  const handleMobileMenuToggle = () => setMobileSidebarOpen(!mobileSidebarOpen);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-root">
      <div className="adm-layout">
        {/* ── Mobile backdrop ── */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(2px)',
              zIndex: 190,
            }}
          />
        )}

        {/* ── Sidebar ── */}
        <div className={mobileSidebarOpen ? 'adm-sidebar mobile-open' : ''}>
          <AdminSidebar
            collapsed={sidebarCollapsed}
            onCollapse={handleCollapse}
          />
        </div>

        {/* ── Main area ── */}
        <div className="adm-main">
          <AdminHeader onMobileMenuToggle={handleMobileMenuToggle} />

          <main className="adm-content">
            <Outlet />
          </main>
        </div>
      </div>

      {/* ── Global UI Overlays ── */}
      <AdminToast />
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        dangerous={confirmDialog.dangerous}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
}
