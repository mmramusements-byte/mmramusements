import { useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useToast } from '../hooks/useToast.jsx';
import { useConfirm } from '../hooks/useConfirm.jsx';
import PageHeader from '../components/ui/PageHeader';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function CategoriesPage() {
  const products = useProductStore(state => state.products);
  const [categories, setCategories] = useState(['Cabinets', 'Boards', 'Validators', 'Parts', 'Accessories']);
  const [newCat, setNewCat] = useState('');
  
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    if (categories.includes(newCat.trim())) {
      toast.error('Category already exists');
      return;
    }
    setCategories([...categories, newCat.trim()]);
    setNewCat('');
    toast.success('Category added');
  };

  const handleDelete = async (cat) => {
    const ok = await confirm(`Are you sure you want to delete the category "${cat}"? Products in this category will not be deleted, but may need to be reassigned.`);
    if (ok) {
      setCategories(categories.filter(c => c !== cat));
      toast.success('Category deleted');
    }
  };

  return (
    <div>
      <PageHeader 
        title="Categories" 
        subtitle="Manage product categories used in the storefront catalog."
      />

      <div style={{ maxWidth: '600px' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <input 
            className="adm-input" 
            placeholder="New Category Name..." 
            value={newCat} 
            onChange={e => setNewCat(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="adm-btn adm-btn-primary" disabled={!newCat.trim()}>
            <Plus size={16} /> Add Category
          </button>
        </form>

        <div className="adm-card" style={{ padding: 0 }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Products Count</th>
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => {
                const count = products.filter(p => p.category === cat).length;
                return (
                  <tr key={cat}>
                    <td style={{ fontWeight: 500, color: 'var(--adm-text)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag size={14} style={{ color: 'var(--adm-muted)' }} /> {cat}
                      </div>
                    </td>
                    <td style={{ color: 'var(--adm-muted)' }}>{count}</td>
                    <td>
                      <button 
                        className="adm-btn adm-btn-ghost adm-btn-icon" 
                        style={{ color: 'var(--adm-danger)' }}
                        onClick={() => handleDelete(cat)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="adm-empty">No categories found.</div>
          )}
        </div>
      </div>
      
      <ConfirmDialog {...confirmState} onConfirm={handleConfirm} onCancel={handleCancel} dangerous />
    </div>
  );
}
