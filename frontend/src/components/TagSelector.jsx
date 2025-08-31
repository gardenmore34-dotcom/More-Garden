import React from 'react';
import Select from 'react-select';

const options = [
  'Indoor', 'Outdoor', 'Flowering', 'Low Maintenance',
  'Air Purifying', 'Medicinal', 'Decorative'
].map(tag => ({ value: tag, label: tag }));

const TagSelector = ({ selectedTags = [], setSelectedTags }) => {
  const handleChange = (selected) => {
    const tags = selected.map(option => option.value);
    setSelectedTags(tags);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
      <Select
        options={options}
        isMulti
        value={options.filter(opt => selectedTags?.includes(opt.value))}
        onChange={handleChange}
        classNamePrefix="select"
      />
    </div>
  );
};

export default TagSelector;
