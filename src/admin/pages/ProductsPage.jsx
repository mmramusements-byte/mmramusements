import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Copy, Eye, Star, TrendingUp } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import DataTable from '../components/ui/DataTable';
import PageHeader from '../components/ui/PageHeader';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatPrice, formatDate, truncate } from '../utils/formatters';

export default function ProductsPage() {
  const products = useProductStore(state => state.products);
  const deleteProduct = useProductStore(state => state.deleteProduct);
  const duplicateProduct = useProductStore(state => state.duplicateProduct);
  
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'All') return products;
    return products.filter(p => p.category === categoryFilter);
  }, [products, categoryFilter]);

  const handleDelete = async (id, title) => {
    const ok = await confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`);
    if (ok) {
      deleteProduct(id);
      toast.success(`Deleted ${title}`);
    }
  };

  const columns = useMemo(() => [
    {
      id: 'product',
      header: 'Product',
      accessorFn: row => row.title,
      cell: ({ row }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={row.original.image || '/fallback.png'} 
            style={{ width:40, height:40, borderRadius:8, objectFit:'cover', background:'#1c1c1f' }} 
            alt={row.original.title}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: '13.5px', color: 'var(--adm-text)' }}>
              {truncate(row.original.title, 35)}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--adm-muted)', marginTop: '2px' }}>
              {row.original.category}
            </div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <div style={{ fontWeight: 500, color: 'var(--adm-success)' }}>
          {formatPrice(row.original.price)}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessorFn: row => row.active ? 'Active' : 'Inactive',
      cell: ({ row }) => (
        <span className={`adm-badge ${row.original.active ? 'adm-badge-success' : 'adm-badge-gray'}`}>
          {row.original.active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      id: 'labels',
      header: 'Labels',
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {row.original.featured && <span className="adm-badge adm-badge-accent"><Star size={10} /> Featured</span>}
          {row.original.trending && <span className="adm-badge adm-badge-warning"><TrendingUp size={10} /> Trending</span>}
          {row.original.bestSeller && <span className="adm-badge adm-badge-blue">Best Seller</span>}
        </div>
      )
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => (
        <span style={{ fontSize: '12.5px', color: row.original.stock === 'Out of Stock' ? 'var(--adm-danger)' : 'var(--adm-text)' }}>
          {row.original.stock}
        </span>
      )
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => (
        <span style={{ fontSize: '12.5px', color: 'var(--adm-muted)' }}>
          {formatDate(row.original.updatedAt)}
        </span>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
          <button 
            className="adm-btn adm-btn-ghost adm-btn-icon" 
            title="Edit"
            onClick={() => navigate(`/admin/products/edit/${row.original.id}`)}
          >
            <Edit2 size={15} />
          </button>
          <button 
            className="adm-btn adm-btn-ghost adm-btn-icon" 
            title="Duplicate"
            onClick={() => {
              duplicateProduct(row.original.id);
              toast.success(`Duplicated ${row.original.title}`);
            }}
          >
            <Copy size={15} />
          </button>
          <button 
            className="adm-btn adm-btn-ghost adm-btn-icon" 
            style={{ color: 'var(--adm-danger)' }}
            title="Delete"
            onClick={() => handleDelete(row.original.id, row.original.title)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ], [navigate, toast, deleteProduct, duplicateProduct, confirm]);

  return (
    <div>
      <PageHeader 
        title="Products Catalog" 
        subtitle="Manage all gaming carts, cabinets, boards, and parts." 
        actions={
          <Link to="/admin/products/add" className="adm-btn adm-btn-primary">
            <Plus size={16} /> Add Product
          </Link>
        }
      />
      
      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['All', 'Cabinets', 'Boards', 'Validators', 'Parts', 'Accessories'].map(cat => (
          <button
            key={cat}
            className={`adm-filter-pill ${categoryFilter === cat ? 'active' : ''}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredProducts} 
      />

      <ConfirmDialog {...confirmState} onConfirm={handleConfirm} onCancel={handleCancel} dangerous />
    </div>
  );
}
