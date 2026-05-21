import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useBannerStore } from '../store/useBannerStore';
import { useToast } from '../hooks/useToast.jsx';
import { useConfirm } from '../hooks/useConfirm.jsx';
import AdminModal from '../components/ui/AdminModal';
import PageHeader from '../components/ui/PageHeader';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { motion, Reorder } from 'framer-motion';

export default function BannersPage() {
  const banners = useBannerStore(state => state.banners);
  const addBanner = useBannerStore(state => state.addBanner);
  const updateBanner = useBannerStore(state => state.updateBanner);
  const deleteBanner = useBannerStore(state => state.deleteBanner);
  const toggleVisibility = useBannerStore(state => state.toggleVisibility);
  const reorderBanners = useBannerStore(state => state.reorderBanners);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  const handleOpenModal = (banner = null) => {
    setEditingBanner(banner);
    if (banner) {
      reset(banner);
    } else {
      reset({ title: '', subtitle: '', ctaText: '', ctaLink: '', image: '', visible: true });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBanner(null);
    reset();
  };

  const onSubmit = (data) => {
    if (editingBanner) {
      updateBanner(editingBanner.id, data);
      toast.success('Banner updated');
    } else {
      addBanner(data);
      toast.success('Banner created');
    }
    handleCloseModal();
  };

  const handleDelete = async (id, title) => {
    const ok = await confirm(`Are you sure you want to delete banner "${title}"?`);
    if (ok) {
      deleteBanner(id);
      toast.success('Banner deleted');
    }
  };

  return (
    <div>
      <PageHeader 
        title="Homepage Banners" 
        subtitle="Manage the rotating hero banners on the main storefront."
        actions={
          <button className="adm-btn adm-btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={16} /> Add Banner
          </button>
        }
      />

      <Reorder.Group axis="y" values={banners} onReorder={reorderBanners} style={{ display: 'flex', flexDirection: 'column', gap: '20px', listStyle: 'none', padding: 0 }}>
        {banners.map(banner => (
          <Reorder.Item key={banner.id} value={banner} style={{ position: 'relative' }}>
            <div className="adm-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', gap: '24px', cursor: 'grab' }}>
              
              {/* Image Preview */}
              <div style={{ width: '280px', height: '160px', flexShrink: 0, position: 'relative', background: '#111' }}>
                <img 
                  src={banner.image || '/fallback.png'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: banner.visible ? 1 : 0.4 }} 
                  alt=""
                />
                {!banner.visible && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
                    <span className="adm-badge adm-badge-gray"><EyeOff size={12} /> Hidden</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div style={{ padding: '24px 24px 24px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--adm-text)', marginBottom: '6px' }}>{banner.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--adm-muted)' }}>{banner.subtitle}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', color: 'var(--adm-muted)' }}>
                    CTA: <span style={{ color: 'var(--adm-accent)' }}>{banner.ctaText}</span> → {banner.ctaLink}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="adm-btn adm-btn-secondary adm-btn-sm" 
                      onClick={() => { toggleVisibility(banner.id); toast.info(banner.visible ? 'Banner hidden' : 'Banner visible'); }}
                    >
                      {banner.visible ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Show</>}
                    </button>
                    <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => handleOpenModal(banner)}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(banner.id, banner.title)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      
      {banners.length === 0 && (
        <div className="adm-empty adm-card">
          <p>No banners found. Add a banner to display on the storefront hero section.</p>
        </div>
      )}

      <ConfirmDialog {...confirmState} onConfirm={handleConfirm} onCancel={handleCancel} dangerous />

      <AdminModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        title={editingBanner ? 'Edit Banner' : 'Add Banner'}
        size="md"
        footer={
          <>
            <button className="adm-btn adm-btn-ghost" onClick={handleCloseModal}>Cancel</button>
            <button className="adm-btn adm-btn-primary" onClick={handleSubmit(onSubmit)}>Save Banner</button>
          </>
        }
      >
        <form className="adm-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="adm-field" style={{ marginBottom: 0 }}>
            <label className="adm-label">Banner Title *</label>
            <input className={`adm-input ${errors.title ? 'adm-input-error' : ''}`} {...register('title', { required: true })} />
          </div>
          
          <div className="adm-field" style={{ marginBottom: 0 }}>
            <label className="adm-label">Subtitle</label>
            <input className="adm-input" {...register('subtitle')} />
          </div>

          <div className="adm-form-grid">
            <div className="adm-field" style={{ marginBottom: 0 }}>
              <label className="adm-label">CTA Text</label>
              <input className="adm-input" {...register('ctaText')} placeholder="e.g. Shop Now" />
            </div>
            <div className="adm-field" style={{ marginBottom: 0 }}>
              <label className="adm-label">CTA Link</label>
              <input className="adm-input" {...register('ctaLink')} placeholder="e.g. /gaming-carts" />
            </div>
          </div>

          <div className="adm-field" style={{ marginBottom: 0 }}>
            <label className="adm-label">Image URL/Path *</label>
            <input className={`adm-input ${errors.image ? 'adm-input-error' : ''}`} {...register('image', { required: true })} placeholder="/hero_bg.png" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--adm-border)' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--adm-text)' }}>Visibility</div>
              <div style={{ fontSize: '12px', color: 'var(--adm-muted)' }}>Show this banner in the rotation</div>
            </div>
            <Controller
              name="visible"
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
