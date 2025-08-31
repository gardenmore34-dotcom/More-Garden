import React, { useEffect, useState } from 'react';
import { fetchAllBlogs } from '../api/blogAPI';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const getBlogs = async () => {
      const data = await fetchAllBlogs();
      setBlogs(data);
    };
    getBlogs();
  }, []);

  return (
    <>
      <SEO title="Our Garden Blog" description="Discover the latest tips, insights, and inspiration on gardening with MyGarden Blog." />

      <section className="bg-[#F0FDF4] min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center text-green-800 mb-10"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🌸 Garden Blog Articles
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform hover:-translate-y-1 duration-300"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={blog.mainImage?.asset?.url}
                  alt={blog.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <Link
                    to={`/blog/${blog.slug.current}`}
                    className="text-sm font-medium text-green-600 hover:text-green-800"
                  >
                    Read more →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogList;
