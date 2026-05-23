const { pool } = require('../server/config/db.js');

async function seedDummyData() {
  try {
    console.log('Fetching categories...');
    const result = await pool.query(`
      SELECT c1.id, c1.name as sub_name, c1.slug as sub_slug, 
             c2.name as parent_name, c2.slug as parent_slug
      FROM categories c1
      JOIN categories c2 ON c1.parent_id = c2.id
    `);

    const categories = result.rows;
    console.log(`Found ${categories.length} subcategories.`);

    // Clear old dummy products
    await pool.query(`DELETE FROM products WHERE title LIKE 'Dummy Product %'`);

    for (const cat of categories) {
      const title = 'Dummy Product - ' + cat.sub_name;
      
      await pool.query(
        `INSERT INTO products (
          title, price, category, subcategory, condition, 
          description, active, stock, image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          title,
          Math.floor(Math.random() * 1000) + 100, // random price
          cat.parent_slug, // Main Category
          cat.sub_slug,    // Subcategory
          'Brand New',
          'This is a dummy product automatically generated for end-to-end testing of the ' + cat.sub_name + ' sub-option.',
          true,
          'In Stock',
          'https://res.cloudinary.com/dlzkrqkgo/image/upload/v1779435168/mmr_amusements/h69bgxxxltxgjexm2a56.webp'
        ]
      );
    }
    
    console.log('Successfully inserted dummy data for all sub-options!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding dummy data:', error);
    process.exit(1);
  }
}

seedDummyData();
