import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../api/categoryApi';
import { useNavigate } from 'react-router-dom';

const CategoryCardsSection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="relative md:px-12 py-10 bg-gradient-to-br from-green-50 to-white rounded-xl overflow-hidden max-w-[1600px] mx-auto">
      {/* Stylish Heading */}
      

      {/* Scrollable Row */}
      <div className="flex gap-6 md:gap-8 overflow-x-auto pb-2 pr-20 scrollbar-hide snap-x scroll-smooth">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className="min-w-[120px] md:min-w-[140px] snap-start cursor-pointer flex flex-col items-center transition-transform hover:scale-105"
          >
            <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden shadow-lg border-2 border-green-100 bg-white">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm md:text-base text-center mt-3 font-semibold text-gray-700 capitalize leading-tight">
              {cat.name}
            </p>
          </div>
        ))}

        {/* Right Padding Spacer */}
        <div className="min-w-[40px] md:min-w-[80px]"></div>
      </div>

      {/* Faded edge effect */}
      <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  );
};

export default CategoryCardsSection;