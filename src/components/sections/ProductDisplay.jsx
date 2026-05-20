import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShoppingCart, Zap, Star, BadgeCheck } from 'lucide-react';
import { products } from '../../data/products';
import { games } from '../../data/games';

function ProductCard({ product, game, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative rounded-2xl overflow-hidden"
      style={{ cursor: 'none' }}
    >
      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `linear-gradient(135deg, ${game.gradientFrom}50, ${game.gradientTo}30)`, padding: '1px' }}
      />

      <div
        className="relative h-full rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, var(--elevated), var(--panel))',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {product.popular && (
            <span
              className="font-game font-bold text-[10px] px-2 py-0.5 rounded-md"
              style={{ background: `${game.gradientFrom}30`, border: `1px solid ${game.gradientFrom}50`, color: game.accentColor }}
            >
              ⭐ POPULAR
            </span>
          )}
          {product.bestValue && (
            <span className="font-game font-bold text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400">
              🏆 BEST VALUE
            </span>
          )}
          {!product.popular && !product.bestValue && <span />}
        </div>

        {/* Card visual */}
        <div
          className="h-28 flex flex-col items-center justify-center relative overflow-hidden rounded-t-2xl"
          style={{ background: `linear-gradient(135deg, ${game.gradientFrom}20, ${game.gradientTo}35)` }}
        >
          {/* Animated BG glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(ellipse at 50% 60%, ${game.accentGlow}, transparent)` }}
          />
          <div className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-400">{game.icon}</div>
          <div
            className="font-mono font-bold text-xl"
            style={{ color: game.accentColor, filter: `drop-shadow(0 0 8px ${game.accentColor}80)` }}
          >
            {product.amount.toLocaleString()}
          </div>
          <div className="text-[var(--text-muted)] text-xs font-game">{game.currency}</div>
          {product.bonus > 0 && (
            <div
              className="absolute bottom-2 right-2 text-[10px] font-bold font-game px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e' }}
            >
              +{product.bonus} BONUS
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-4">
          <h4 className="font-display font-semibold text-sm text-white mb-0.5">{product.name}</h4>
          <p className="text-[var(--text-muted)] text-xs font-display mb-3">{game.name}</p>

          {/* Delivery badge */}
          <div className="flex items-center gap-1.5 mb-3 text-emerald-400 text-xs font-display">
            <Zap size={11} strokeWidth={3} />
            Instant Delivery
          </div>

          {/* Price + CTA */}
          <div className="flex items-center gap-2">
            <div>
              <span className="font-mono font-bold text-lg text-white">${product.price}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg font-display font-semibold text-xs text-white transition-all"
              style={{
                cursor: 'none',
                background: `linear-gradient(135deg, ${game.gradientFrom}, ${game.gradientTo})`,
                boxShadow: `0 3px 15px ${game.accentColor}40`,
              }}
            >
              <ShoppingCart size={11} />
              Buy
            </motion.button>
          </div>
        </div>

        {/* Bottom glow line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${game.gradientFrom}, ${game.gradientTo}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

export default function ProductDisplay() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Show products for first 4 games
  const displayProducts = products.filter(p =>
    ['free-fire', 'pubg', 'valorant', 'mobile-legends'].includes(p.gameId)
  );

  const gameMap = Object.fromEntries(games.map(g => [g.id, g]));

  return (
    <section id="products" className="relative py-24" style={{ background: 'var(--void)' }}>
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 60% 40%, rgba(124,58,237,0.1) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(0,212,255,0.05) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-game tracking-widest text-xs uppercase text-[var(--accent)] mb-3"
          >
            ── Top-Up Packages ──
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] text-white mb-4"
          >
            Premium{' '}
            <span className="gradient-text">Currency Packs</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[var(--text-secondary)] font-display max-w-xl mx-auto"
          >
            Choose from hundreds of top-up options across 50+ games. Best prices, instant delivery, zero hassle.
          </motion.p>
        </div>

        {/* Feature chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {[
            { icon: <Zap size={13} />, text: 'Instant Delivery' },
            { icon: <BadgeCheck size={13} />, text: 'Verified & Secure' },
            { icon: <Star size={13} />, text: 'Best Prices' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 glass border border-white/8 rounded-full px-4 py-1.5 text-xs font-display text-[var(--text-secondary)]">
              <span className="text-[var(--accent)]">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayProducts.map((product, i) => {
            const game = gameMap[product.gameId];
            if (!game) return null;
            return <ProductCard key={product.id} product={product} game={game} index={i} />;
          })}
        </div>

        {/* Load more */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-ghost px-10 py-3.5 text-sm"
            style={{ cursor: 'none' }}
          >
            Load More Packages
            <ShoppingCart size={14} />
          </motion.button>
        </motion.div>
      </div>

      <div className="section-divider mt-24" />
    </section>
  );
}
