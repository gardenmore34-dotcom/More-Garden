import React, { useEffect, useState } from 'react';
import { getCategories } from '../api/categoryApi';

const CategoryCard = ({ image, title }) => {
  return (
    <div className="flex flex-col items-center bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300 cursor-pointer">
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4 text-center font-medium text-lg text-gray-800 truncate">
        {title}
      </div>
    </div>
  );
};

const CategorySection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories');
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Elegant Self-Watering Pots for Every Space
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              image={category.imageUrl}
              title={category.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
