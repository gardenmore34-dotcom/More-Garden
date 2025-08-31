import Order from '../models/Order.js';



export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const { range = 'all' } = req.query;
    let startDate;

    switch (range) {
      case '1m':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3m':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '1y':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = null;
    }

    const query = startDate ? { createdAt: { $gte: startDate } } : {};
    const orders = await Order.find(query).populate('userId', 'name email');

    res.json({ success: true, orders });
  } catch (err) {
    console.error('❌ Admin fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
