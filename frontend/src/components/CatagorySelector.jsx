import React from 'react';
import Select from 'react-select';

const categoryOptions = [
  { value: 'Xl plants', label: 'Xl plants' },
  { value: 'BestSellers', label: 'BestSellers' },
  { value: 'Easy To Care', label: 'Easy To Care' },
  { value: 'Indoor Plants', label: 'Indoor Plants' },
  { value: 'Outdoor Plants', label: 'Outdoor Plants' },
  { value: 'Plant Care', label: 'Pots & Tools' },
  { value: 'Seeds', label: 'Seeds' },
];

const CategorySelector = ({ selectedCategory, setSelectedCategory }) => {
  const handleChange = (option) => {
    setSelectedCategory(option?.value || '');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
      <Select
        options={categoryOptions}
        value={categoryOptions.find(opt => opt.value === selectedCategory) || null}
        onChange={handleChange}
        placeholder="Select a category"
        classNamePrefix="select"
      />
    </div>
  );
};

export default CategorySelector;
