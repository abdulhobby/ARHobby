import Cart from '../../models/Cart.js';
import User from '../../models/User.js';
import Product from '../../models/Product.js';

// Get all carts with pagination and filters
export const getAllCarts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || 'all';

    let query = {};
    
    if (search) {
      // Find users matching search term
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(u => u._id);
      query.user = { $in: userIds };
    }

    if (status === 'empty') {
      query['items.0'] = { $exists: false };
    } else if (status === 'non-empty') {
      query['items.0'] = { $exists: true };
    }

    const carts = await Cart.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name images price stock stockStatus slug')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Cart.countDocuments(query);
    const totalValue = await Cart.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.status(200).json({
      success: true,
      carts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        totalCarts: total,
        totalCartValue: totalValue[0]?.total || 0,
        emptyCarts: await Cart.countDocuments({ 'items.0': { $exists: false } }),
        nonEmptyCarts: await Cart.countDocuments({ 'items.0': { $exists: true } })
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single cart by user ID
export const getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOne({ user: userId })
      .populate('user', 'name email')
      .populate('items.product', 'name images price stock stockStatus slug');
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }
    
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get cart activity/analytics
export const getCartAnalytics = async (req, res) => {
  try {
    // Get carts with most items
    const mostItemsCarts = await Cart.aggregate([
      { $project: { user: 1, totalItems: 1, totalPrice: 1, updatedAt: 1 } },
      { $sort: { totalItems: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      { $project: { user: { name: '$userInfo.name', email: '$userInfo.email' }, totalItems: 1, totalPrice: 1, updatedAt: 1 } }
    ]);

    // Get carts with highest value
    const highestValueCarts = await Cart.aggregate([
      { $project: { user: 1, totalItems: 1, totalPrice: 1, updatedAt: 1 } },
      { $sort: { totalPrice: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      { $project: { user: { name: '$userInfo.name', email: '$userInfo.email' }, totalItems: 1, totalPrice: 1, updatedAt: 1 } }
    ]);

    // Recently updated carts
    const recentlyUpdated = await Cart.find()
      .populate('user', 'name email')
      .sort({ updatedAt: -1 })
      .limit(10);

    // Most popular products in carts
    const popularProducts = await Cart.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', totalQuantity: { $sum: '$items.quantity' }, cartCount: { $sum: 1 } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      { $project: { product: { name: '$productInfo.name', price: '$productInfo.price' }, totalQuantity: 1, cartCount: 1 } }
    ]);

    // Abandoned carts (not updated in last 7 days with items)
    const abandonedCarts = await Cart.countDocuments({
      'items.0': { $exists: true },
      updatedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      success: true,
      analytics: {
        mostItemsCarts,
        highestValueCarts,
        recentlyUpdated,
        popularProducts,
        abandonedCarts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item from user's cart (admin)
export const adminRemoveFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }
    
    const itemExists = cart.items.some(item => item.product.toString() === productId);
    if (!itemExists) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    cart.calculateTotals();
    await cart.save();
    
    // Get user info for response
    const user = await User.findById(userId).select('name email');
    
    res.status(200).json({ 
      success: true, 
      cart,
      message: `Item removed from ${user.name}'s cart successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update item quantity in user's cart (admin)
export const adminUpdateCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items available in stock` });
    }
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }
    
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;
    cart.calculateTotals();
    await cart.save();
    await cart.populate('items.product', 'name images price stock stockStatus');
    
    res.status(200).json({ 
      success: true, 
      cart,
      message: 'Cart item quantity updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear entire cart for a user (admin)
export const adminClearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }
    
    cart.items = [];
    cart.calculateTotals();
    await cart.save();
    
    const user = await User.findById(userId).select('name email');
    
    res.status(200).json({ 
      success: true, 
      message: `${user.name}'s cart has been cleared successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete cart (admin)
export const adminDeleteCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOneAndDelete({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Cart deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export carts to CSV
export const exportCarts = async (req, res) => {
  try {
    const carts = await Cart.find({ 'items.0': { $exists: true } })
      .populate('user', 'name email')
      .populate('items.product', 'name');
    
    const csvData = [];
    
    carts.forEach(cart => {
      cart.items.forEach(item => {
        csvData.push({
          'User Name': cart.user?.name || 'N/A',
          'User Email': cart.user?.email || 'N/A',
          'Product Name': item.product?.name || 'N/A',
          'Quantity': item.quantity,
          'Price per Unit': item.price,
          'Total Item Price': item.price * item.quantity,
          'Cart Total': cart.totalPrice,
          'Last Updated': cart.updatedAt.toISOString()
        });
      });
    });
    
    res.status(200).json({ success: true, data: csvData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};