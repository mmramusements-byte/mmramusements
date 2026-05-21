import { motion } from 'framer-motion';

/**
 * StatCard — A premium metric card for the dashboard.
 *
 * Props:
 *  - title (string): Metric label
 *  - value (string|number): Main metric value
 *  - icon (ReactNode): Lucide icon element
 *  - color (string): Accent color hex for the icon background & value tint
 *  - delta (string): Optional change indicator, e.g. "+12%"
 *  - deltaPositive (bool): Green if true, red if false
 *  - delay (number): Framer motion entrance delay
 */
export default function StatCard({
  title,
  value,
  icon,
  color = '#6366f1',
  delta,
  deltaPositive = true,
  delay = 0,
}) {
  const bg = `${color}18`;

  return (
    <motion.div
      className="adm-stat-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        {/* Icon */}
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        {/* Delta badge */}
        {delta && (
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '99px',
              background: deltaPositive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: deltaPositive ? '#22c55e' : '#ef4444',
            }}
          >
            {delta}
          </span>
        )}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#f1f1f3',
          lineHeight: 1,
          marginBottom: '6px',
          letterSpacing: '-0.5px',
        }}
      >
        {value}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: '13px',
          color: 'rgba(241,241,243,0.5)',
          fontWeight: 500,
        }}
      >
        {title}
      </div>
    </motion.div>
  );
}
