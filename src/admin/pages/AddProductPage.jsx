import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/forms/ProductForm';
import PageHeader from '../components/ui/PageHeader';
import { useProductStore } from '../store/useProductStore';
import { useAdminUIStore } from '../store/useAdminUIStore';
import api from '../../lib/api';

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const addProduct = useProductStore(state => state.addProduct);
  const toast = useAdminUIStore(state => state.toast);
  const navigate = useNavigate();
  
  useEffect(() => {
    api.get('/categories')
      .then(setCategories)
      .catch(() => toast.error('Failed to load categories'));
  }, [toast]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await addProduct(data);
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="adm-breadcrumb" style={{ marginBottom: '16px' }}>
        <span>Admin</span>
        <span className="adm-breadcrumb-sep">/</span>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/products')}>Catalog</span>
        <span className="adm-breadcrumb-sep">/</span>
        <span className="adm-breadcrumb-current">Add Product</span>
      </div>

      <PageHeader 
        title="Add Product" 
        subtitle="Create a new product listing for the storefront" 
      />
      
      <div style={{ maxWidth: '900px' }}>
        <ProductForm 
          categories={categories}
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/products')} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}
