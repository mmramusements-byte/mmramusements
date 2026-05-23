import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Package, CreditCard } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../hooks/useToast';
import { formatPrice, formatDate } from '../utils/formatters';

const STATUSES = ['Pending', 'Contacted', 'Processing', 'Completed', 'Cancelled'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      toast.error(error.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await api.put(`/orders/${id}`, { order_status: newStatus });
      setOrder({ ...order, order_status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--adm-muted)' }}>Loading order details...</div>;
  }

  if (!order) {
    return (
      <div style={{ padding: '20px', color: 'var(--adm-danger)' }}>
        Order not found.
        <br />
        <Link to="/admin/orders" style={{ color: 'var(--adm-primary)', textDecoration: 'none', marginTop: '10px', display: 'inline-block' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/admin/orders"
            className="adm-btn adm-btn-secondary adm-btn-icon"
            style={{ borderRadius: '50%' }}
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--adm-text)', margin: 0 }}>
              Order #{order.orderNumber || order.id}
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--adm-muted)', marginTop: '4px' }}>
              Placed on {formatDate(order.createdAt)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--adm-muted)' }}>Status:</span>
          <select
            value={order.order_status || 'Pending'}
            onChange={handleStatusChange}
            className="adm-input"
            style={{ minWidth: '140px' }}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* ── Customer Details ── */}
        <div style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--adm-text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} /> Customer Information
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
            <div>
              <span style={{ color: 'var(--adm-muted)' }}>Name:</span>
              <div style={{ fontWeight: 500, color: 'var(--adm-text)', marginTop: '2px' }}>
                {order.firstName} {order.lastName}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--adm-muted)' }}>Email:</span>
              <div style={{ color: 'var(--adm-text)', marginTop: '2px' }}>{order.email}</div>
            </div>
            <div>
              <span style={{ color: 'var(--adm-muted)' }}>Phone:</span>
              <div style={{ color: 'var(--adm-text)', marginTop: '2px' }}>{order.phone || 'N/A'}</div>
            </div>
            <div>
              <span style={{ color: 'var(--adm-muted)' }}>Business Type:</span>
              <div style={{ color: 'var(--adm-text)', marginTop: '2px' }}>{order.businessType || 'N/A'}</div>
            </div>
            
            <hr style={{ border: 0, borderTop: '1px solid var(--adm-border)', margin: '4px 0' }} />
            
            <div>
              <span style={{ color: 'var(--adm-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> Shipping Address:
              </span>
              <div style={{ color: 'var(--adm-text)', marginTop: '6px', lineHeight: 1.5 }}>
                {order.address}<br />
                {order.city}, {order.state} {order.zip}<br />
                {order.country}
              </div>
            </div>

            {order.notes && (
              <>
                <hr style={{ border: 0, borderTop: '1px solid var(--adm-border)', margin: '4px 0' }} />
                <div>
                  <span style={{ color: 'var(--adm-muted)' }}>Order Notes:</span>
                  <div style={{ color: 'var(--adm-text)', marginTop: '6px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
                    {order.notes}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--adm-text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={16} /> Order Summary
          </h2>

          <div style={{ flex: 1 }}>
            {Array.isArray(order.items) && order.items.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--adm-bg)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {item.image ? (
                          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Package size={16} color="var(--adm-muted)" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--adm-text)' }}>{item.title || item.name || 'Unknown Product'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--adm-text)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--adm-muted)', fontSize: '13px' }}>No items found in this order.</div>
            )}
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--adm-border)', margin: '20px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--adm-muted)' }}>
              <span>Subtotal</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--adm-muted)' }}>
              <span>Shipping</span>
              <span>Calculated</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--adm-text)', fontSize: '16px', marginTop: '4px' }}>
              <span>Total</span>
              <span style={{ color: 'var(--adm-success)' }}>{formatPrice(order.total)}</span>
            </div>
          </div>

          {order.paypal_transaction_id && (
            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(59,130,246,0.08)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CreditCard size={16} color="#3b82f6" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  PayPal Transaction
                </div>
                <div style={{ fontSize: '13px', color: 'var(--adm-text)', marginTop: '2px', wordBreak: 'break-all' }}>
                  {order.paypal_transaction_id}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
