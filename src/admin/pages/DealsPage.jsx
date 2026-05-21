import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Zap } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useDealStore } from '../store/useDealStore';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import AdminModal from '../components/ui/AdminModal';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatPrice } from '../utils/formatters';

export default function DealsPage() {
  const deals = useDealStore(state => state.deals);
  const addDeal = useDealStore(state => state.addDeal);
  const updateDeal = useDealStore(state => state.updateDeal);
  const deleteDeal = useDealStore(state => state.deleteDeal);
  const toggleActive = useDealStore(state => state.toggleActive);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  const handleOpenModal = (deal = null) => {
    setEditingDeal(deal);
    if (deal) {
      reset({ ...deal, features: deal.features.join(', ') });
    } else {
      reset({ title: '', category: 'Bundle Deal', price: '', originalPrice: '', discount: '', features: '', active: true });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDeal(null);
    reset();
  };

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      features: data.features.split(',').map(f => f.trim()).filter(Boolean)
    };
    
    if (editingDeal) {
      updateDeal(editingDeal.id, formattedData);
      toast.success('Deal updated');
    } else {
      addDeal(formattedData);
      toast.success('Deal created');
    }
    handleCloseModal();
  };

  const handleDelete = async (id, title) => {
    const ok = await confirm(`Are you sure you want to delete deal "${title}"?`);
    if (ok) {
      deleteDeal(id);
      toast.success('Deal deleted');
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Deal Title',
      cell: ({ row }) => <div style={{ fontWeight: 500, color: 'var(--adm-text)' }}>{row.original.title}</div>
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <span style={{ fontSize: '12.5px', color: 'var(--adm-muted)' }}>{row.original.category}</span>
    },
    {
      accessorKey: 'price',
      header: 'Sale Price',
      cell: ({ row }) => <div style={{ fontWeight: 500, color: 'var(--adm-success)' }}>{formatPrice(row.original.price)}</div>
    },
    {
      accessorKey: 'originalPrice',
      header: 'Original Price',
      cell: ({ row }) => <div style={{ textDecoration: 'line-through', color: 'var(--adm-muted)' }}>{formatPrice(row.original.originalPrice)}</div>
    },
    {
      accessorKey: 'discount',
      header: 'Discount Label',
      cell: ({ row }) => <span className="adm-badge adm-badge-accent">{row.original.discount}</span>
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button" 
            className={`adm-toggle ${row.original.active ? 'on' : ''}`}
            onClick={() => {
              toggleActive(row.original.id);
              toast.info(`Deal ${row.original.active ? 'deactivated' : 'activated'}`);
            }}
          />
        </div>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
          <button className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => handleOpenModal(row.original)}>
            <Edit2 size={15} />
          </button>
          <button className="adm-btn adm-btn-ghost adm-btn-icon" style={{ color: 'var(--adm-danger)' }} onClick={() => handleDelete(row.original.id, row.original.title)}>
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div>
      <PageHeader 
        title="Promotions & Deals" 
        subtitle="Manage bundle offers, flash sales, and hardware packs."
        actions={
          <button className="adm-btn adm-btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={16} /> Create Deal
          </button>
        }
      />

      <DataTable columns={columns} data={deals} />

      <ConfirmDialog {...confirmState} onConfirm={handleConfirm} onCancel={handleCancel} dangerous />

      <AdminModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        title={editingDeal ? 'Edit Deal' : 'Create Deal'}
        size="md"
        footer={
          <>
            <button className="adm-btn adm-btn-ghost" onClick={handleCloseModal}>Cancel</button>
            <button className="adm-btn adm-btn-primary" onClick={handleSubmit(onSubmit)}>Save Deal</button>
          </>
        }
      >
        <form className="adm-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="adm-field" style={{ marginBottom: 0 }}>
            <label className="adm-label">Deal Title *</label>
            <input className={`adm-input ${errors.title ? 'adm-input-error' : ''}`} {...register('title', { required: true })} />
          </div>
          
          <div className="adm-form-grid">
            <div className="adm-field" style={{ marginBottom: 0 }}>
              <label className="adm-label">Category</label>
              <input className="adm-input" {...register('category')} />
            </div>
            <div className="adm-field" style={{ marginBottom: 0 }}>
              <label className="adm-label">Discount Label</label>
              <input className="adm-input" {...register('discount')} placeholder="e.g. 20% OFF" />
            </div>
          </div>

          <div className="adm-form-grid">
            <div className="adm-field" style={{ marginBottom: 0 }}>
              <label className="adm-label">Sale Price ($) *</label>
              <input className={`adm-input ${errors.price ? 'adm-input-error' : ''}`} {...register('price', { required: true })} />
            </div>
            <div className="adm-field" style={{ marginBottom: 0 }}>
              <label className="adm-label">Original Price ($)</label>
              <input className="adm-input" {...register('originalPrice')} />
            </div>
          </div>

          <div className="adm-field" style={{ marginBottom: 0 }}>
            <label className="adm-label">Features (comma separated)</label>
            <textarea className="adm-textarea" {...register('features')} placeholder="Feature 1, Feature 2, Feature 3" style={{ minHeight: '80px' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--adm-border)' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--adm-text)' }}>Active Status</div>
              <div style={{ fontSize: '12px', color: 'var(--adm-muted)' }}>Show this deal on the storefront</div>
            </div>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <button type="button" onClick={() => field.onChange(!field.value)} className={`adm-toggle ${field.value ? 'on' : ''}`} />
              )}
            />
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
