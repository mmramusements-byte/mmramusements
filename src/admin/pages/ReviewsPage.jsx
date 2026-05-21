import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useReviewStore } from '../store/useReviewStore';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import AdminModal from '../components/ui/AdminModal';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { truncate } from '../utils/formatters';

export default function ReviewsPage() {
  const reviews = useReviewStore(state => state.reviews);
  const addReview = useReviewStore(state => state.addReview);
  const updateReview = useReviewStore(state => state.updateReview);
  const deleteReview = useReviewStore(state => state.deleteReview);
  const toggleFeatured = useReviewStore(state => state.toggleFeatured);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  const handleOpenModal = (review = null) => {
    setEditingReview(review);
    if (review) {
      reset(review);
    } else {
      reset({ name: '', handle: '', rating: 5, comment: '', avatar: 'U', avatarColor: '#6366f1', featured: false });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingReview(null);
    reset();
  };

  const onSubmit = (data) => {
    if (editingReview) {
      updateReview(editingReview.id, data);
      toast.success('Review updated');
    } else {
      addReview({ ...data, rating: parseInt(data.rating, 10) });
      toast.success('Review created');
    }
    handleCloseModal();
  };

  const handleDelete = async (id, name) => {
    const ok = await confirm(`Are you sure you want to delete the review by ${name}?`);
    if (ok) {
      deleteReview(id);
      toast.success('Review deleted');
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Reviewer',
      cell: ({ row }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: row.original.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 600 }}>
            {row.original.avatar}
          </div>
          <div>
            <div style={{ fontWeight: 500, color: 'var(--adm-text)' }}>{row.original.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--adm-muted)' }}>{row.original.handle}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => (
        <div style={{ color: '#f59e0b', fontSize: '14px', letterSpacing: '2px' }}>
          {'★'.repeat(row.original.rating)}{'☆'.repeat(5 - row.original.rating)}
        </div>
      )
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: ({ row }) => <span style={{ fontSize: '13px', color: 'var(--adm-muted)' }}>{truncate(row.original.comment, 50)}</span>
    },
    {
      id: 'featured',
      header: 'Featured',
      cell: ({ row }) => (
        <button 
          type="button" 
          onClick={() => {
            toggleFeatured(row.original.id);
            toast.info(`Review ${row.original.featured ? 'unfeatured' : 'featured'}`);
          }}
          className={`adm-badge ${row.original.featured ? 'adm-badge-accent' : 'adm-badge-gray'}`}
          style={{ cursor: 'pointer', border: 'none' }}
        >
          {row.original.featured ? 'Featured' : 'Standard'}
        </button>
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
          <button className="adm-btn adm-btn-ghost adm-btn-icon" style={{ color: 'var(--adm-danger)' }} onClick={() => handleDelete(row.original.id, row.original.name)}>
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div>
      <PageHeader 
        title="Customer Reviews" 
        subtitle="Manage testimonials and feedback displayed on the storefront."
        actions={
          <button className="adm-btn adm-btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={16} /> Add Review
          </button>
        }
      />

      <DataTable columns={columns} data={reviews} />
      <ConfirmDialog {...confirmState} onConfirm={handleConfirm} onCancel={handleCancel} dangerous />

      <AdminModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        title={editingReview ? 'Edit Review' : 'Add Review'}
        size="md"
        footer={
          <>
            <button className="adm-btn adm-btn-ghost" onClick={handleCloseModal}>Cancel</button>
            <button className="adm-btn adm-btn-primary" onClick={handleSubmit(onSubmit)}>Save Review</button>
          </>
        }
      >
        <form className="adm-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="adm-form-grid">
            <div className="adm-field" style={{ marginBottom: 0 }}>
              <label className="adm-label">Reviewer Name *</label>
              <input className={`adm-input ${errors.name ? 'adm-input-error' : ''}`} {...register('name', { required: true })} />
            </div>
            <div className="adm-field" style={{ marginBottom: 0 }}>
              <label className="adm-label">Handle / Company</label>
              <input className="adm-input" {...register('handle')} />
            </div>
          </div>

          <div className="adm-form-grid-3">
            <div className="adm-field" style={{ marginBottom: 0 }}>
              <label className="adm-label">Avatar Initials</label>
              <input className="adm-input" {...register('avatar')} maxLength={2} />
            </div>
            <div className="adm-field" style={{ marginBottom: 0 }}>
              <label className="adm-label">Avatar Color</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="color" className="adm-input" style={{ width: '40px', padding: '2px' }} {...register('avatarColor')} />
              </div>
            </div>
            <div className="adm-field" style={{ marginBottom: 0 }}>
              <label className="adm-label">Rating</label>
              <select className="adm-select" {...register('rating')}>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          <div className="adm-field" style={{ marginBottom: 0 }}>
            <label className="adm-label">Comment *</label>
            <textarea className={`adm-textarea ${errors.comment ? 'adm-input-error' : ''}`} {...register('comment', { required: true })} style={{ minHeight: '100px' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--adm-border)' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--adm-text)' }}>Featured Review</div>
              <div style={{ fontSize: '12px', color: 'var(--adm-muted)' }}>Show this review on the homepage</div>
            </div>
            <Controller
              name="featured"
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
