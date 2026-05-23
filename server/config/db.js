import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Automatic table creation
export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create otp_codes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS otp_codes (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        attempts INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure attempts column exists if table was already created in a previous iteration
    await client.query(`ALTER TABLE otp_codes ADD COLUMN IF NOT EXISTS attempts INT DEFAULT 0;`);

    // Create homepage_settings table (only one row is ever used)
    await client.query(`
      CREATE TABLE IF NOT EXISTS homepage_settings (
        id SERIAL PRIMARY KEY,
        hero_visible BOOLEAN DEFAULT true,
        featured_visible BOOLEAN DEFAULT true,
        trending_visible BOOLEAN DEFAULT true,
        deals_visible BOOLEAN DEFAULT true,
        reviews_visible BOOLEAN DEFAULT true,
        best_sellers_visible BOOLEAN DEFAULT true,
        new_arrivals_visible BOOLEAN DEFAULT true,
        popular_visible BOOLEAN DEFAULT true,
        recommended_visible BOOLEAN DEFAULT true,
        logo_url TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure all visibility columns exist if the table was already created
    await client.query(`ALTER TABLE homepage_settings ADD COLUMN IF NOT EXISTS best_sellers_visible BOOLEAN DEFAULT true;`);
    await client.query(`ALTER TABLE homepage_settings ADD COLUMN IF NOT EXISTS new_arrivals_visible BOOLEAN DEFAULT true;`);
    await client.query(`ALTER TABLE homepage_settings ADD COLUMN IF NOT EXISTS popular_visible BOOLEAN DEFAULT true;`);
    await client.query(`ALTER TABLE homepage_settings ADD COLUMN IF NOT EXISTS recommended_visible BOOLEAN DEFAULT true;`);
    await client.query(`ALTER TABLE homepage_settings ADD COLUMN IF NOT EXISTS logo_url TEXT;`);

    // Seed the homepage_settings if it doesn't exist
    const settingsCheck = await client.query('SELECT COUNT(*) FROM homepage_settings');
    if (parseInt(settingsCheck.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO homepage_settings (hero_visible, featured_visible, trending_visible, deals_visible, reviews_visible, best_sellers_visible, new_arrivals_visible, popular_visible, recommended_visible) 
        VALUES (true, true, true, true, true, true, true, true, true)
      `);
    }

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price NUMERIC NOT NULL,
        discount_price NUMERIC,
        category VARCHAR(255) NOT NULL,
        condition VARCHAR(255) NOT NULL,
        players INT DEFAULT 0,
        yield VARCHAR(255),
        warranty VARCHAR(255),
        description TEXT,
        image_url TEXT,
        tags JSONB DEFAULT '[]'::jsonb,
        features JSONB DEFAULT '[]'::jsonb,
        active BOOLEAN DEFAULT true,
        featured BOOLEAN DEFAULT false,
        trending BOOLEAN DEFAULT false,
        best_seller BOOLEAN DEFAULT false,
        new_arrival BOOLEAN DEFAULT false,
        popular BOOLEAN DEFAULT false,
        recommended BOOLEAN DEFAULT false,
        stock VARCHAR(255) DEFAULT 'In Stock',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Ensure all new product columns exist if the table was already created
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS new_arrival BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS popular BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS recommended BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory VARCHAR(255);`);
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(255);`);
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS clearance BOOLEAN DEFAULT false;`);

    // Create categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        parent_id INT,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Optionally insert the whitelisted admin if not exists (hardcoded check is also done in logic)
    // But inserting it is a good practice
    await client.query(`
      INSERT INTO admins (email) 
      VALUES ($1) 
      ON CONFLICT (email) DO NOTHING;
    `, [process.env.ADMIN_EMAIL || 'mmramusements@gmail.com']);

    // Careers Applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS careers_applications (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        position VARCHAR(255) NOT NULL,
        experience VARCHAR(100),
        portfolio_url TEXT,
        resume_url TEXT,
        cover_letter TEXT,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Customer Queries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS customer_queries (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        company VARCHAR(255),
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Careers Jobs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS careers_jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        dept VARCHAR(100) NOT NULL,
        type VARCHAR(100) NOT NULL,
        level VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(100) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        company_name VARCHAR(255),
        business_type VARCHAR(100),
        shipping_address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip_code VARCHAR(50) NOT NULL,
        country VARCHAR(100) NOT NULL,
        notes TEXT,
        preferred_contact_method VARCHAR(50),
        payment_status VARCHAR(50) DEFAULT 'pending',
        order_status VARCHAR(50) DEFAULT 'pending',
        paypal_transaction_id VARCHAR(255),
        subtotal NUMERIC(10, 2) NOT NULL,
        total NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Order Items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('Database tables initialized successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database tables:', err);
    throw err;
  } finally {
    client.release();
  }
};
