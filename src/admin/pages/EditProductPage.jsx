import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProductForm from '../components/forms/ProductForm';
import PageHeader from '../components/ui/PageHeader';
import { useProductStore } from '../store/useProductStore';
import { useToast } from '../hooks/useToast';

export default function EditProductPage() {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const getProduct = useProductStore(state => state.getProduct);
  const updateProduct = useProductStore(state => state.updateProduct);
  const product = getProduct(id);
  
  const toast = useToast();
  const navigate = useNavigate();
  
  if (!product) {
    return (
      <div className="adm-empty">
        <h2 style={{ color: 'var(--adm-text)', fontSize: '20px', marginBottom: '8px' }}>Product Not Found</h2>
        <p>The product with ID {id} does not exist or has been deleted.</p>
        <button className="adm-btn adm-btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/admin/products')}>
          Back to Catalog
        </button>
      </div>
    );
  }

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600)); 
    updateProduct(id, data);
    toast.success('Product updated successfully!');
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
        <span className="adm-breadcrumb-current">Edit Product</span>
      </div>

      <PageHeader 
        title="Edit Product" 
        subtitle={`Updating details for ${product.title}`} 
      />
      
      <div style={{ maxWidth: '900px' }}>
        <ProductForm 
          defaultValues={product}
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/products')} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}
