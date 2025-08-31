import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import PayPopup from "../components/PayPopup";
import { motion } from "framer-motion";
import {
  getUserCart,
  updateCartItem,
  removeCartItem,
} from "../api/cartAPI";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isPayPopupOpen, setIsPayPopupOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getUserCart(userId);
        const items = res?.data?.items || res?.items || [];
        const populatedItems = items.map((item) => ({
          _id: item.productId?._id || item._id,
          name: item.productId?.name || "Unknown Product",
          description: item.productId?.description || "",
          price: item.productId?.price || 0,
          discountPrice: item.productId?.discountPrice || 0,
          images: item.productId?.images || [],
          quantity: item.quantity || 1,
        }));
        setCartItems(populatedItems);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    if (userId) fetchCart();
  }, [userId]);

  const total = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.discountPrice > 0 ? item.discountPrice : item.price) *
        item.quantity,
    0
  );

  const handleQuantity = async (id, type) => {
    const item = cartItems.find((item) => item._id === id);
    const newQty =
      type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    try {
      await updateCartItem(userId, id, newQty);
      setCartItems((prev) =>
        prev.map((p) => (p._id === id ? { ...p, quantity: newQty } : p))
      );
      toast.success(type === "inc" ? "✅ Increased quantity" : "➖ Decreased quantity");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update cart");
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeCartItem(userId, id);
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      toast.error("🗑️ Removed from cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBF7] px-4 py-10 md:px-16">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-3xl font-bold text-green-800 mb-6">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition"
            >
              {/* 📱 Mobile: image left, info right */}
              <div className="flex w-full flex-row md:flex-row items-center md:items-start gap-4">
                {/* Image */}
                <img
                  src={item.images?.[0]?.url || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover"
                />

                {/* Info Section */}
                <div className="flex-1">
                  <h2 className="text-base md:text-lg font-semibold text-green-800">
                    {item.name}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="text-sm mt-1 text-gray-600">
                    Price:{" "}
                    <span className="text-green-700 font-medium">
                      ₹{item.discountPrice > 0 ? item.discountPrice : item.price}
                    </span>
                  </div>

                  {/* Counter */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleQuantity(item._id, "dec")}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantity(item._id, "inc")}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price + Remove */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <span className="text-green-800 font-semibold">
                  ₹
                  {(item.discountPrice > 0 ? item.discountPrice : item.price) *
                    item.quantity}
                </span>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Total Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-right mt-8"
          >
            <h3 className="text-2xl font-bold text-green-800">
              Total: ₹{total.toFixed(2)}
            </h3>
            <button
              onClick={() => setIsPayPopupOpen(true)}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
            >
              Proceed to Payment
            </button>
            <PayPopup
              isOpen={isPayPopupOpen}
              onClose={() => setIsPayPopupOpen(false)}
              cartItems={cartItems}
              total={total}
              userId={userId}
              onSuccess={() => {
                setCartItems([]);
                setIsPayPopupOpen(false);
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
