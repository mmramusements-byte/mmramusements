import { motion } from 'framer-motion';

/**
 * PageHeader
 *
 * Props:
 *  - title (string): Main page heading
 *  - subtitle (string): Optional secondary line
 *  - actions (ReactNode): Optional right-side slot for buttons / controls
 */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <motion.div
      className="adm-page-header"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="adm-page-title">{title}</h1>
        {subtitle && (
          <p className="adm-page-subtitle">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </motion.div>
  );
}
