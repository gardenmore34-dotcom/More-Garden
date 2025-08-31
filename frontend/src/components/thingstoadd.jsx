useEffect(() => {
  const fetchCart = async () => {
    const res = await fetch(`/api/cart/${user._id}`);
    const data = await res.json();
    setCartItems(data.items); // Store in context or state
  };
  if (user?._id) fetchCart();
}, [user]);

//fetach the cart items from the backend when logged in