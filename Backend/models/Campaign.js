// models/Campaign.js
import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
      maxlength: [100, 'Title must not exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
      maxlength: [2000, 'Description must not exceed 2000 characters']
    },
    subject: {
      type: String,
      required: [true, 'Email subject is required'],
      maxlength: [200, 'Subject must not exceed 200 characters']
    },
    type: {
      type: String,
      enum: ['promotional', 'announcement', 'newsletter', 'product-showcase'],
      default: 'promotional'
    },
    products: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      featured: Boolean
    }],
    bannerImage: {
      url: String,
      publicId: String
    },
    recipients: {
      type: Number,
      default: 0
    },
    sent: {
      type: Number,
      default: 0
    },
    opened: {
      type: Number,
      default: 0
    },
    clicked: {
      type: Number,
      default: 0
    },
    scheduleDate: {
      type: Date,
      default: null
    },
    sendImmediately: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sending', 'sent', 'cancelled'],
      default: 'draft'
    },
    targetSegment: {
      type: String,
      enum: ['all', 'active', 'inactive', 'custom'],
      default: 'all'
    },
    customEmails: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Index for better performance
campaignSchema.index({ status: 1, createdAt: -1 });
campaignSchema.index({ createdBy: 1 });

export default mongoose.model('Campaign', campaignSchema);