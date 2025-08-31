import React from 'react';

const CategoryCard = ({ image, title }) => {
  return (
    <div className="flex flex-col items-center min-w-[120px] cursor-pointer hover:scale-105 transition">
      <img src={image} alt={title} loading="lazy" className="w-24 h-24 object-cover rounded-full mb-2 shadow" />
      <p className="text-center text-sm font-medium text-gray-700">{title}</p>
    </div>
  );
};

export default CategoryCard;
