import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAdminUIStore } from '../../store/useAdminUIStore';

const TOAST_ICONS = {
  success: { Icon: CheckCircle, color: '#22c55e' },
  error: { Icon: XCircle, color: '#ef4444' },
  warning: { Icon: AlertTriangle, color: '#f59e0b' },
  info: { Icon: Info, color: '#3b82f6' },
};

function ToastItem({ toast }) {
  const removeToast = useAdminUIStore((s) => s.removeToast);
  const { Icon, color } = TOAST_ICONS[toast.type] ?? TOAST_ICONS.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.94 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={`adm-toast adm-toast-${toast.type}`}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0, marginTop: '1px' }}>
        <Icon size={18} color={color} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div
            style={{
              fontWeight: 600,
              fontSize: '13.5px',
              color: '#f1f1f3',
              marginBottom: toast.message ? '3px' : 0,
              lineHeight: 1.3,
            }}
          >
            {toast.title}
          </div>
        )}
        {toast.message && (
          <div
            style={{
              fontSize: '12.5px',
              color: 'rgba(241,241,243,0.65)',
              lineHeight: 1.45,
            }}
          >
            {toast.message}
          </div>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss"
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '22px',
          height: '22px',
          borderRadius: '6px',
          background: 'transparent',
          border: 'none',
          color: 'rgba(241,241,243,0.4)',
          transition: 'all 0.15s',
          marginTop: '-1px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = '#f1f1f3';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'rgba(241,241,243,0.4)';
        }}
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

export default function AdminToast() {
  const toasts = useAdminUIStore((s) => s.toasts);

  return (
    <div className="adm-toast-container">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
