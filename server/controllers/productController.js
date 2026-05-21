import { pool } from '../config/db.js';
import { processAndUploadImage } from '../services/uploadService.js';

export const getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title, price, discount_price, category, condition, players, yield: yieldValue,
      warranty, description, tags, features,
      active, featured, trending, stock
    } = req.body;
    
    // Support both snake_case (direct API) and camelCase (frontend form)
    const best_seller = req.body.best_seller ?? req.body.bestSeller ?? false;
    const new_arrival = req.body.new_arrival ?? req.body.newArrival ?? false;
    const popular = req.body.popular ?? false;
    const recommended = req.body.recommended ?? false;

    let image_url = req.body.image;
    if (image_url && image_url.startsWith('data:image/')) {
      const base64Data = image_url.split(';base64,').pop();
      const fileBuffer = Buffer.from(base64Data, 'base64');
      image_url = await processAndUploadImage(fileBuffer);
    } else if (req.file) {
      image_url = await processAndUploadImage(req.file.buffer);
    }

    const result = await pool.query(
      `INSERT INTO products (
        title, price, discount_price, category, condition, players, yield, 
        warranty, description, image_url, tags, features, 
        active, featured, trending, best_seller, new_arrival, popular, recommended, stock
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, 
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19, $20
      ) RETURNING *`,
      [
        title, price, discount_price || null, category, condition, players || 0, yieldValue,
        warranty, description, image_url, tags ? JSON.stringify(tags) : '[]', features ? JSON.stringify(features) : '[]',
        active ?? true, featured ?? false, trending ?? false, best_seller, new_arrival, popular, recommended, stock || 'In Stock'
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, price, discount_price, category, condition, players, yield: yieldValue,
      warranty, description, tags, features,
      active, featured, trending, stock
    } = req.body;
    
    // Support both snake_case (direct API) and camelCase (frontend form)
    const best_seller = req.body.best_seller ?? req.body.bestSeller;
    const new_arrival = req.body.new_arrival ?? req.body.newArrival;
    const popular = req.body.popular;
    const recommended = req.body.recommended;

    let image_url = req.body.image;
    if (image_url && image_url.startsWith('data:image/')) {
      const base64Data = image_url.split(';base64,').pop();
      const fileBuffer = Buffer.from(base64Data, 'base64');
      image_url = await processAndUploadImage(fileBuffer);
    } else if (req.file) {
      image_url = await processAndUploadImage(req.file.buffer);
    }

    const result = await pool.query(
      `UPDATE products SET 
        title = COALESCE($1, title),
        price = COALESCE($2, price),
        discount_price = COALESCE($3, discount_price),
        category = COALESCE($4, category),
        condition = COALESCE($5, condition),
        players = COALESCE($6, players),
        yield = COALESCE($7, yield),
        warranty = COALESCE($8, warranty),
        description = COALESCE($9, description),
        image_url = COALESCE($10, image_url),
        tags = COALESCE($11, tags),
        features = COALESCE($12, features),
        active = COALESCE($13, active),
        featured = COALESCE($14, featured),
        trending = COALESCE($15, trending),
        best_seller = COALESCE($16, best_seller),
        new_arrival = COALESCE($17, new_arrival),
        popular = COALESCE($18, popular),
        recommended = COALESCE($19, recommended),
        stock = COALESCE($20, stock),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $21
      RETURNING *`,
      [
        title, price, discount_price, category, condition, players, yieldValue,
        warranty, description, image_url, tags ? JSON.stringify(tags) : null, features ? JSON.stringify(features) : null,
        active, featured, trending, best_seller, new_arrival, popular, recommended, stock,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Product deleted successfully', id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
