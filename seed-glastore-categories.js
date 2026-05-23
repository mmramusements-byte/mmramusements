import { pool } from './server/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const seedCategories = async () => {
  const rootCategories = [
    { name: 'Game Boards', slug: 'game-boards' },
    { name: 'Game Systems', slug: 'game-systems' },
    { name: 'Cabinets & Hardware', slug: 'cabinets-hardware' },
    { name: 'Parts & Supplies', slug: 'parts-supplies' }
  ];

  const subCategories = {
    'Game Boards': [
      'Amcoe Game Boards', 'Astro Game Boards', 'Banilla Game Boards', 'Big Daddy Game Boards',
      'Black Clover Game Boards', 'Borden Game Boards', 'Dyna Game Boards', 'IGS Game Boards',
      'Jenka Lab Game Boards', 'Master Panda Game Boards', 'Ocean King Game Boards', 'Pal Game Boards',
      'Primero Game Boards', 'Subsino Game Boards', 'Trestle Game Boards', 'Zydexo Game Boards', 'Other Game Boards'
    ],
    'Game Systems': [
      'Preview / No Chance Games', 'Arcade Games', 'Coin Quarter Pushers', 'Mobile Game Kiosk',
      'Progressive Linking Systems', 'Multi-Game Systems', 'Fish Games', 'Nudge / Skill Games',
      'Redemption Kiosk', 'Sweepstakes Solutions'
    ],
    'Cabinets & Hardware': [
      'Board Ready Cabinets', 'Gaming Cabinets', 'Fish Table Cabinets', 'Upright Cabinets',
      'Countertop Cabinets', 'Touchscreen Cabinets', 'Gaming Stools', 'Arcade Furniture',
      'Coin Doors', 'Hardware Accessories'
    ],
    'Parts & Supplies': [
      'Bill Acceptors & Accessories', 'Printers & Ticket Dispensers', 'LCD Monitors',
      'Power Supplies', 'Harnesses', 'Pushbuttons', 'Card Reader Solutions',
      'Cabinet Parts & Supplies', 'WMS & IGT Parts', 'Wiring Kits', 'Replacement Components'
    ]
  };

  const toSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    // Clear existing categories
    await pool.query('TRUNCATE TABLE categories RESTART IDENTITY CASCADE');

    for (const [index, root] of rootCategories.entries()) {
      const res = await pool.query(
        `INSERT INTO categories (name, slug, order_index, parent_id) 
         VALUES ($1, $2, $3, NULL) 
         RETURNING id`,
        [root.name, root.slug, index]
      );
      
      const parentId = res.rows[0].id;
      
      if (subCategories[root.name]) {
        for (const [subIndex, subName] of subCategories[root.name].entries()) {
          await pool.query(
            `INSERT INTO categories (name, slug, order_index, parent_id) 
             VALUES ($1, $2, $3, $4)`,
            [subName, toSlug(subName), subIndex, parentId]
          );
        }
      }
    }
    console.log('Categories seeded successfully with multi-level structure.');
  } catch (err) {
    console.error('Error seeding categories:', err);
  } finally {
    process.exit(0);
  }
};

seedCategories();
