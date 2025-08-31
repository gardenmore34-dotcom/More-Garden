import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react'; // or use your own icon set
import {createReview} from '../api/reviewAPI'; // Adjust the import path as needed

const WriteReviewForm = ({ productId, userId }) => {
  const [showForm, setShowForm] = useState(false);
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const reviewData = {
          rating,
          title,
          comment,
          productId,
          userId,

        };
        console.log(reviewData);

        const response =  await createReview(reviewData);
        // Reset form fields
        setRating(0);
        setTitle('');
        setComment('');
      } catch (error) {
        console.error('Error submitting review:', error);
      }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mt-8">
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-5 py-2 bg-[#b17856] text-white rounded-full font-medium hover:bg-[#9e6342] transition"
      >
        {showForm ? 'Cancel Review' : 'Write a review'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 animate-fade-in flex flex-col gap-4">
          {/* Rating Stars */}
          <div className="text-center">
            <p className="font-medium mb-2">Rating</p>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => {
                const starVal = i + 1;
                return (
                  <Star
                    key={i}
                    size={28}
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHover(starVal)}
                    onMouseLeave={() => setHover(0)}
                    className={`cursor-pointer transition ${
                      (hover || rating) >= starVal ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your review a title"
            className="border px-4 py-2 rounded-md shadow-sm w-full focus:ring-green-500 focus:outline-none"
          />

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comments here"
            className="border px-4 py-2 rounded-md shadow-sm w-full min-h-[100px] focus:ring-green-500 focus:outline-none"
          />

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WriteReviewForm;
