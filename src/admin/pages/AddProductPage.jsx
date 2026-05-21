import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/forms/ProductForm';
import PageHeader from '../components/ui/PageHeader';
import { useProductStore } from '../store/useProductStore';
import { useToast } from '../hooks/useToast.jsx';

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addProduct = useProductStore(state => state.addProduct);
  const toast = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600)); 
    addProduct(data);
    toast.success('Product created successfully!');
    setIsSubmitting(false);
    navigate('/admin/products');
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
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/products')} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}
