import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUpload({ images = [], onChange }) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragging(true);
    } else if (e.type === 'dragleave') {
      setDragging(false);
    }
  };

  const processFiles = (files) => {
    if (!files || files.length === 0) return;
    
    // We max at 5 images total
    if (images.length >= 5) return;
    
    const newFiles = Array.from(files).slice(0, 5 - images.length);
    
    // Convert to base64 for preview (since we don't have a backend to upload to yet)
    const promises = newFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Images => {
      onChange([...images, ...base64Images]);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    processFiles(e.target.files);
  };

  const handleRemove = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div>
      {images.length < 5 && (
        <div 
          className={`adm-dropzone ${dragging ? 'dragging' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: 'pointer' }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleChange} 
            accept="image/*" 
            multiple 
            style={{ display: 'none' }} 
          />
          <Upload size={24} style={{ color: dragging ? 'var(--adm-accent)' : 'var(--adm-muted)', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--adm-text)', marginBottom: '4px' }}>
            Click to upload or drag and drop
          </div>
          <div style={{ fontSize: '12px', color: 'var(--adm-muted)' }}>
            SVG, PNG, JPG or GIF (max. 5 images)
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="adm-img-preview-grid">
          {images.map((img, i) => (
            <div key={i} className="adm-img-preview">
              <img src={img} alt={`Preview ${i}`} />
              <button 
                type="button"
                className="adm-img-remove" 
                onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
