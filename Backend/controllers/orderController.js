import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';
import invoiceService from '../services/invoiceService.js';
import emailService from '../services/emailService.js';
import trackingService from '../services/trackingService.js';

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, couponCode, notes, termsAccepted } = req.body;

    if (!termsAccepted) {
      return res.status(400).json({ success: false, message: 'You must accept terms and conditions' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone ||
        !shippingAddress.addressLine1 || !shippingAddress.city ||
        !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.product.name}" is no longer available`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images.length > 0 ? product.images[0].url : '',
        price: product.price,
        quantity: item.quantity
      });

      subtotal += product.price * item.quantity;
    }

    let discount = 0;
    let couponData = {};

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        const validation = coupon.isValid(req.user._id, subtotal);
        if (validation.valid) {
          discount = coupon.calculateDiscount(subtotal);
          couponData = {
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            discount
          };
          coupon.usedCount += 1;
          coupon.usedBy.push(req.user._id);
          await coupon.save();
        }
      }
    }

    const shippingCharge = subtotal >= 1000 ? 0 : 80;
    const totalAmount = subtotal - discount + shippingCharge;

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      discount,
      shippingCharge,
      totalAmount,
      coupon: couponData,
      notes,
      termsAccepted,
      statusHistory: [{ status: 'Placed', note: 'Order placed by customer' }]
    });

    await order.save();

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      if (product.stock <= 0) {
        product.stock = 0;
        product.stockStatus = 'Out of Stock';
      }
      await product.save({ validateBeforeSave: false });
    }

    cart.items = [];
    cart.calculateTotals();
    await cart.save();

    const user = await User.findById(req.user._id);

    try {
      const invoiceBuffer = await invoiceService.generateInvoice(order, user);
      const invoiceResult = await invoiceService.uploadInvoiceToCloudinary(invoiceBuffer, order.orderNumber);
      order.invoice = invoiceResult;
      await order.save({ validateBeforeSave: false });
      
      // Send email using Brevo
      await emailService.sendOrderConfirmation(order, user, invoiceBuffer);
    } catch (invoiceError) {
      console.error('❌ Invoice/Email error:', invoiceError.message);
    }

    await order.populate('user', 'name email');

    res.status(201).json({
      success: true,
      order,
      bankDetails: {
        bankName: process.env.STORE_BANK_NAME,
        accountNumber: process.env.STORE_ACCOUNT_NUMBER,
        ifsc: process.env.STORE_IFSC,
        accountHolder: process.env.STORE_ACCOUNT_HOLDER,
        upi: process.env.STORE_UPI,
        whatsapp: process.env.STORE_WHATSAPP
      },
      message: 'Order placed successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      orders,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      order,
      bankDetails: {
        bankName: process.env.STORE_BANK_NAME,
        accountNumber: process.env.STORE_ACCOUNT_NUMBER,
        ifsc: process.env.STORE_IFSC,
        accountHolder: process.env.STORE_ACCOUNT_HOLDER,
        upi: process.env.STORE_UPI,
        whatsapp: process.env.STORE_WHATSAPP
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    let trackingInfo = null;
    if (order.trackingNumber) {
      trackingInfo = trackingService.getTrackingInfo(order.trackingNumber);
    }

    res.status(200).json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        trackingNumber: order.trackingNumber,
        statusHistory: order.statusHistory
      },
      trackingInfo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.invoice && order.invoice.url) {
      return res.status(200).json({ success: true, invoiceUrl: order.invoice.url });
    }

    const user = await User.findById(order.user._id);
    const invoiceBuffer = await invoiceService.generateInvoice(order, user);
    const invoiceResult = await invoiceService.uploadInvoiceToCloudinary(invoiceBuffer, order.orderNumber);
    order.invoice = invoiceResult;
    await order.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, invoiceUrl: invoiceResult.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.query.status) filter.orderStatus = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      orders,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, adminNotes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        note: adminNotes || `Status updated to ${orderStatus}`
      });
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
      order.trackingUrl = `https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx`;
    }

    if (adminNotes) order.adminNotes = adminNotes;

    await order.save({ validateBeforeSave: false });

    const user = await User.findById(order.user);
    if (user) {
      try {
        // Send email using Brevo
        await emailService.sendOrderStatusUpdate(order, user);
      } catch (emailErr) {
        console.error('❌ Status email error:', emailErr.message);
      }
    }

    await order.populate('user', 'name email phone');

    res.status(200).json({ success: true, order, message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNewOrders = async (req, res) => {
  try {
    console.log('🔥 getNewOrders called');

    const newOrders = await Order.find({ isViewed: false })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    const count = await Order.countDocuments({ isViewed: false });

    res.status(200).json({ success: true, orders: newOrders, count });

  } catch (error) {
    console.error('❌ REAL ERROR:', error); // 🔥 THIS IS KEY

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const markOrderViewed = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { isViewed: true });
    res.status(200).json({ success: true, message: 'Order marked as viewed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllOrdersViewed = async (req, res) => {
  try {
    await Order.updateMany({ isViewed: false }, { isViewed: true });
    res.status(200).json({ success: true, message: 'All orders marked as viewed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStoreInfo = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      storeInfo: {
        name: process.env.STORE_NAME,
        email: process.env.STORE_EMAIL,
        phone: process.env.STORE_PHONE,
        address: process.env.STORE_ADDRESS,
        whatsapp: process.env.STORE_WHATSAPP,
        bankDetails: {
          bankName: process.env.STORE_BANK_NAME,
          accountNumber: process.env.STORE_ACCOUNT_NUMBER,
          ifsc: process.env.STORE_IFSC,
          accountHolder: process.env.STORE_ACCOUNT_HOLDER,
          upi: process.env.STORE_UPI
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};