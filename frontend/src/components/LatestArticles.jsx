import React, { useEffect, useState } from 'react';
import { fetchAllBlogs } from '../api/blogAPI';
import { useNavigate } from 'react-router-dom';
import { urlFor } from '../utils/sanityImageUrl';

const LatestArticles = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await fetchAllBlogs();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-16 bg-white px-4 sm:px-8">
      <h2 className="text-3xl font-bold text-green-900 mb-8 text-center">
        Dive Into Our Garden Journal
      </h2>

      <div className="relative">
        <div className="flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory scrollbar-hide">
          {blogs.map((blog, index) => (
            <div
              key={index}
              onClick={() => navigate(`/blogs/${blog.slug}`)}
              className="min-w-[280px] sm:min-w-[340px] md:min-w-[380px] snap-start cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
            >
              <img
                src={urlFor(blog.mainImage).width(600).height(300).url()}
                alt={blog.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">{new Date(blog.publishedAt).toDateString()}</p>
                <h3 className="text-lg font-semibold text-green-800 hover:underline mt-1 line-clamp-2">
                  {blog.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
