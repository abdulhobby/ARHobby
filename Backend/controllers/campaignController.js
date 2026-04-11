// controllers/campaignController.js
import Campaign from '../models/Campaign.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import CampaignLog from '../models/CampaignLog.js';
import Product from '../models/Product.js';
import emailService from '../services/emailService.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// Helper function to upload buffer to cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

// ==================== GET CAMPAIGNS ====================

export const getAllCampaigns = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let filter = { createdBy: req.user._id };
    if (status) filter.status = status;

    const total = await Campaign.countDocuments(filter);
    const campaigns = await Campaign.find(filter)
      .populate('products.product', 'name price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      campaigns,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('products.product')
      .populate('createdBy', 'name email');

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (campaign.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const logs = await CampaignLog.find({ campaign: campaign._id })
      .populate('subscriber', 'email name');

    res.status(200).json({
      success: true,
      campaign,
      logs,
      stats: {
        totalSent: campaign.sent,
        totalOpened: campaign.opened,
        totalClicked: campaign.clicked,
        openRate: campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(2) : 0,
        clickRate: campaign.sent > 0 ? ((campaign.clicked / campaign.sent) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CREATE CAMPAIGN ====================

export const createCampaign = async (req, res) => {
  try {
    const { title, description, subject, type, sendImmediately, scheduleDate, targetSegment, customEmails } = req.body;
    
    // Parse products if it's a string (from FormData)
    let products = req.body.products;
    if (typeof products === 'string') {
      try {
        products = JSON.parse(products);
      } catch (e) {
        products = [];
      }
    }
    
    // Parse customEmails if it's a string
    let parsedCustomEmails = customEmails;
    if (typeof customEmails === 'string') {
      try {
        parsedCustomEmails = JSON.parse(customEmails);
      } catch (e) {
        parsedCustomEmails = [];
      }
    }

    // Convert sendImmediately to boolean
    const isSendImmediately = sendImmediately === 'true' || sendImmediately === true;

    if (!title || !description || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and subject are required'
      });
    }

    let bannerImage = {};
    
    // Handle file upload to Cloudinary
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'campaigns/banners');
        bannerImage = { url: result.secure_url, publicId: result.public_id };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload banner image: ' + uploadError.message
        });
      }
    }

    const campaign = new Campaign({
      title,
      description,
      subject,
      type,
      products: products || [],
      bannerImage,
      sendImmediately: isSendImmediately,
      scheduleDate: isSendImmediately ? null : scheduleDate,
      status: isSendImmediately ? 'sending' : 'scheduled',
      targetSegment,
      customEmails: parsedCustomEmails || [],
      createdBy: req.user._id
    });

    await campaign.save();
    await campaign.populate('products.product');

    // If send immediately, start sending (don't await - do in background)
    if (isSendImmediately) {
      sendCampaignEmails(campaign).catch(error => {
        console.error('Background email sending error:', error);
      });
    } else if (scheduleDate) {
      // Schedule for later
      scheduleEmailSending(campaign);
    }

    res.status(201).json({
      success: true,
      campaign,
      message: isSendImmediately ? 'Campaign created and sending started' : 'Campaign scheduled successfully'
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE CAMPAIGN ====================

export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (campaign.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft campaigns can be updated'
      });
    }

    const { title, description, subject, type, targetSegment, customEmails } = req.body;
    
    // Parse products if it's a string (from FormData)
    let products = req.body.products;
    if (typeof products === 'string') {
      try {
        products = JSON.parse(products);
      } catch (e) {
        products = campaign.products;
      }
    }
    
    // Parse customEmails if it's a string
    let parsedCustomEmails = customEmails;
    if (typeof customEmails === 'string') {
      try {
        parsedCustomEmails = JSON.parse(customEmails);
      } catch (e) {
        parsedCustomEmails = campaign.customEmails;
      }
    }

    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (subject) campaign.subject = subject;
    if (type) campaign.type = type;
    if (products) campaign.products = products;
    if (targetSegment) campaign.targetSegment = targetSegment;
    if (parsedCustomEmails) campaign.customEmails = parsedCustomEmails;

    // Handle file upload to Cloudinary
    if (req.file) {
      try {
        // Delete old image if exists
        if (campaign.bannerImage?.publicId) {
          await cloudinary.uploader.destroy(campaign.bannerImage.publicId);
        }
        
        const result = await uploadToCloudinary(req.file.buffer, 'campaigns/banners');
        campaign.bannerImage = { url: result.secure_url, publicId: result.public_id };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload banner image: ' + uploadError.message
        });
      }
    }

    await campaign.save();
    await campaign.populate('products.product');

    res.status(200).json({
      success: true,
      campaign,
      message: 'Campaign updated successfully'
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== DELETE CAMPAIGN ====================

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (campaign.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft campaigns can be deleted'
      });
    }

    // Delete image from Cloudinary if exists
    if (campaign.bannerImage?.publicId) {
      try {
        await cloudinary.uploader.destroy(campaign.bannerImage.publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
      }
    }

    await Campaign.findByIdAndDelete(req.params.id);
    await CampaignLog.deleteMany({ campaign: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SEND CAMPAIGN EMAILS ====================

const sendCampaignEmails = async (campaign) => {
  try {
    console.log(`🚀 Starting campaign "${campaign.title}"...`);
    
    let subscribers = [];

    if (campaign.targetSegment === 'all') {
      subscribers = await NewsletterSubscriber.find({ status: 'active' });
    } else if (campaign.targetSegment === 'active') {
      subscribers = await NewsletterSubscriber.find({ status: 'active', lastEmailSent: { $exists: true } });
    } else if (campaign.targetSegment === 'inactive') {
      subscribers = await NewsletterSubscriber.find({ status: 'active', lastEmailSent: { $exists: false } });
    } else if (campaign.targetSegment === 'custom') {
      subscribers = await NewsletterSubscriber.find({ email: { $in: campaign.customEmails } });
    }

    if (subscribers.length === 0) {
      console.log(`⚠️ No subscribers found for campaign "${campaign.title}"`);
      campaign.status = 'cancelled';
      campaign.recipients = 0;
      await campaign.save();
      return;
    }

    campaign.recipients = subscribers.length;
    campaign.status = 'sending';
    await campaign.save();

    console.log(`📧 Found ${subscribers.length} subscribers for campaign`);

    // Get products for email
    const productIds = campaign.products.map(p => p.product);
    const products = await Product.find({ _id: { $in: productIds } });
    console.log(`📦 Found ${products.length} products for campaign`);

    let sentCount = 0;
    let failedCount = 0;
    
    for (let i = 0; i < subscribers.length; i++) {
      const subscriber = subscribers[i];
      
      try {
        // Validate subscriber
        if (!subscriber || !subscriber.email) {
          console.error(`❌ Invalid subscriber at index ${i}:`, subscriber);
          failedCount++;
          continue;
        }

        console.log(`📧 [${i + 1}/${subscribers.length}] Sending to: ${subscriber.email}`);

        // Create campaign log
        const log = new CampaignLog({
          campaign: campaign._id,
          subscriber: subscriber._id,
          email: subscriber.email,
          status: 'pending'
        });
        await log.save();

        // Send email
        await emailService.sendCampaignEmail(subscriber, campaign, products);

        // Update log
        log.status = 'sent';
        log.sentAt = new Date();
        await log.save();

        sentCount++;
        campaign.sent = sentCount;
        await campaign.save();
        
        console.log(`✅ [${i + 1}/${subscribers.length}] Sent to ${subscriber.email}`);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to send to ${subscriber?.email || 'unknown'}:`, error.message);
        failedCount++;
        
        try {
          await CampaignLog.updateOne(
            { campaign: campaign._id, subscriber: subscriber?._id },
            { status: 'failed', failureReason: error.message }
          );
        } catch (logError) {
          console.error('Failed to update campaign log:', logError);
        }
      }
    }

    campaign.status = 'sent';
    await campaign.save();
    
    console.log(`✅ Campaign "${campaign.title}" completed. Sent: ${sentCount}/${subscribers.length}, Failed: ${failedCount}`);
    
  } catch (error) {
    console.error('❌ Campaign send error:', error);
    try {
      campaign.status = 'cancelled';
      await campaign.save();
    } catch (saveError) {
      console.error('Failed to update campaign status:', saveError);
    }
  }
};

const scheduleEmailSending = (campaign) => {
  const scheduleDate = new Date(campaign.scheduleDate);
  const delay = scheduleDate.getTime() - Date.now();
  
  if (delay > 0) {
    console.log(`📅 Campaign "${campaign.title}" scheduled for ${scheduleDate.toLocaleString()}`);
    setTimeout(() => {
      sendCampaignEmails(campaign);
    }, delay);
  } else if (delay <= 0 && campaign.status === 'scheduled') {
    console.log(`⏰ Schedule date passed for "${campaign.title}", sending immediately`);
    sendCampaignEmails(campaign);
  }
};

// ==================== CAMPAIGN STATS ====================

export const getCampaignStats = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user._id });

    const stats = {
      totalCampaigns: campaigns.length,
      totalSent: campaigns.reduce((sum, c) => sum + (c.sent || 0), 0),
      totalOpened: campaigns.reduce((sum, c) => sum + (c.opened || 0), 0),
      totalClicked: campaigns.reduce((sum, c) => sum + (c.clicked || 0), 0),
      averageOpenRate: campaigns.length > 0
        ? (campaigns.reduce((sum, c) => sum + (c.sent > 0 ? (c.opened / c.sent) : 0), 0) / campaigns.length * 100).toFixed(2)
        : 0,
      campaignsByStatus: {
        draft: campaigns.filter(c => c.status === 'draft').length,
        scheduled: campaigns.filter(c => c.status === 'scheduled').length,
        sent: campaigns.filter(c => c.status === 'sent').length
      }
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('Get campaign stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CANCEL CAMPAIGN ====================

export const cancelCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (!['scheduled', 'sending'].includes(campaign.status)) {
      return res.status(400).json({
        success: false,
        message: 'Only scheduled or sending campaigns can be cancelled'
      });
    }

    campaign.status = 'cancelled';
    await campaign.save();

    res.status(200).json({
      success: true,
      message: 'Campaign cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel campaign error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};