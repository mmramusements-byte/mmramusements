import { pool } from '../config/db.js';

// Get all categories (ordered by order_index)
export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY order_index ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};

// Get category by slug
export const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    res.status(500).json({ message: 'Server error fetching category' });
  }
};

// Create category
export const createCategory = async (req, res) => {
  const { name, slug, description, image_url, parent_id, order_index } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO categories (name, slug, description, image_url, parent_id, order_index)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, slug, description, image_url, parent_id, order_index || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    // Handle unique constraint violation on slug
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error creating category' });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, image_url, parent_id, order_index } = req.body;
  
  try {
    const checkResult = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const result = await pool.query(
      `UPDATE categories
       SET name = COALESCE($1, name),
           slug = COALESCE($2, slug),
           description = COALESCE($3, description),
           image_url = COALESCE($4, image_url),
           parent_id = COALESCE($5, parent_id),
           order_index = COALESCE($6, order_index)
       WHERE id = $7 RETURNING *`,
      [name, slug, description, image_url, parent_id, order_index, id]
    );
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error updating category' });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully', category: result.rows[0] });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error deleting category' });
  }
};
