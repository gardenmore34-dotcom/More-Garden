// src/pages/EditProductForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, updateProduct } from '../api/productAPI';
import TagSelector from '../components/TagSelector';
import CategorySelector from '../components/CatagorySelector';
import ImageUploader from '../components/ImageUploader';

const EditProductForm = () => {
  const { id } = useParams();
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        setOriginalData(product);
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          category: product.category || '',
          tags: Array.isArray(product.tags) ? product.tags : [],
          price: product.price?.toString() || '',
          discountPrice: product.discountPrice?.toString() || '',
          quantity: product.quantity?.toString() || '',
          rating: product.rating?.toString() || '',
          inStock: product.inStock,
          featured: product.featured
        });
        setExistingImages(product.images || []);
      } catch (err) {
        console.error('Error loading product:', err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagChange = (tags) => setFormData((prev) => ({ ...prev, tags }));
  const handleCategoryChange = (category) => setFormData((prev) => ({ ...prev, category }));
  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setNewImages(files);
    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      alt: file.name,
    }));
    setPreviewImages(previews);
  };

  const getChangedFields = () => {
    const changed = {};
    Object.keys(formData).forEach(key => {
      if (formData[key]?.toString() !== originalData[key]?.toString()) {
        changed[key] = formData[key];
      }
    });
    return changed;
  };

  const handleFinalSubmit = async () => {
    const changedFields = getChangedFields();
    const data = new FormData();
    Object.entries(changedFields).forEach(([key, value]) => {
      if (key === 'tags') {
        value.forEach(tag => data.append('tags', tag));
      } else {
        data.append(key, value);
      }
    });
    newImages.forEach(file => data.append('images', file));

    try {
      await updateProduct(id, data);
      alert('✅ Product updated successfully');
    } catch (err) {
      console.error('Error updating product:', err);
      alert('❌ Failed to update product');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSummary(true);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Product Name" className="w-full border rounded px-4 py-2" />
        <input name="slug" value={formData.slug || ''} onChange={handleChange} placeholder="Slug" className="w-full border rounded px-4 py-2" />
        <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="w-full border rounded px-4 py-2" rows="3" />
        <CategorySelector selectedCategory={formData.category} setSelectedCategory={handleCategoryChange} />
        <TagSelector selectedTags={formData.tags} setSelectedTags={handleTagChange} />
        <input name="price" type="number" value={formData.price || ''} onChange={handleChange} placeholder="Price" className="w-full border rounded px-4 py-2" />
        <input name="discountPrice" type="number" value={formData.discountPrice || ''} onChange={handleChange} placeholder="Discount Price" className="w-full border rounded px-4 py-2" />
        <input name="quantity" type="number" value={formData.quantity || ''} onChange={handleChange} placeholder="Quantity" className="w-full border rounded px-4 py-2" />
        <input name="rating" type="number" value={formData.rating || ''} onChange={handleChange} placeholder="Rating" className="w-full border rounded px-4 py-2" />
        <div className="flex items-center gap-2">
          <input name="inStock" type="checkbox" checked={formData.inStock} onChange={handleChange} />
          <label htmlFor="inStock">In Stock</label>
        </div>
        <div className="flex items-center gap-2">
          <input name="featured" type="checkbox" checked={formData.featured} onChange={handleChange} />
          <label htmlFor="featured">Featured</label>
        </div>

        <ImageUploader existingImages={existingImages} onImageChange={handleImageChange} />

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Update Product
        </button>
      </form>

      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white max-w-3xl w-full p-6 rounded shadow-xl">
            <h3 className="text-lg font-bold mb-4">Confirm Changes</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-green-600">Original</h4>
                {Object.entries(originalData).map(([key, value]) => (
                  <div key={key} className="border-b py-1">
                    <strong>{key}:</strong> {key === 'images' ? value.map((img, i) => <img key={i} src={img.url} alt={img.alt} className="w-16 h-16 inline-block mr-1 rounded" />) : JSON.stringify(value)}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold text-blue-600">Updated</h4>
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="border-b py-1">
                    <strong>{key}:</strong> {key === 'images' || key === 'previewImages' ? previewImages.map((img, i) => <img key={i} src={img.url} alt={img.alt} className="w-16 h-16 inline-block mr-1 rounded" />) : JSON.stringify(value)}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowSummary(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => {
                setShowSummary(false);
                handleFinalSubmit();
              }}>Confirm Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductForm;
