// models/NewsletterSubscriber.js
import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    name: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'unsubscribed', 'bounced'],
      default: 'active'
    },
    source: {
      type: String,
      enum: ['website', 'import', 'registration', 'checkout'],
      default: 'website'
    },
    campaignsReceived: {
      type: Number,
      default: 0
    },
    campaignsOpened: {
      type: Number,
      default: 0
    },
    campaignsClicked: {
      type: Number,
      default: 0
    },
    preferences: {
      promotional: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: true },
      productUpdates: { type: Boolean, default: true }
    },
    tags: [String],
    lastEmailSent: Date,
    unsubscribedAt: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Index for better performance
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ status: 1 });
subscriberSchema.index({ createdAt: -1 });

export default mongoose.model('NewsletterSubscriber', subscriberSchema);