import { create } from 'zustand';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ── Store ────────────────────────────────────────────────────────────────────
const useToastStore = create((set) => ({
  toasts: [],
  add: (toast) =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { id: Date.now() + Math.random(), ...toast },
      ],
    })),
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// ── Icons per type ────────────────────────────────────────────────────────────
const ICONS = {
  success: <CheckCircle size={17} color="#22c55e" />,
  error:   <XCircle    size={17} color="#ef4444" />,
  warning: <AlertTriangle size={17} color="#f59e0b" />,
  info:    <Info       size={17} color="#3b82f6" />,
};

// ── Single Toast ─────────────────────────────────────────────────────────────
function Toast({ toast }) {
  const remove = useToastStore((s) => s.remove);

  useEffect(() => {
    const t = setTimeout(() => remove(toast.id), toast.duration ?? 3500);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, remove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`adm-toast adm-toast-${toast.type}`}
    >
      <div style={{ flexShrink: 0, marginTop: '1px' }}>{ICONS[toast.type]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div style={{ fontWeight: 600, fontSize: '13px', color: '#f1f1f3', marginBottom: '2px' }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: '13px', color: 'rgba(241,241,243,0.7)', lineHeight: 1.4 }}>
          {toast.message}
        </div>
      </div>
      <button
        type="button"
        onClick={() => remove(toast.id)}
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          color: 'rgba(241,241,243,0.35)',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(241,241,243,0.8)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(241,241,243,0.35)')}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ── Container (mount once in AdminLayout or App root) ─────────────────────────
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return createPortal(
    <div className="adm-toast-container">
      <AnimatePresence mode="sync">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

// ── Hook (call anywhere inside admin) ─────────────────────────────────────────
export function useToast() {
  const add = useToastStore((s) => s.add);

  return {
    success: (message, title, opts) => add({ type: 'success', message, title, ...opts }),
    error:   (message, title, opts) => add({ type: 'error',   message, title, ...opts }),
    warning: (message, title, opts) => add({ type: 'warning', message, title, ...opts }),
    info:    (message, title, opts) => add({ type: 'info',    message, title, ...opts }),
  };
}
