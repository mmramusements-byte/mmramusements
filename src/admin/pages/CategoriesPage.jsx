import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminUIStore } from '../store/useAdminUIStore';
import PageHeader from '../components/ui/PageHeader';
import api from '../../lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New Category form state
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '', image_url: '' });
  
  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', description: '', image_url: '' });
  
  const toast = useAdminUIStore(state => state.toast);
  const openConfirm = useAdminUIStore(state => state.openConfirm);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/categories');
        setCategories(data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [toast]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.name.trim() || !newCat.slug.trim()) {
      toast.error('Name and Slug are required');
      return;
    }
    
    try {
      const res = await api.post('/categories', newCat);
      setCategories([...categories, res]);
      setNewCat({ name: '', slug: '', description: '', image_url: '' });
      toast.success('Category added');
    } catch (err) {
      toast.error(err.message || 'Failed to add category');
    }
  };

  const handleDelete = (id, name) => {
    openConfirm({
      title: 'Delete Category',
      message: `Are you sure you want to delete the category "${name}"? Products in this category will not be deleted, but may need to be reassigned.`,
      onConfirm: async () => {
        try {
          await api.delete(`/categories/${id}`);
          setCategories(categories.filter(c => c.id !== id && c._id !== id));
          toast.success('Category deleted');
        } catch (err) {
          toast.error(err.message || 'Failed to delete category');
        }
      }
    });
  };

  const handleEditClick = (cat) => {
    const id = cat.id || cat._id;
    setEditingId(id);
    setEditForm({ name: cat.name, slug: cat.slug, description: cat.description || '', image_url: cat.image_url || '' });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await api.put(`/categories/${id}`, editForm);
      setCategories(categories.map(c => (c.id === id || c._id === id) ? res : c));
      setEditingId(null);
      toast.success('Category updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update category');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader 
        title="Categories" 
        subtitle="Manage product categories used in the storefront catalog."
      />

      <div style={{ maxWidth: '1000px' }}>
        <div className="adm-card" style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Add New Category</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input 
              className="adm-input" 
              placeholder="Category Name..." 
              value={newCat.name} 
              onChange={e => setNewCat({...newCat, name: e.target.value})}
            />
            <input 
              className="adm-input" 
              placeholder="Slug..." 
              value={newCat.slug} 
              onChange={e => setNewCat({...newCat, slug: e.target.value})}
            />
            <input 
              className="adm-input" 
              placeholder="Image URL..." 
              value={newCat.image_url} 
              onChange={e => setNewCat({...newCat, image_url: e.target.value})}
            />
            <input 
              className="adm-input" 
              placeholder="Description..." 
              value={newCat.description} 
              onChange={e => setNewCat({...newCat, description: e.target.value})}
            />
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={!newCat.name.trim() || !newCat.slug.trim()}>
                <Plus size={16} /> Add Category
              </button>
            </div>
          </form>
        </div>

        <div className="adm-card" style={{ padding: 0 }}>
          {isLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--adm-muted)' }}>Loading categories...</div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => {
                  const id = cat.id || cat._id;
                  return (
                    <tr key={id}>
                      {editingId === id ? (
                        <>
                          <td>
                            <input className="adm-input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                          </td>
                          <td>
                            <input className="adm-input" value={editForm.slug} onChange={e => setEditForm({...editForm, slug: e.target.value})} />
                          </td>
                          <td>
                            <input className="adm-input" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                            <input className="adm-input" value={editForm.image_url} onChange={e => setEditForm({...editForm, image_url: e.target.value})} style={{ marginTop: '8px' }} placeholder="Image URL" />
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="adm-btn adm-btn-primary adm-btn-icon" onClick={() => handleUpdate(id)}>
                                <Save size={15} />
                              </button>
                              <button className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => setEditingId(null)}>
                                <X size={15} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ fontWeight: 500, color: 'var(--adm-text)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {cat.image_url ? (
                                <img src={cat.image_url} alt="" style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: 32, height: 32, borderRadius: 4, background: 'var(--adm-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <ImageIcon size={16} />
                                </div>
                              )}
                              {cat.name}
                            </div>
                          </td>
                          <td style={{ color: 'var(--adm-muted)' }}>{cat.slug}</td>
                          <td style={{ color: 'var(--adm-muted)' }}>
                            <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {cat.description || '-'}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                className="adm-btn adm-btn-ghost adm-btn-icon" 
                                onClick={() => handleEditClick(cat)}
                              >
                                <Edit size={15} />
                              </button>
                              <button 
                                className="adm-btn adm-btn-ghost adm-btn-icon" 
                                style={{ color: 'var(--adm-danger)' }}
                                onClick={() => handleDelete(id, cat.name)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!isLoading && categories.length === 0 && (
            <div className="adm-empty">No categories found.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
