// controllers/subscriberController.js
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import Papa from 'papaparse';

// ==================== SUBSCRIBE ====================

export const subscribe = async (req, res) => {
  try {
    const { email, name, phone, preferences } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    let subscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });

    if (subscriber) {
      if (subscriber.status === 'unsubscribed') {
        subscriber.status = 'active';
        subscriber.preferences = preferences || subscriber.preferences;
        subscriber.unsubscribedAt = null;
        await subscriber.save();
        return res.status(200).json({
          success: true,
          message: 'You have been re-subscribed successfully'
        });
      }
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }

    subscriber = new NewsletterSubscriber({
      email: email.toLowerCase(),
      name: name || '',
      phone: phone || '',
      preferences: preferences || {
        promotional: true,
        announcements: true,
        newsletter: true,
        productUpdates: true
      },
      source: 'website'
    });

    await subscriber.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UNSUBSCRIBE ====================

export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const subscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE PREFERENCES ====================

export const updatePreferences = async (req, res) => {
  try {
    const { email, preferences } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const subscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }

    subscriber.preferences = { ...subscriber.preferences, ...preferences };
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: subscriber.preferences
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET ALL SUBSCRIBERS ====================

export const getAllSubscribers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'active';
    const search = req.query.search;

    let filter = { status };

    if (search) {
      filter = {
        ...filter,
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const total = await NewsletterSubscriber.countDocuments(filter);
    const subscribers = await NewsletterSubscriber.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      subscribers,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== BULK IMPORT ====================

export const bulkImportSubscribers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'CSV file is required' });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const errors = [];
          const imported = [];
          const duplicates = [];

          for (const row of results.data) {
            const email = row.email?.toLowerCase().trim();
            const name = row.name?.trim() || '';
            const phone = row.phone?.trim() || '';

            // Validation
            if (!email) {
              errors.push({ row: row, error: 'Email is required' });
              continue;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              errors.push({ row: row, error: 'Invalid email format' });
              continue;
            }

            // Check if already exists
            const exists = await NewsletterSubscriber.findOne({ email });

            if (exists) {
              duplicates.push(email);
              continue;
            }

            try {
              const subscriber = new NewsletterSubscriber({
                email,
                name,
                phone,
                source: 'import',
                status: 'active'
              });
              await subscriber.save();
              imported.push(email);
            } catch (error) {
              errors.push({ row: row, error: error.message });
            }
          }

          res.status(200).json({
            success: true,
            imported: imported.length,
            duplicates: duplicates.length,
            errors: errors.length,
            details: {
              imported,
              duplicates,
              errors
            },
            message: `Imported ${imported.length} subscribers, ${duplicates.length} duplicates, ${errors.length} errors`
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      },
      error: (error) => {
        res.status(400).json({ success: false, message: 'CSV parsing error: ' + error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADD SINGLE SUBSCRIBER ====================

export const addSingleSubscriber = async (req, res) => {
  try {
    const { email, name, phone } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const exists = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });

    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }

    const subscriber = new NewsletterSubscriber({
      email: email.toLowerCase(),
      name: name || '',
      phone: phone || '',
      source: 'import'
    });

    await subscriber.save();

    res.status(201).json({
      success: true,
      subscriber,
      message: 'Subscriber added successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== DELETE SUBSCRIBER ====================

export const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== EXPORT SUBSCRIBERS ====================

export const exportSubscribers = async (req, res) => {
  try {
    const status = req.query.status || 'active';
    
    const subscribers = await NewsletterSubscriber.find({ status }).select('email name phone createdAt');

    const csv = [
      ['Email', 'Name', 'Phone', 'Subscribed Date'],
      ...subscribers.map(s => [
        s.email,
        s.name,
        s.phone,
        s.createdAt.toISOString().split('T')[0]
      ])
    ].map(row => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="subscribers_${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET SUBSCRIBER STATS ====================

export const getSubscriberStats = async (req, res) => {
  try {
    const stats = {
      totalSubscribers: await NewsletterSubscriber.countDocuments(),
      activeSubscribers: await NewsletterSubscriber.countDocuments({ status: 'active' }),
      inactiveSubscribers: await NewsletterSubscriber.countDocuments({ status: 'inactive' }),
      unsubscribed: await NewsletterSubscriber.countDocuments({ status: 'unsubscribed' }),
      totalBySource: {
        website: await NewsletterSubscriber.countDocuments({ source: 'website' }),
        import: await NewsletterSubscriber.countDocuments({ source: 'import' }),
        registration: await NewsletterSubscriber.countDocuments({ source: 'registration' }),
        checkout: await NewsletterSubscriber.countDocuments({ source: 'checkout' })
      }
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};