// controllers/productController.js
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';
import SubCategory from '../models/SubCategory.js';

export const getFilterOptions = async (req, res) => {
  try {
    // Get distinct countries from active products
    const countries = await Product.distinct('country', {
      country: { $ne: null, $ne: '' },
      isActive: true
    });

    // Get distinct materials from active products
    const materials = await Product.distinct('material', {
      material: { $ne: null, $ne: '' },
      isActive: true
    });

    // Get active sub-categories with their names
    const subCategories = await SubCategory.find({ isActive: true })
      .select('name _id slug category')
      .sort({ name: 1 })
      .lean();

    // Get distinct conditions
    const conditions = await Product.distinct('condition', {
      condition: { $ne: null, $ne: '' },
      isActive: true
    });

    res.status(200).json({
      success: true,
      countries: countries.filter(c => c && c.trim()).sort(),
      materials: materials.filter(m => m && m.trim()).sort(),
      subCategories: subCategories || [],
      conditions: conditions.filter(c => c && c.trim()).sort()
    });
  } catch (error) {
    console.error('Error in getFilterOptions:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      countries: [],
      materials: [],
      subCategories: []
    });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 12;
    const page = Number(req.query.page) || 1;

    // Build filter object
    const filter = { isActive: true };

    // Apply category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Apply sub-category filter
    if (req.query.subCategory) {
      filter.subCategories = req.query.subCategory;
    }

    // Apply country filter
    if (req.query.country && req.query.country !== '') {
      filter.country = req.query.country;
    }

    // Apply material filter
    if (req.query.material && req.query.material !== '') {
      filter.material = req.query.material;
    }

    // Apply stock status filter
    if (req.query.stockStatus && req.query.stockStatus !== '') {
      filter.stockStatus = req.query.stockStatus;
    }

    // Apply condition filter
    if (req.query.condition && req.query.condition !== '') {
      filter.condition = req.query.condition;
    }

    // Apply price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Apply search filter
    if (req.query.keyword) {
      filter.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { tags: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    console.log('Applied filters:', JSON.stringify(filter, null, 2));

    // Count total products
    const totalProducts = await Product.countDocuments(filter);

    // Build sort object
    let sortObj = { createdAt: -1, _id: -1 };
    if (req.query.sort) {
      const sortMapping = {
        'price-low-high': { price: 1, _id: 1 },
        'price-high-low': { price: -1, _id: -1 },
        'new-to-old': { createdAt: -1, _id: -1 },
        'old-to-new': { createdAt: 1, _id: 1 },
        'a-z': { name: 1, _id: 1 },
        'z-a': { name: -1, _id: -1 }
      };
      sortObj = sortMapping[req.query.sort] || sortObj;
    }

    // Get products with pagination - explicitly select fields
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('subCategories', 'name slug')
      .select('name slug description price comparePrice images stock stockStatus isFeatured isNew newMarkedAt createdAt category subCategories country material condition') // ✅ Added isNew and newMarkedAt
      .sort(sortObj)
      .limit(resultPerPage)
      .skip((page - 1) * resultPerPage)
      .lean();

    // ✅ Add computed fields to each product
    const productsWithMeta = products.map(product => {
      const now = new Date();
      const markedDate = product.newMarkedAt ? new Date(product.newMarkedAt) : null;
      let remainingHours = 0;
      let isNewValid = false;

      if (product.isNew && markedDate) {
        const hoursSinceMarked = (now - markedDate) / (1000 * 60 * 60);
        remainingHours = Math.max(0, 48 - hoursSinceMarked);
        isNewValid = remainingHours > 0;
      }

      return {
        ...product,
        isNewValid,
        newRemainingHours: Math.floor(remainingHours),
        newRemainingTime: remainingHours > 0
          ? remainingHours < 24
            ? `${Math.floor(remainingHours)}h remaining`
            : `${Math.floor(remainingHours / 24)}d remaining`
          : null
      };
    });

    console.log(`Found ${products.length} products out of ${totalProducts} total`);
    console.log(`Products marked as new: ${productsWithMeta.filter(p => p.isNew).length}`);

    res.status(200).json({
      success: true,
      products: productsWithMeta,
      totalProducts,
      page,
      pages: Math.ceil(totalProducts / resultPerPage),
      resultPerPage
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Updated createProduct with subCategories
export const createProduct = async (req, res) => {
  try {
    const {
      name, description, category, subCategories, country, year, condition,
      denomination, material, weight, dimensions, rarity,
      additionalInfo, price, comparePrice, stock, isFeatured, isNew, tags,
      seoMetaTitle, seoMetaDescription, seoMetaKeywords,
      seoOgTitle, seoOgDescription, seoCanonicalUrl
    } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    // Validate sub-categories if provided
    let subCategoryIds = [];
    if (subCategories) {
      const subCategoryArray = typeof subCategories === 'string'
        ? JSON.parse(subCategories)
        : subCategories;

      if (subCategoryArray && subCategoryArray.length > 0) {
        const validSubCategories = await SubCategory.find({
          _id: { $in: subCategoryArray },
          isActive: true
        });
        subCategoryIds = validSubCategories.map(sc => sc._id);
      }
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'currency-corner/products',
          width: 1200,
          height: 1200,
          crop: 'limit'
        });
        images.push({ public_id: result.public_id, url: result.secure_url });
      }
    }

    // Prepare SEO data
    const seoData = {
      metaTitle: seoMetaTitle || name.substring(0, 70),
      metaDescription: seoMetaDescription || description?.substring(0, 160),
      metaKeywords: seoMetaKeywords ? seoMetaKeywords.split(',').map(k => k.trim()) : [],
      ogTitle: seoOgTitle || name,
      ogDescription: seoOgDescription || description?.substring(0, 160),
      ogImage: images.length > 0 ? images[0].url : '',
      canonicalUrl: seoCanonicalUrl || ''
    };

    const product = await Product.create({
      name, description, images, category, subCategories: subCategoryIds,
      country, year, condition, denomination, material, weight, dimensions, rarity,
      additionalInfo, price, comparePrice,
      stock: stock || 0,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isNew: isNew === 'true' || isNew === true,
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags) : [],
      seo: seoData
    });

    // Generate and save schema markup
    product.seo.schemaMarkup = product.generateSchemaMarkup();
    await product.save();

    await product.populate('category', 'name slug');
    await product.populate('subCategories', 'name slug');

    res.status(201).json({ success: true, product, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Updated updateProduct with subCategories
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name, description, subCategories, country, year, condition,
      denomination, material, weight, dimensions, rarity,
      additionalInfo, price, comparePrice, stock, isFeatured, isActive, isNew, tags,
      seoMetaTitle, seoMetaDescription, seoMetaKeywords,
      seoOgTitle, seoOgDescription, seoCanonicalUrl,
      removeImages
    } = req.body;

    // Update basic fields
    if (name) product.name = name;
    if (description) product.description = description;

    // Update sub-categories
    if (subCategories) {
      const subCategoryArray = typeof subCategories === 'string'
        ? JSON.parse(subCategories)
        : subCategories;

      if (subCategoryArray && subCategoryArray.length > 0) {
        const validSubCategories = await SubCategory.find({
          _id: { $in: subCategoryArray },
          isActive: true
        });
        product.subCategories = validSubCategories.map(sc => sc._id);
      } else {
        product.subCategories = [];
      }
    }

    if (country !== undefined) product.country = country;
    if (year !== undefined) product.year = year;
    if (condition) product.condition = condition;
    if (denomination !== undefined) product.denomination = denomination;
    if (material !== undefined) product.material = material;
    if (weight !== undefined) product.weight = weight;
    if (dimensions !== undefined) product.dimensions = dimensions;
    if (rarity) product.rarity = rarity;
    if (additionalInfo !== undefined) product.additionalInfo = additionalInfo;
    if (price !== undefined) product.price = price;
    if (comparePrice !== undefined) product.comparePrice = comparePrice;
    
    // ✅ Handle stock update - if stock increases from 0 to >0, optionally mark as new
    const oldStock = product.stock;
    if (stock !== undefined) {
      product.stock = stock;
      product.stockStatus = stock > 0 ? 'In Stock' : 'Out of Stock';
    }
    
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;
    
    // ✅ Handle isNew marking - this will automatically reset the timer
    if (isNew !== undefined) {
      product.isNew = isNew === 'true' || isNew === true;
    }
    
    if (tags) product.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

    // Update SEO fields
    if (seoMetaTitle !== undefined) product.seo.metaTitle = seoMetaTitle;
    if (seoMetaDescription !== undefined) product.seo.metaDescription = seoMetaDescription;
    if (seoMetaKeywords !== undefined) {
      product.seo.metaKeywords = typeof seoMetaKeywords === 'string'
        ? seoMetaKeywords.split(',').map(k => k.trim())
        : seoMetaKeywords;
    }
    if (seoOgTitle !== undefined) product.seo.ogTitle = seoOgTitle;
    if (seoOgDescription !== undefined) product.seo.ogDescription = seoOgDescription;
    if (seoCanonicalUrl !== undefined) product.seo.canonicalUrl = seoCanonicalUrl;

    // Handle image removal
    if (removeImages) {
      const imagesToRemove = typeof removeImages === 'string' ? JSON.parse(removeImages) : removeImages;
      for (const publicId of imagesToRemove) {
        await cloudinary.uploader.destroy(publicId);
        product.images = product.images.filter(img => img.public_id !== publicId);
      }
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'currency-corner/products',
          width: 1200,
          height: 1200,
          crop: 'limit'
        });
        product.images.push({ public_id: result.public_id, url: result.secure_url });
      }

      if (!seoOgTitle && !seoOgDescription && product.images.length > 0) {
        product.seo.ogImage = product.images[0].url;
      }
    }

    product.seo.schemaMarkup = product.generateSchemaMarkup();
    await product.save();
    await product.populate('subCategories', 'name slug');

    res.status(200).json({ 
      success: true, 
      product, 
      message: 'Product updated successfully' 
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Also update getAllProductsAdmin if it exists
// controllers/productController.js - Update getAllProductsAdmin
export const getAllProductsAdmin = async (req, res) => {
  try {
    const resultPerPage = 20;
    const page = Number(req.query.page) || 1;

    // Build filter object for admin (include inactive products)
    const filter = {};

    // ✅ Search filter
    if (req.query.keyword) {
      filter.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { tags: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // ✅ Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // ✅ Sub-Category filter
    if (req.query.subCategory) {
      filter.subCategories = req.query.subCategory;
    }

    // ✅ Country filter
    if (req.query.country && req.query.country !== '') {
      filter.country = { $regex: req.query.country, $options: 'i' };
    }

    // ✅ Material filter
    if (req.query.material && req.query.material !== '') {
      filter.material = { $regex: req.query.material, $options: 'i' };
    }

    // ✅ Stock Status filter
    if (req.query.stockStatus && req.query.stockStatus !== '') {
      if (req.query.stockStatus === 'Low Stock') {
        filter.stock = { $gt: 0, $lte: 5 };
        filter.stockStatus = 'In Stock';
      } else {
        filter.stockStatus = req.query.stockStatus;
      }
    }

    // ✅ Featured filter
    if (req.query.isFeatured && req.query.isFeatured !== '') {
      filter.isFeatured = req.query.isFeatured === 'true';
    }

    // ✅ Condition filter
    if (req.query.condition && req.query.condition !== '') {
      filter.condition = req.query.condition;
    }

    // ✅ Rarity filter
    if (req.query.rarity && req.query.rarity !== '') {
      filter.rarity = req.query.rarity;
    }

    // ✅ Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    console.log('Admin filters applied:', JSON.stringify(filter, null, 2));

    // Count total products with filters
    const totalProducts = await Product.countDocuments(filter);

    // Build sort object
    let sortObj = { createdAt: -1, _id: -1 };
    if (req.query.sort) {
      const sortMapping = {
        '-createdAt': { createdAt: -1, _id: -1 },
        'createdAt': { createdAt: 1, _id: 1 },
        '-price': { price: -1, _id: -1 },
        'price': { price: 1, _id: 1 },
        'name': { name: 1, _id: 1 },
        '-name': { name: -1, _id: -1 },
        '-views': { views: -1, _id: -1 },
        '-stock': { stock: -1, _id: -1 }
      };
      sortObj = sortMapping[req.query.sort] || { createdAt: -1, _id: -1 };
    }

    // Get products with pagination
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('subCategories', 'name slug')
      .sort(sortObj)
      .limit(resultPerPage)
      .skip((page - 1) * resultPerPage);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      page,
      pages: Math.ceil(totalProducts / resultPerPage),
      resultPerPage
    });
  } catch (error) {
    console.error('Error in getAllProductsAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    let product = await Product.findOne({ slug: slug, isActive: true })
      .populate('category', 'name slug description')
      .populate('subCategories', 'name slug');

    if (!product) {
      const lastDashIndex = slug.lastIndexOf('-');
      let productName = slug;
      if (lastDashIndex > -1) {
        productName = slug.substring(0, lastDashIndex);
      }
      product = await Product.findOne({
        name: { $regex: new RegExp(`^${productName.replace(/-/g, ' ')}$`, 'i') },
        isActive: true
      })
        .populate('category', 'name slug description')
        .populate('subCategories', 'name slug');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found with the provided slug'
      });
    }

    // ✅ Calculate remaining time
    const now = new Date();
    const markedDate = product.newMarkedAt ? new Date(product.newMarkedAt) : null;
    let remainingHours = 0;
    let isNewValid = false;

    if (product.isNew && markedDate) {
      const hoursSinceMarked = (now - markedDate) / (1000 * 60 * 60);
      remainingHours = Math.max(0, 48 - hoursSinceMarked);
      isNewValid = remainingHours > 0;
    }

    // Update schema markup
    product.seo.schemaMarkup = product.generateSchemaMarkup();

    // Increment views
    product.views += 1;
    await product.save({ validateBeforeSave: false });

    const productObj = product.toObject();
    productObj.isNewValid = isNewValid;
    productObj.newRemainingHours = Math.floor(remainingHours);
    productObj.newRemainingTime = remainingHours > 0
      ? remainingHours < 24
        ? `${Math.floor(remainingHours)}h remaining`
        : `${Math.floor(remainingHours / 24)}d remaining`
      : null;

    res.status(200).json({ success: true, product: productObj });
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/productController.js - Update getProductsByCategory

export const getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const resultPerPage = 15;
    const page = Number(req.query.page) || 1;

    // Build filter
    const filter = { isActive: true, category: category._id };

    // Apply stock status filter
    if (req.query.stockStatus && req.query.stockStatus !== '') {
      filter.stockStatus = req.query.stockStatus;
    }

    // Apply condition filter
    if (req.query.condition && req.query.condition !== '') {
      filter.condition = req.query.condition;
    }

    // Apply price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Apply search filter
    if (req.query.keyword) {
      filter.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { tags: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    const totalProducts = await Product.countDocuments(filter);

    // Build sort object
    let sortObj = {
      isNew: -1,
      newMarkedAt: -1,
      createdAt: -1,
      _id: -1
    };
    if (req.query.sort) {
      const sortMapping = {
        'price-low-high': { price: 1, _id: 1 },
        'price-high-low': { price: -1, _id: -1 },
        'new-to-old': { createdAt: -1, _id: -1 },
        'old-to-new': { createdAt: 1, _id: 1 },
        'a-z': { name: 1, _id: 1 },
        'z-a': { name: -1, _id: -1 }
      };
      sortObj = sortMapping[req.query.sort] || sortObj;
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortObj)
      .limit(resultPerPage)
      .skip((page - 1) * resultPerPage);

    res.status(200).json({
      success: true,
      products,
      category,
      totalProducts,
      page,
      pages: Math.ceil(totalProducts / resultPerPage),
      resultPerPage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1, _id: -1 })
      .limit(Number(req.query.limit) || 8);

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/productController.js (Updated getNewProducts function)

// ==================== GET NEW PRODUCTS (with remaining time) ====================
export const getNewProducts = async (req, res) => {
  try {
    const resultPerPage = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;

    // ✅ Only get products marked as new AND within 48 hours
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const query = {
      isActive: true,
      isNew: true,
      newMarkedAt: { $gte: fortyEightHoursAgo }
    };

    // Add optional filters
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    const totalProducts = await Product.countDocuments(query);

    // ✅ CRITICAL: Sort by newMarkedAt descending (newest first)
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('subCategories', 'name slug')
      .select('name slug description price comparePrice images stock stockStatus isNew newMarkedAt createdAt category country material condition')
      .sort({ newMarkedAt: -1, _id: -1 })  // Most recently marked new comes first
      .limit(resultPerPage)
      .skip((page - 1) * resultPerPage)
      .lean();

    // ✅ Calculate remaining time for each product
    const now = new Date();
    const productsWithRemainingTime = products.map(product => {
      let remainingHours = 0;
      let isNewValid = false;
      let remainingTime = null;

      if (product.newMarkedAt) {
        const markedDate = new Date(product.newMarkedAt);
        const hoursSinceMarked = (now - markedDate) / (1000 * 60 * 60);
        remainingHours = Math.max(0, 48 - hoursSinceMarked);
        isNewValid = remainingHours > 0;

        if (isNewValid) {
          if (remainingHours < 24) {
            remainingTime = `${Math.floor(remainingHours)}h remaining`;
          } else {
            const days = Math.floor(remainingHours / 24);
            remainingTime = `${days}d remaining`;
          }
        }
      }

      return {
        ...product,
        newRemainingHours: Math.floor(remainingHours),
        newRemainingTime: remainingTime,
        isNewValid: isNewValid
      };
    });

    // ✅ Filter out expired products
    const validProducts = productsWithRemainingTime.filter(p => p.isNewValid === true);

    console.log(`✅ Found ${validProducts.length} new products, sorted by newest first`);

    res.status(200).json({
      success: true,
      products: validProducts,
      totalProducts: validProducts.length,
      page: page,
      pages: Math.ceil(validProducts.length / resultPerPage) || 1,
      resultPerPage: resultPerPage
    });
  } catch (error) {
    console.error('Error in getNewProducts:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      products: [],
      totalProducts: 0
    });
  }
};

// ==================== MARK PRODUCT AS NEW (Admin) ====================
export const markProductAsNew = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // ✅ Mark as new - this will reset the timer via pre-save hook
    product.isNew = true;
    // The pre-save hook will automatically set newMarkedAt to new Date()
    await product.save();

    // Calculate remaining hours
    const remainingHours = product.getNewRemainingHours();
    const remainingTime = remainingHours < 24 
      ? `${Math.floor(remainingHours)}h remaining` 
      : `${Math.floor(remainingHours / 24)}d remaining`;

    res.status(200).json({
      success: true,
      message: 'Product marked as New! It will be displayed for 48 hours.',
      product: {
        _id: product._id,
        name: product.name,
        isNew: product.isNew,
        newMarkedAt: product.newMarkedAt,
        newRemainingHours: Math.floor(remainingHours),
        newRemainingTime: remainingTime
      }
    });
  } catch (error) {
    console.error('Error in markProductAsNew:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== REMOVE NEW STATUS (Admin) ====================
export const removeNewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isNew = false;
    product.newMarkedAt = null;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'New status removed from product',
      product: {
        _id: product._id,
        name: product.name,
        isNew: false
      }
    });
  } catch (error) {
    console.error('Error in removeNewStatus:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== AUTO-EXPIRE ALL NEW PRODUCTS (Cron Job) ====================
export const autoExpireNewProducts = async (req, res) => {
  try {
    const modifiedCount = await Product.autoExpireNewProducts();
    res.status(200).json({
      success: true,
      message: `Auto-expired ${modifiedCount} products`,
      modifiedCount
    });
  } catch (error) {
    console.error('Error in autoExpireNewProducts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Endpoint to manually expire a product's new status
export const expireNewProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isNew = false;
    product.newMarkedAt = null;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product new status expired',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1, _id: -1 })
      .limit(Number(req.query.limit) || 8);

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const products = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1, _id: -1 })
      .limit(Number(req.query.limit) || 4);

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    for (const image of product.images) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ FIXED: ApiFeatures class with proper filtering
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
        $or: [
          { name: { $regex: this.queryStr.keyword, $options: 'i' } },
          { description: { $regex: this.queryStr.keyword, $options: 'i' } },
          { tags: { $regex: this.queryStr.keyword, $options: 'i' } }
        ]
      }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ['keyword', 'page', 'limit', 'sort'];
    removeFields.forEach(key => delete queryCopy[key]);

    // Handle price range
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let parsedQuery = JSON.parse(queryStr);

    // Handle category separately if needed
    if (parsedQuery.category) {
      this.query = this.query.find({ category: parsedQuery.category });
      delete parsedQuery.category;
    }

    // Handle isNew filter
    if (parsedQuery.isNew !== undefined) {
      this.query = this.query.find({ isNew: parsedQuery.isNew === 'true' });
      delete parsedQuery.isNew;
    }

    // Handle isFeatured filter
    if (parsedQuery.isFeatured !== undefined) {
      this.query = this.query.find({ isFeatured: parsedQuery.isFeatured === 'true' });
      delete parsedQuery.isFeatured;
    }

    // Apply remaining filters
    if (Object.keys(parsedQuery).length > 0) {
      this.query = this.query.find(parsedQuery);
    }

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortMapping = {
        'price-low-high': { price: 1, _id: 1 },
        'price-high-low': { price: -1, _id: -1 },
        'newest': { createdAt: -1, _id: -1 },
        'oldest': { createdAt: 1, _id: 1 },
        'a-z': { name: 1, _id: 1 },
        'z-a': { name: -1, _id: -1 }
      };

      const sortOption = sortMapping[this.queryStr.sort] || { createdAt: -1, _id: -1 };
      this.query = this.query.sort(sortOption);
    } else {
      this.query = this.query.sort({ createdAt: -1, _id: -1 });
    }

    return this;
  }

  paginate(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || resultPerPage;
    const skip = (currentPage - 1) * limit;

    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}

export default ApiFeatures;