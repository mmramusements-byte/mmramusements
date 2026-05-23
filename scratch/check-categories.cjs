const { pool } = require('../server/config/db.js');

async function check() {
  try {
    const r1 = await pool.query("SELECT id, name, slug, parent_id FROM categories WHERE slug = 'game-systems'");
    console.log('game-systems:', r1.rows);

    // Also check what slugs exist for the gaming systems main category
    const r2 = await pool.query("SELECT id, name, slug, parent_id FROM categories WHERE parent_id IS NULL ORDER BY id");
    console.log('Top-level categories:', r2.rows);

    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
check();
