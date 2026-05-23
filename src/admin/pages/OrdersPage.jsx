import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Eye } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import DataTable from '../components/ui/DataTable';
import PageHeader from '../components/ui/PageHeader';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatPrice, formatDate } from '../utils/formatters';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.get('/orders');
      setOrders(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, orderNumber) => {
    const ok = await confirm(`Are you sure you want to delete order #${orderNumber}? This cannot be undone.`);
    if (ok) {
      try {
        await api.delete(`/orders/${id}`);
        toast.success(`Deleted order #${orderNumber}`);
        setOrders(orders.filter(o => o.id !== id));
      } catch (error) {
        toast.error(error.message || 'Failed to delete order');
      }
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span style={{ fontSize: '12.5px', color: 'var(--adm-muted)' }}>
          {row.original.id}
        </span>
      )
    },
    {
      accessorKey: 'orderNumber',
      header: 'Order #',
      cell: ({ row }) => (
        <div style={{ fontWeight: 500, color: 'var(--adm-text)' }}>
          {row.original.orderNumber || row.original.id}
        </div>
      )
    },
    {
      id: 'customer',
      header: 'Customer',
      accessorFn: row => `${row.original.firstName} ${row.original.lastName}`,
      cell: ({ row }) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: '13px', color: 'var(--adm-text)' }}>
            {row.original.firstName} {row.original.lastName}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--adm-muted)' }}>
            {row.original.email}
          </div>
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <span style={{ fontSize: '12.5px', color: 'var(--adm-muted)' }}>
          {formatDate(row.original.createdAt)}
        </span>
      )
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => (
        <div style={{ fontWeight: 500, color: 'var(--adm-success)' }}>
          {formatPrice(row.original.total)}
        </div>
      )
    },
    {
      accessorKey: 'order_status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.order_status || 'Pending';
        let badgeClass = 'adm-badge-gray';
        
        if (status === 'Completed') badgeClass = 'adm-badge-success';
        else if (status === 'Pending') badgeClass = 'adm-badge-warning';
        else if (status === 'Processing') badgeClass = 'adm-badge-blue';
        else if (status === 'Cancelled') badgeClass = 'adm-badge-danger';
        else if (status === 'Contacted') badgeClass = 'adm-badge-accent';

        return (
          <span className={`adm-badge ${badgeClass}`}>
            {status}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
          <button 
            className="adm-btn adm-btn-ghost adm-btn-icon" 
            title="View Order"
            onClick={() => navigate(`/admin/orders/${row.original.id}`)}
          >
            <Eye size={15} />
          </button>
          <button 
            className="adm-btn adm-btn-ghost adm-btn-icon" 
            style={{ color: 'var(--adm-danger)' }}
            title="Delete Order"
            onClick={() => handleDelete(row.original.id, row.original.orderNumber || row.original.id)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ], [navigate, toast, confirm]);

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--adm-muted)' }}>Loading orders...</div>;
  }

  return (
    <div>
      <PageHeader 
        title="Orders" 
        subtitle="Manage customer orders and their statuses." 
      />

      <DataTable 
        columns={columns} 
        data={orders} 
      />

      <ConfirmDialog {...confirmState} onConfirm={handleConfirm} onCancel={handleCancel} dangerous />
    </div>
  );
}
