// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  // SEO Fields
  seo: {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'Meta title should be less than 70 characters'],
      default: function() {
        return this.name;
      }
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description should be less than 160 characters'],
      default: function() {
        return this.description?.substring(0, 160);
      }
    },
    metaKeywords: {
      type: [String],
      default: []
    },
    ogTitle: {
      type: String,
      trim: true
    },
    ogDescription: {
      type: String,
      trim: true
    },
    ogImage: {
      type: String,
      trim: true
    },
    canonicalUrl: {
      type: String,
      trim: true
    },
    schemaMarkup: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  images: [{
    public_id: { type: String, required: true },
    url: { type: String, required: true }
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  country: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    trim: true
  },
  condition: {
    type: String,
    enum: ['Uncirculated', 'Extremely Fine', 'Very Fine', 'Fine', 'Very Good', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  denomination: {
    type: String,
    trim: true
  },
  material: {
    type: String,
    trim: true
  },
  weight: {
    type: String,
    trim: true
  },
  dimensions: {
    type: String,
    trim: true
  },
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Extremely Rare'],
    default: 'Common'
  },
  additionalInfo: {
    type: String,
    maxlength: [2000, 'Additional info cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  stock: {
    type: Number,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isNew: {
    type: Boolean,
    default: false
  },
  // ✅ NEW: Track when product was marked as new
  newMarkedAt: {
    type: Date,
    default: null
  },
  tags: [String],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// ✅ Virtual property to check if product is still new (within 48 hours)
productSchema.virtual('isNewValid').get(function() {
  if (!this.isNew) return false;
  if (!this.newMarkedAt) return false;
  
  const now = new Date();
  const hoursSinceMarked = (now - this.newMarkedAt) / (1000 * 60 * 60);
  return hoursSinceMarked <= 48; // 48 hours expiration
});

// ✅ Virtual property to get remaining new time in hours
productSchema.virtual('newRemainingHours').get(function() {
  if (!this.isNew || !this.newMarkedAt) return 0;
  
  const now = new Date();
  const hoursSinceMarked = (now - this.newMarkedAt) / (1000 * 60 * 60);
  const remaining = 48 - hoursSinceMarked;
  return remaining > 0 ? Math.floor(remaining) : 0;
});

// ✅ Virtual property to get formatted remaining time
productSchema.virtual('newRemainingTime').get(function() {
  const hours = this.newRemainingHours;
  if (hours <= 0) return 'Expired';
  
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (remainingHours === 0) {
    return `${days} day${days !== 1 ? 's' : ''} remaining`;
  }
  return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''} remaining`;
});

// Pre-save middleware
productSchema.pre('save', function() {
  // Generate slug
  if (this.isNew || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  }

  // Update stock status
  if (this.isModified('stock') || this.isNew) {
    this.stockStatus = this.stock <= 0 ? 'Out of Stock' : 'In Stock';
  }

  // ✅ NEW: When isNew changes from false to true, set newMarkedAt
  if (this.isModified('isNew') && this.isNew === true) {
    this.newMarkedAt = new Date();
  }
  
  // ✅ NEW: When isNew is set to false, clear newMarkedAt
  if (this.isModified('isNew') && this.isNew === false) {
    this.newMarkedAt = null;
  }

  // Auto-generate SEO metadata if not provided
  if (this.isNew || this.isModified('name')) {
    if (!this.seo?.metaTitle) {
      this.seo = this.seo || {};
      this.seo.metaTitle = this.name.substring(0, 70);
    }
  }

  if (this.isNew || this.isModified('description')) {
    if (!this.seo?.metaDescription) {
      this.seo = this.seo || {};
      this.seo.metaDescription = this.description?.substring(0, 160);
    }
  }

  // Set OG image to first product image if not set
  if (this.images && this.images.length > 0 && !this.seo?.ogImage) {
    this.seo = this.seo || {};
    this.seo.ogImage = this.images[0].url;
  }
});

// ✅ NEW: Auto-expire old new products (run this as a scheduled job)
productSchema.statics.autoExpireNewProducts = async function() {
  const expiryDate = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const result = await this.updateMany(
    {
      isNew: true,
      newMarkedAt: { $lt: expiryDate }
    },
    {
      $set: { isNew: false }
    }
  );
  return result.modifiedCount;
};

// Generate Product Schema Markup
productSchema.methods.generateSchemaMarkup = function() {
  const baseUrl = process.env.FRONTEND_URL || 'https://yourdomain.com';
  
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": this.name,
    "description": this.description,
    "image": this.images.map(img => img.url),
    "sku": this._id.toString(),
    "mpn": this._id.toString(),
    "brand": {
      "@type": "Brand",
      "name": "Currency Corner"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/products/${this.slug}`,
      "priceCurrency": "INR",
      "price": this.price,
      "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/UsedCondition",
      "availability": this.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Currency Corner"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };
};

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ 'seo.metaTitle': 'text', 'seo.metaKeywords': 'text' });
productSchema.index({ createdAt: -1, _id: -1 });
productSchema.index({ isActive: 1, createdAt: -1, _id: -1 });
productSchema.index({ isFeatured: -1, createdAt: -1, _id: -1 });
productSchema.index({ category: 1, isActive: 1, createdAt: -1, _id: -1 });

// ✅ NEW: Index for efficient new product queries
productSchema.index({ isNew: 1, newMarkedAt: -1 });
productSchema.index({ isActive: 1, isNew: 1, newMarkedAt: -1 });

export default mongoose.model('Product', productSchema);