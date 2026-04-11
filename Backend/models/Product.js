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
    required: [true, 'Stock is required'],
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
  tags: [String],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

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

  // next();
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

export default mongoose.model('Product', productSchema);