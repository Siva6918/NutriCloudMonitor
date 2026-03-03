import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import ActivityLog from '../models/ActivityLog.js';

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Please provide shipping address' });
    }

    const cart = await Cart.findOne({ userId: req.user.userId }).populate(
      'items.productId'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const validItems = cart.items.filter(item => item.productId != null);

    if (validItems.length === 0) {
      return res.status(400).json({ message: 'Cart has no valid items' });
    }

    const items = validItems.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      userId: req.user.userId,
      items,
      totalAmount,
      shippingAddress,
    });

    // Detect Rapid Checkout Activity (Behavioral SOC Event)
    const recentOrders = await ActivityLog.countDocuments({
      userId: req.user.userId,
      action: { $in: ['checkout', 'RAPID_REQUESTS'] },
      createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 mins
    });

    const actionType = recentOrders >= 3 ? 'RAPID_REQUESTS' : 'checkout';

    // Log activity
    await ActivityLog.create({
      userId: req.user.userId,
      action: actionType,
      details: {
        orderId: order._id,
        totalAmount,
        itemCount: items.length,
        velocityWarning: recentOrders >= 3
      },
    });

    // Clear cart
    await Cart.updateOne({ userId: req.user.userId }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
