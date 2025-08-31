// CategoryMultiSelector.jsx
import React from "react";

const CategoryMultiSelector = ({ selectedCategories, setSelectedCategories }) => {
  const categories = [
    "XL Plants",
    "BestSellers",
    "Easy To Care",
    "Indoor Plants",
    "Outdoor Plants",
    "Plant Care",
    "Seeds",
  ];

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="font-semibold text-green-700 mb-2">Select Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => toggleCategory(cat)}
            className={`px-3 py-1 rounded-full border text-sm transition ${
              selectedCategories.includes(cat)
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryMultiSelector;
