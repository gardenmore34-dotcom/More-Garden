import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogBySlug } from '../api/blogAPI';
import { PortableText } from '@portabletext/react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlogBySlug(slug).then(setBlog);
  }, [slug]);

  if (!blog) {
    return <div className="text-center py-20 text-gray-600 text-lg">Loading your garden story...</div>;
  }

  return (
    <>
      <SEO title={blog?.title} description={blog?.excerpt || blog?.title} />

      <section className="bg-gradient-to-b from-[#e9f9ee] to-white min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">

          <motion.div
            className="bg-white shadow-2xl rounded-3xl p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={blog.mainImage?.asset?.url}
              alt={blog.title}
              className="rounded-lg w-full h-72 object-cover mb-8"
            />

            <h1 className="text-4xl font-bold text-green-800 mb-4 leading-snug">{blog.title}</h1>
            <p className="text-sm text-gray-500 mb-6 italic">
              Published on {new Date(blog.publishedAt).toLocaleDateString()}
            </p>

            <div className="prose prose-green prose-lg max-w-none">
              <PortableText value={blog.body} />
            </div>
          </motion.div>

          <div className="text-center mt-10">
            <Link
              to="/blog"
              className="inline-block bg-green-600 text-white py-2 px-6 rounded-full shadow hover:bg-green-700 transition"
            >
              ← Back to Blog List
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetail;
