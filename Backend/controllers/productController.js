// controllers/productController.js
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const createProduct = async (req, res) => {
  try {
    const {
      name, description, category, country, year, condition,
      denomination, material, weight, dimensions, rarity,
      additionalInfo, price, comparePrice, stock, isFeatured, isNew, tags,
      seoMetaTitle, seoMetaDescription, seoMetaKeywords, 
      seoOgTitle, seoOgDescription, seoCanonicalUrl
    } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
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
      name, description, images, category, country, year, condition,
      denomination, material, weight, dimensions, rarity,
      additionalInfo, price, comparePrice,
      stock: stock || 0,
      isFeatured: isFeatured === 'true',
      isNew: isNew === 'true',
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags) : [],
      seo: seoData
    });

    // Generate and save schema markup
    product.seo.schemaMarkup = product.generateSchemaMarkup();
    await product.save();

    await product.populate('category', 'name slug');
    res.status(201).json({ success: true, product, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 12;

    // Apply default sort to show newest first if no sort parameter provided
    if (!req.query.sort) {
      req.query.sort = '-createdAt'; // Newest first
    }

    const countQuery = Product.find({ isActive: true });
    const countFeatures = new ApiFeatures(countQuery, req.query).search().filter();
    const totalProducts = await countFeatures.query.countDocuments();

    const apiFeatures = new ApiFeatures(
      Product.find({ isActive: true }).populate('category', 'name slug'),
      req.query
    ).search().filter().sort().paginate(resultPerPage);

    const products = await apiFeatures.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || resultPerPage;

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      page,
      pages: Math.ceil(totalProducts / limit),
      resultPerPage: limit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProductsAdmin = async (req, res) => {
  try {
    const resultPerPage = 20;

    // Apply default sort to show newest first for admin too
    if (!req.query.sort) {
      req.query.sort = '-createdAt';
    }

    const countQuery = Product.find();
    const countFeatures = new ApiFeatures(countQuery, req.query).search().filter();
    const totalProducts = await countFeatures.query.countDocuments();

    const apiFeatures = new ApiFeatures(
      Product.find().populate('category', 'name slug'),
      req.query
    ).search().filter().sort().paginate(resultPerPage);

    const products = await apiFeatures.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || resultPerPage;

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      page,
      pages: Math.ceil(totalProducts / limit),
      resultPerPage: limit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug description');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update schema markup with current data
    product.seo.schemaMarkup = product.generateSchemaMarkup();
    
    product.views += 1;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, product });
  } catch (error) {
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

export const getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Apply default sort to show newest first
    if (!req.query.sort) {
      req.query.sort = '-createdAt';
    }

    const resultPerPage = 12;

    const countQuery = Product.find({ isActive: true, category: category._id });
    const countFeatures = new ApiFeatures(countQuery, req.query).search().filter();
    const totalProducts = await countFeatures.query.countDocuments();

    const apiFeatures = new ApiFeatures(
      Product.find({ isActive: true, category: category._id }).populate('category', 'name slug'),
      req.query
    ).search().filter().sort().paginate(resultPerPage);

    const products = await apiFeatures.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || resultPerPage;

    res.status(200).json({
      success: true,
      products,
      category,
      totalProducts,
      page,
      pages: Math.ceil(totalProducts / limit),
      resultPerPage: limit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 }) // Newest first
      .limit(Number(req.query.limit) || 8);

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNewProducts = async (req, res) => {
  try {
    const resultPerPage = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const countQuery = Product.find({
      isActive: true,
      $or: [
        { isNew: true },
        { createdAt: { $gte: thirtyDaysAgo } }
      ]
    });

    const totalProducts = await countQuery.countDocuments();

    const products = await Product.find({
      isActive: true,
      $or: [
        { isNew: true },
        { createdAt: { $gte: thirtyDaysAgo } }
      ]
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1, _id: -1 }) // Newest first, most recent ID first
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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 }) // Newest first
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
      .sort({ createdAt: -1 }) // Show newest related products first
      .limit(Number(req.query.limit) || 4);

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name, description, category, country, year, condition,
      denomination, material, weight, dimensions, rarity,
      additionalInfo, price, comparePrice, stock, isFeatured, isActive, isNew, tags,
      seoMetaTitle, seoMetaDescription, seoMetaKeywords,
      seoOgTitle, seoOgDescription, seoCanonicalUrl,
      removeImages
    } = req.body;

    // Update basic fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
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
    if (stock !== undefined) {
      product.stock = stock;
      product.stockStatus = stock > 0 ? 'In Stock' : 'Out of Stock';
    }
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;
    if (isNew !== undefined) product.isNew = isNew === 'true' || isNew === true;
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
      
      // Update OG image if no custom OG image is set
      if (!seoOgTitle && !seoOgDescription && product.images.length > 0) {
        product.seo.ogImage = product.images[0].url;
      }
    }

    // Update schema markup
    product.seo.schemaMarkup = product.generateSchemaMarkup();

    await product.save();
    await product.populate('category', 'name slug');

    res.status(200).json({ success: true, product, message: 'Product updated successfully' });
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