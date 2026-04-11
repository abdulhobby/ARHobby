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
  tags: [String],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save middleware
productSchema.pre('save', function() {
  if (this.isNew || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  }

  if (this.isModified('stock') || this.isNew) {
    this.stockStatus = this.stock <= 0 ? 'Out of Stock' : 'In Stock';
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

// ✅ IMPORTANT: Indexes for performance and proper sorting
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ 'seo.metaTitle': 'text', 'seo.metaKeywords': 'text' });

// ✅ CRITICAL FIX: Compound index for default sorting (newest first)
productSchema.index({ createdAt: -1, _id: -1 });
productSchema.index({ isActive: 1, createdAt: -1, _id: -1 }); // For active products
productSchema.index({ isFeatured: -1, createdAt: -1, _id: -1 }); // For featured products
productSchema.index({ category: 1, isActive: 1, createdAt: -1, _id: -1 }); // For category filtering

export default mongoose.model('Product', productSchema);