import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from '../api/testimonialAPI';

const testimonialsPerPage = 5;

const AdminTestimonialPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [form, setForm] = useState({
    name: '',
    comment: '',
    rating: 5,
    featured: false,
    avatarFile: null,
    avatarUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [filterRating, setFilterRating] = useState(0);

  const formRef = useRef(null);

  const fetchTestimonials = async () => {
    try {
      const res = await getAllTestimonials();
      setTestimonials(res);
      setFiltered(res);
    } catch (err) {
      toast.error('❌ Failed to fetch testimonials');
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        avatarFile: file,
        avatarUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('comment', form.comment);
      data.append('rating', form.rating);
      data.append('featured', form.featured);

      if (form.avatarFile) {
        data.append('avatar', form.avatarFile);
      }

      if (editingId) {
        await updateTestimonial(editingId, data); // ensure update route accepts FormData
        toast.success('✅ Testimonial updated');
      } else {
        await createTestimonial(data);
        toast.success('✅ Testimonial created');
      }

      setForm({
        name: '',
        comment: '',
        rating: 5,
        featured: false,
        avatarFile: null,
        avatarUrl: '',
      });
      setEditingId(null);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to save testimonial');
    }
  };

  const handleEdit = (t) => {
    setForm({
      name: t.name,
      comment: t.comment,
      rating: t.rating,
      featured: t.featured,
      avatarFile: null,
      avatarUrl: t.avatar,
    });
    setEditingId(t._id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTestimonial(id);
      toast.success('🗑️ Testimonial deleted');
      fetchTestimonials();
    } catch (err) {
      toast.error('❌ Delete failed');
    }
  };

  // Filters
  useEffect(() => {
    let result = [...testimonials];

    if (filterFeatured) {
      result = result.filter((t) => t.featured);
    }

    if (filterRating > 0) {
      result = result.filter((t) => t.rating === filterRating);
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [filterFeatured, filterRating, testimonials]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / testimonialsPerPage);
  const paginatedTestimonials = filtered.slice(
    (currentPage - 1) * testimonialsPerPage,
    currentPage * testimonialsPerPage
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Testimonials</h2>

      {/* FORM */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow"
      >
        <input
          className="border w-full p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        {/* Avatar Upload */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Upload Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block border p-2 rounded w-full"
          />
          {form.avatarUrl && (
            <img
              src={form.avatarUrl}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover border mt-2"
            />
          )}
        </div>

        <textarea
          className="border w-full p-2 rounded"
          placeholder="Comment"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          required
        />

        <label className="text-sm">Rating</label>
        <select
          className="border w-full p-2 rounded"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          <span>Feature this testimonial</span>
        </label>

        <button
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded transition"
          type="submit"
        >
          {editingId ? 'Update Testimonial' : 'Create Testimonial'}
        </button>
      </form>

      {/* Filters */}
      <div className="mt-8 mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filterFeatured}
            onChange={(e) => setFilterFeatured(e.target.checked)}
          />
          <span className="text-sm">Show Only Featured</span>
        </label>

        <select
          value={filterRating}
          onChange={(e) => setFilterRating(Number(e.target.value))}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value={0}>All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>
      </div>

      {/* Testimonials List */}
      <ul className="space-y-6">
        {paginatedTestimonials.map((t) => (
          <li
            key={t._id}
            className={`p-5 rounded-xl border transition shadow hover:shadow-md flex items-start gap-4 ${
              t.featured ? 'bg-green-50 border-green-400' : 'bg-white'
            }`}
          >
            <img
              src={t.avatar}
              alt={t.name}
              className="w-14 h-14 rounded-full object-cover border"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-bold text-green-800">{t.name}</p>
                <div className="text-yellow-500 font-medium">{'⭐'.repeat(t.rating)}</div>
              </div>
              <p className="text-gray-600 italic mt-1">"{t.comment}"</p>
              {t.featured && (
                <span className="text-xs mt-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block">
                  🌟 Featured
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleEdit(t)}
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminTestimonialPage;
