import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const SIZE_MAP = {
  sm: 'adm-modal-sm',
  md: 'adm-modal-md',
  lg: 'adm-modal-lg',
  xl: 'adm-modal-xl',
};

export default function AdminModal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
}) {
  const sizeClass = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="adm-modal-backdrop"
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            {/* ── Modal panel ── */}
            <motion.div
              key="modal-panel"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={`adm-modal ${sizeClass}`}
            >
              {/* Header */}
              <div className="adm-modal-header">
                <h2
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#f1f1f3',
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    borderRadius: '7px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(241,241,243,0.6)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                    e.currentTarget.style.color = '#f1f1f3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = 'rgba(241,241,243,0.6)';
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="adm-modal-body">{children}</div>

              {/* Footer */}
              {footer && <div className="adm-modal-footer">{footer}</div>}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
