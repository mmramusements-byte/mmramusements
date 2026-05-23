import { pool } from '../config/db.js';
import { transporter } from '../config/nodemailer.js';

export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      customer_name,
      email,
      phone,
      company_name,
      business_type,
      shipping_address,
      city,
      state,
      zip_code,
      country,
      notes,
      preferred_contact_method,
      paypal_transaction_id,
      items,
      subtotal,
      total
    } = req.body;

    const order_number = `MMR-${Date.now()}`;

    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (
        order_number, customer_name, email, phone, company_name, business_type,
        shipping_address, city, state, zip_code, country, notes, preferred_contact_method,
        paypal_transaction_id, subtotal, total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id`,
      [
        order_number, customer_name, email, phone, company_name || null, business_type || null,
        shipping_address, city, state, zip_code, country, notes, preferred_contact_method,
        paypal_transaction_id, subtotal, total
      ]
    );

    const order_id = orderResult.rows[0].id;

    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (
            order_id, product_id, product_name, quantity, unit_price, subtotal
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [order_id, item.product_id, item.product_name, item.quantity, item.unit_price, item.subtotal]
        );
      }
    }

    await client.query('COMMIT');

    // Send Emails
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'mmramusements@gmail.com';
      
      let itemsHtml = '';
      if (items && items.length > 0) {
        itemsHtml = items.map(item => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #333;">${item.product_name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #333; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">$${Number(item.unit_price).toFixed(2)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">$${Number(item.subtotal).toFixed(2)}</td>
          </tr>
        `).join('');
      }

      await transporter.sendMail({
        from: `"MMR Orders" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Order Received - ${order_number}`,
        html: `
          <div style="font-family: sans-serif; color: #fff; background-color: #000; padding: 20px;">
            <h2 style="color: #fbbf24;">New Order: ${order_number}</h2>
            <p><strong>Customer:</strong> ${customer_name} (${email})</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Company:</strong> ${company_name || 'N/A'} (${business_type || 'N/A'})</p>
            <p><strong>Shipping:</strong> ${shipping_address}, ${city}, ${state} ${zip_code}, ${country}</p>
            <p><strong>Notes:</strong> ${notes || 'None'}</p>
            <p><strong>PayPal Txn ID:</strong> ${paypal_transaction_id || 'N/A'}</p>
            <h3>Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #fbbf24; color: #fbbf24;">Product</th>
                  <th style="text-align: center; padding: 8px; border-bottom: 1px solid #fbbf24; color: #fbbf24;">Qty</th>
                  <th style="text-align: right; padding: 8px; border-bottom: 1px solid #fbbf24; color: #fbbf24;">Price</th>
                  <th style="text-align: right; padding: 8px; border-bottom: 1px solid #fbbf24; color: #fbbf24;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <p style="text-align: right; margin-top: 20px; font-size: 1.2em;"><strong>Total: <span style="color: #fbbf24;">$${Number(total).toFixed(2)}</span></strong></p>
          </div>
        `
      });

      await transporter.sendMail({
        from: `"MMR Amusements" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Order Confirmation - ${order_number}`,
        html: `
          <div style="font-family: sans-serif; color: #333; padding: 20px;">
            <h2>Thank you for your order!</h2>
            <p>Hi ${customer_name},</p>
            <p>We have received your order <strong>${order_number}</strong>.</p>
            <p style="color: #d97706; font-weight: bold; font-size: 1.1em;">An MMR representative will contact you manually regarding your order.</p>
            <p><strong>Shipping Details:</strong><br/>
            ${shipping_address}<br/>
            ${city}, ${state} ${zip_code}<br/>
            ${country}</p>
            
            <h3>Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Product</th>
                  <th style="text-align: center; padding: 8px; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="text-align: right; padding: 8px; border-bottom: 2px solid #ddd;">Price</th>
                  <th style="text-align: right; padding: 8px; border-bottom: 2px solid #ddd;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <p style="text-align: right; margin-top: 20px; font-size: 1.2em;"><strong>Total: $${Number(total).toFixed(2)}</strong></p>
            <p style="margin-top: 30px; font-size: 0.9em; color: #666;">If you have any questions, please contact us at mmramusements@gmail.com.</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Error sending order emails:', emailErr);
      // Not throwing error to avoid failing the order creation if email fails
    }

    res.status(201).json({ message: 'Order created successfully', order_number, order_id });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Server error creating order' });
  } finally {
    client.release();
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const order = orderResult.rows[0];

    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    order.items = itemsResult.rows;

    res.json(order);
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    res.status(500).json({ error: 'Server error fetching order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { payment_status, order_status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET payment_status = COALESCE($1, payment_status), order_status = COALESCE($2, order_status) WHERE id = $3 RETURNING *',
      [payment_status, order_status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Server error updating order' });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: 'Server error deleting order' });
  }
};
