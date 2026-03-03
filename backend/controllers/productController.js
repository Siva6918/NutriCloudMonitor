import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Log activity if regular user is authenticated (admins don't have req.user.userId)
    if (req.user && req.user.userId) {
      await ActivityLog.create({
        userId: req.user.userId,
        action: 'view_product',
        details: { filter },
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Log activity if regular user is authenticated
    if (req.user && req.user.userId) {
      await ActivityLog.create({
        userId: req.user.userId,
        action: 'view_product',
        details: { productId: product._id, productName: product.name },
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
