import { pool } from '../config/db.js';

export const getHomepageSettings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM homepage_settings LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(200).json({
        hero_visible: true,
        featured_visible: true,
        trending_visible: true,
        deals_visible: true,
        reviews_visible: true,
        best_sellers_visible: true,
        new_arrivals_visible: true,
        popular_visible: true,
        recommended_visible: true,
        logo_url: null,
      });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateHomepageSettings = async (req, res) => {
  try {
    const { 
      hero_visible, featured_visible, trending_visible, deals_visible, reviews_visible,
      best_sellers_visible, new_arrivals_visible, popular_visible, recommended_visible, logo_url
    } = req.body;

    const result = await pool.query(
      `UPDATE homepage_settings SET 
        hero_visible = COALESCE($1, hero_visible),
        featured_visible = COALESCE($2, featured_visible),
        trending_visible = COALESCE($3, trending_visible),
        deals_visible = COALESCE($4, deals_visible),
        reviews_visible = COALESCE($5, reviews_visible),
        best_sellers_visible = COALESCE($6, best_sellers_visible),
        new_arrivals_visible = COALESCE($7, new_arrivals_visible),
        popular_visible = COALESCE($8, popular_visible),
        recommended_visible = COALESCE($9, recommended_visible),
        logo_url = COALESCE($10, logo_url),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [hero_visible, featured_visible, trending_visible, deals_visible, reviews_visible, best_sellers_visible, new_arrivals_visible, popular_visible, recommended_visible, logo_url]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating homepage settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
