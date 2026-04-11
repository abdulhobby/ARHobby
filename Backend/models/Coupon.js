import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Coupon type is required']
  },
  value: {
    type: Number,
    required: [true, 'Coupon value is required'],
    min: [0, 'Value cannot be negative']
  },
  minOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  maxDiscount: {
    type: Number,
    min: [0, 'Max discount cannot be negative']
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  perUserLimit: {
    type: Number,
    default: 1
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

couponSchema.methods.isValid = function(userId, orderAmount) {
  const now = new Date();

  if (!this.isActive) {
    return { valid: false, message: 'Coupon is not active' };
  }
  if (now < this.startDate) {
    return { valid: false, message: 'Coupon is not yet valid' };
  }
  if (now > this.endDate) {
    return { valid: false, message: 'Coupon has expired' };
  }
  if (this.usageLimit !== null && this.usageLimit !== undefined && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  if (orderAmount < this.minOrderAmount) {
    return { valid: false, message: `Minimum order amount is ₹${this.minOrderAmount}` };
  }

  if (userId && this.usedBy && this.usedBy.length > 0) {
    const userIdStr = userId.toString();
    const userUsageCount = this.usedBy.filter(id => id.toString() === userIdStr).length;
    if (userUsageCount >= this.perUserLimit) {
      return { valid: false, message: 'You have already used this coupon the maximum number of times' };
    }
  }

  return { valid: true, message: 'Coupon is valid' };
};

couponSchema.methods.calculateDiscount = function(orderAmount) {
  let discount = 0;

  if (this.type === 'percentage') {
    discount = (orderAmount * this.value) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else if (this.type === 'fixed') {
    discount = this.value;
  }

  if (discount > orderAmount) {
    discount = orderAmount;
  }

  return Math.round(discount * 100) / 100;
};

couponSchema.index({ code: 1 });

export default mongoose.model('Coupon', couponSchema);