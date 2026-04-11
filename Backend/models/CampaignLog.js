// models/CampaignLog.js
import mongoose from 'mongoose';

const campaignLogSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewsletterSubscriber',
      required: true
    },
    email: String,
    status: {
      type: String,
      enum: ['pending', 'sent', 'opened', 'clicked', 'failed', 'bounced'],
      default: 'pending'
    },
    sentAt: Date,
    openedAt: Date,
    clickedAt: Date,
    failureReason: String
  },
  { timestamps: true }
);

campaignLogSchema.index({ campaign: 1, subscriber: 1 });
campaignLogSchema.index({ status: 1 });

export default mongoose.model('CampaignLog', campaignLogSchema);