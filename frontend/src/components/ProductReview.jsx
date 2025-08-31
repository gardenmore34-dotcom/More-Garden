import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { getProductReviews } from '../api/reviewAPI';
import WriteReviewForm from './ReviewForm';

const ProductReviews = ({ productId, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getProductReviews(productId);
        const { reviews, breakdown, averageRating, totalReviews } = res;
        setReviews(reviews);
        setBreakdown(breakdown);
        setAverage(averageRating);
        setTotal(totalReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, [productId]);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === 'highest') return b.rating - a.rating;
    if (sort === 'lowest') return a.rating - b.rating;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-green-100 shadow mt-14 border border-green-100">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">🌿 Customer Reviews</h2>

      <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-8">
        {/* Stats Section */}
        <div className="flex flex-col justify-center items-center md:items-start">
          <p className="text-2xl font-bold text-green-700">⭐ {Number(average || 0).toFixed(2)} / 5</p>
          <p className="text-sm text-gray-600">Based on {total} review{total !== 1 ? 's' : ''}</p>
        </div>

        {/* Breakdown Section */}
        <div className="w-full md:w-2/3 space-y-1">
          {breakdown.map((item) => (
            <div key={item.stars} className="flex items-center text-sm text-gray-700 gap-2">
              <span className="w-5 text-right font-medium">{item.stars}</span>
              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.count / total) * 100}%` }}
                ></div>
              </div>
              <span className="w-6 text-right text-gray-500">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Form */}
      <WriteReviewForm productId={productId} userId={userId} />

      {/* Sorting */}
      <div className="flex justify-end mb-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-green-300 text-sm px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <p className="text-center text-gray-400 italic">No reviews yet. Be the first to share your thoughts 🌱</p>
        ) : (
          sortedReviews.map((review) => {
            const initials = review.userId?.name
              ? review.userId.name.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
              : 'U';

            return (
              <div
                key={review._id}
                className="border border-gray-200 bg-green-50 p-5 rounded-xl shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(review.createdAt), 'dd MMM yyyy')}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <div className="bg-green-700 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-green-800 font-medium">{review.userId?.name || 'Anonymous'}</p>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-green-900 mt-3">{review.title}</h3>    
                <p className="text-gray-700 mt-3 leading-relaxed">{review.comment}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
