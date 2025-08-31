// components/ImageUploader.jsx
import React, { useEffect, useState } from 'react';

const ImageUploader = ({ handleImageChange, previewImages = [], setPreviewImages }) => {
  const [localPreviews, setLocalPreviews] = useState([]);

  useEffect(() => {
    if (previewImages.length) {
      setLocalPreviews(previewImages.map(img => typeof img === 'string' ? { url: img } : img));
    }
  }, [previewImages]);

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      alt: file.name,
    }));

    setLocalPreviews(prev => [...prev, ...filePreviews]);
    setPreviewImages(prev => [...prev, ...files]);
    handleImageChange(e);
  };

  const removeImage = (index) => {
    const updatedPreviews = localPreviews.filter((_, i) => i !== index);
    const updatedFiles = previewImages.filter((_, i) => i !== index);
    setLocalPreviews(updatedPreviews);
    setPreviewImages(updatedFiles);
  };

  return (
    <div>
      <label className="block mb-1 font-medium text-sm text-gray-700">Upload Images</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        className="block w-full"
      />
      <div className="flex flex-wrap gap-4 mt-3">
        {localPreviews.map((img, idx) => (
          <div key={idx} className="relative w-24 h-24">
            <img
              src={img.url || img}
              alt={img.alt || 'preview'}
              className="w-full h-full object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
