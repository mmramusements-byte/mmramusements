import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  onConfirm,
  onCancel,
  dangerous = true,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="confirm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(4px)',
              zIndex: 1100,
            }}
          />

          {/* Dialog */}
          <motion.div
            key="confirm-dialog"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              zIndex: 1101,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                background: '#1c1c1f',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '420px',
                padding: '28px 28px 24px',
                pointerEvents: 'all',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: dangerous
                    ? 'rgba(239,68,68,0.12)'
                    : 'rgba(245,158,11,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                <AlertTriangle
                  size={22}
                  color={dangerous ? '#ef4444' : '#f59e0b'}
                />
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#f1f1f3',
                  marginBottom: '8px',
                  lineHeight: 1.3,
                }}
              >
                {title}
              </h2>

              {/* Message */}
              {message && (
                <p
                  style={{
                    fontSize: '13.5px',
                    color: 'rgba(241,241,243,0.55)',
                    lineHeight: 1.55,
                    marginBottom: '24px',
                  }}
                >
                  {message}
                </p>
              )}

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-end',
                  marginTop: message ? 0 : '24px',
                }}
              >
                <button
                  onClick={onCancel}
                  className="adm-btn adm-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className={`adm-btn ${dangerous ? 'adm-btn-danger' : 'adm-btn-primary'}`}
                  style={
                    dangerous
                      ? {
                          background: 'rgba(239,68,68,0.15)',
                          color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.25)',
                        }
                      : {}
                  }
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
