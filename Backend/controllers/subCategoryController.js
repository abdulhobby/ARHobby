// controllers/subCategoryController.js
import SubCategory from '../models/SubCategory.js';
import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// Create sub-category
export const createSubCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    // Check if sub-category already exists
    const existingSubCategory = await SubCategory.findOne({ name: name.trim() });
    if (existingSubCategory) {
      return res.status(400).json({ success: false, message: 'Sub-category already exists' });
    }

    let imageData = {};
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'currency-corner/sub-categories',
        width: 400,
        height: 400,
        crop: 'limit'
      });
      imageData = { public_id: result.public_id, url: result.secure_url };
    }

    const subCategory = await SubCategory.create({
      name: name.trim(),
      description,
      image: imageData,
      isActive: isActive === 'true' || isActive === true,
      metadata: {
        createdBy: req.user._id
      }
    });

    res.status(201).json({
      success: true,
      subCategory,
      message: 'Sub-category created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all sub-categories
export const getAllSubCategories = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};

    const subCategories = await SubCategory.find(filter)
      .populate('name slug')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      subCategories,
      count: subCategories.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get sub-category by ID
export const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id)
      .populate('name slug');
    
    if (!subCategory) {
      return res.status(404).json({ success: false, message: 'Sub-category not found' });
    }

    // Get product count for this sub-category
    const productCount = await Product.countDocuments({ 
      subCategories: subCategory._id, 
      isActive: true 
    });

    res.status(200).json({
      success: true,
      subCategory,
      productCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get sub-category by slug
export const getSubCategoryBySlug = async (req, res) => {
  try {
    const subCategory = await SubCategory.findOne({ slug: req.params.slug })
      .populate('name slug');
    
    if (!subCategory) {
      return res.status(404).json({ success: false, message: 'Sub-category not found' });
    }

    const productCount = await Product.countDocuments({ 
      subCategories: subCategory._id, 
      isActive: true 
    });

    res.status(200).json({
      success: true,
      subCategory,
      productCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update sub-category
export const updateSubCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
      return res.status(404).json({ success: false, message: 'Sub-category not found' });
    }

    // Check name uniqueness
    if (name && name !== subCategory.name) {
      const existing = await SubCategory.findOne({ name: name.trim() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Sub-category name already exists' });
      }
      subCategory.name = name.trim();
    }

    if (description !== undefined) subCategory.description = description;
    if (isActive !== undefined) subCategory.isActive = isActive === 'true' || isActive === true;

    // Handle image update
    if (req.file) {
      if (subCategory.image?.public_id) {
        await cloudinary.uploader.destroy(subCategory.image.public_id);
      }
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'currency-corner/sub-categories',
        width: 400,
        height: 400,
        crop: 'limit'
      });
      subCategory.image = { public_id: result.public_id, url: result.secure_url };
    }

    subCategory.metadata.updatedBy = req.user._id;
    await subCategory.save();

    res.status(200).json({
      success: true,
      subCategory,
      message: 'Sub-category updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete sub-category
export const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    
    if (!subCategory) {
      return res.status(404).json({ success: false, message: 'Sub-category not found' });
    }

    // Check if products are using this sub-category
    const productsUsing = await Product.countDocuments({ subCategories: subCategory._id });
    if (productsUsing > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete: ${productsUsing} products are using this sub-category` 
      });
    }

    // Delete image from cloudinary
    if (subCategory.image?.public_id) {
      await cloudinary.uploader.destroy(subCategory.image.public_id);
    }

    await subCategory.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sub-category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};