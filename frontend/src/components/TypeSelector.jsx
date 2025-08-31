import React from "react";
import Select from "react-select";

const typeOptions = [
  "Plants",
  "Seeds",
  "Tools",
  "Fertilizers",
  "Pots"
].map((value) => ({ value, label: value }));

const TypeSelector = ({ selectedType = "", setSelectedType }) => {
  const handleChange = (selected) => {
    setSelectedType(selected ? selected.value : ""); // send string instead of array
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
      <Select
        options={typeOptions}
        isClearable
        value={typeOptions.find((opt) => opt.value === selectedType) || null}
        onChange={handleChange}
        classNamePrefix="select"
      />
    </div>
  );
};

export default TypeSelector;
