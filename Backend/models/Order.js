import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  shippingCharge: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  coupon: {
    code: {
      type: String,
      default: null
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: null
    },
    value: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    }
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Received', 'Verified', 'Failed'],
    default: 'Pending'
  },
  paymentProof: {
    public_id: String,
    url: String
  },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Processing', 'Shipped', 'In Transit', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Placed'
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  trackingUrl: {
    type: String,
    trim: true
  },
  invoice: {
    public_id: String,
    url: String
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  termsAccepted: {
    type: Boolean,
    required: [true, 'You must accept terms and conditions'],
    default: false
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String
  }],
  isViewed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

orderSchema.pre('save', function () {
  if (this.isNew && !this.orderNumber) {

    const year = new Date().getFullYear().toString().slice(-2);

    const random = Math.random().toString().slice(2, 7); // 5 digits

    this.orderNumber = `ORD${year}${random}`;
  }
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ isViewed: 1 });

export default mongoose.model('Order', orderSchema);