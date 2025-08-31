// src/pages/AddProductForm.jsx
import React, { useState } from 'react';
import { createProduct } from '../api/productAPI';
import TagSelector from '../components/TagSelector';
import ImageUploader from '../components/ImageUploader';
import CategoryMultiSelector from '../components/CategoryMultiSelector';
import TypeSelector from '../components/TypeSelector';

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categories: [],   // ✅ now an array
    tags: [],
    price: '',
    discountPrice: '',
    inStock: true,
    quantity: '',
    featured: false,
    rating: '',
    images: [],
    bulk: false,
    type: '',         // ✅ single string
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const setSelectedTags = tags => {
    setFormData(prev => ({ ...prev, tags }));
  };

  const setSelectedCategories = categories => {
    setFormData(prev => ({ ...prev, categories }));
  };

  const setSelectedType = type => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setFormData(prev => ({
      ...prev,
      images: files
    }));

    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      alt: file.name
    }));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Strings
    data.append("name", formData.name);
    data.append(
      "slug",
      formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
    );
    data.append("description", formData.description);

    // ✅ categories as JSON array
    data.append("categories", JSON.stringify(formData.categories));

    // Numbers
    data.append("price", Number(formData.price));
    if (formData.discountPrice) data.append("discountPrice", Number(formData.discountPrice));
    if (formData.quantity) data.append("quantity", Number(formData.quantity));
    if (formData.rating) data.append("rating", Number(formData.rating));

    // Booleans
    data.append("inStock", formData.inStock ? "true" : "false");
    data.append("featured", formData.featured ? "true" : "false");
    data.append("bulk", formData.bulk ? "true" : "false");

    // Tags still as JSON array
    data.append("tags", JSON.stringify(formData.tags));

    // ✅ type as plain string
    data.append("type", formData.type);

    // Images
    formData.images.forEach((file) => data.append("images", file));

    try {
      const response = await createProduct(data);
      alert("✅ Product created!");
      console.log(response.data);

      setFormData({
        name: "",
        description: "",
        categories: [],
        tags: [],
        price: "",
        discountPrice: "",
        inStock: true,
        quantity: "",
        featured: false,
        rating: "",
        images: [],
        bulk: false,
        type: "",
      });
      setPreviewImages([]);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed to create product");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-green-100"
    >
      <h2 className="text-2xl font-bold text-green-700 mb-4">Add New Product</h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Product Description"
        className="w-full border border-gray-300 rounded p-3 h-32 focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />

      {/* ✅ Multi-category selector */}
      <CategoryMultiSelector
        selectedCategories={formData.categories}
        setSelectedCategories={setSelectedCategories}
      />

      {/* ✅ Single type selector */}
      <TypeSelector
        selectedType={formData.type}
        setSelectedType={setSelectedType}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="border border-gray-300 rounded p-2"
          required
        />
        <input
          name="discountPrice"
          type="number"
          value={formData.discountPrice}
          onChange={handleChange}
          placeholder="Discount Price"
          className="border border-gray-300 rounded p-2"
        />
        <input
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="border border-gray-300 rounded p-2"
        />
        <input
          name="rating"
          type="number"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating"
          className="border border-gray-300 rounded p-2"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          /> In Stock
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="bulk"
            checked={formData.bulk}
            onChange={handleChange}
          /> Bulk
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          /> Featured
        </label>
      </div>

      <TagSelector selectedTags={formData.tags} setSelectedTags={setSelectedTags} />

      <ImageUploader
        handleImageChange={handleImageChange}
        previewImages={previewImages}
        setPreviewImages={() => {}}
      />

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow-md transition"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProductForm;
