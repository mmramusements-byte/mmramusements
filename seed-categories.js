import { pool } from './server/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const seedCategories = async () => {
  const categories = [
    { name: 'Arcade Games', slug: 'arcade-games', description: 'Classic and modern arcade games' },
    { name: 'Game Boards', slug: 'game-boards', description: 'Premium PC boards and skill game boards' },
    { name: 'Fish Games', slug: 'fish-games', description: 'Multiplayer fish table games' },
    { name: 'Coin Pushers', slug: 'coin-pushers', description: 'Quarter pushers and coin pushers' },
    { name: 'Skill Games', slug: 'skill-games', description: 'Nudge and skill-based games' },
    { name: 'Multi-Game Systems', slug: 'multi-game-systems', description: 'Multi-game selector systems' },
    { name: 'Redemption Kiosks', slug: 'redemption-kiosks', description: 'Ticket redemption and point kiosks' },
    { name: 'Board Ready Cabinets', slug: 'board-ready-cabinets', description: 'Empty cabinets ready for boards' },
    { name: 'Mobile Kiosks', slug: 'mobile-kiosks', description: 'Portable mobile gaming kiosks' },
    { name: 'Cabinets', slug: 'cabinets', description: 'Upright and countertop cabinets' },
    { name: 'Parts & Supplies', slug: 'parts-supplies', description: 'Replacement parts, validators, monitors, and more' },
  ];

  try {
    for (const [index, cat] of categories.entries()) {
      await pool.query(
        `INSERT INTO categories (name, slug, description, order_index) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (slug) DO NOTHING`,
        [cat.name, cat.slug, cat.description, index]
      );
    }
    console.log('Categories seeded successfully');
  } catch (err) {
    console.error('Error seeding categories:', err);
  } finally {
    process.exit(0);
  }
};

seedCategories();
