const { pool } = require('../server/config/db.js');

async function test() {
  try {
    // Reproduce exactly what getCategoryBySlug does
    console.log('Testing game-systems...');
    const r1 = await pool.query('SELECT * FROM categories WHERE slug = $1', ['game-systems']);
    console.log('game-systems result:', r1.rows);
    
    console.log('\nTesting game-boards...');
    const r2 = await pool.query('SELECT * FROM categories WHERE slug = $1', ['game-boards']);
    console.log('game-boards result:', r2.rows);

    console.log('\nTesting arcade-games (subcategory)...');
    const r3 = await pool.query('SELECT * FROM categories WHERE slug = $1', ['arcade-games']);
    console.log('arcade-games result:', r3.rows);

    process.exit(0);
  } catch(e) {
    console.error('DB ERROR:', e.message, e.code);
    process.exit(1);
  }
}
test();
