// utils/apiFeatures.js
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
    // Create a copy of query string
    const queryCopy = { ...this.queryStr };
    
    // Remove fields that are not for filtering
    const removeFields = ['keyword', 'page', 'limit', 'sort', 'fields', 'search'];
    removeFields.forEach((key) => delete queryCopy[key]);
    
    // Handle price range
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let parsedQuery = JSON.parse(queryStr);
    
    // Handle special filters
    if (parsedQuery.category) {
      this.query = this.query.find({ category: parsedQuery.category });
      delete parsedQuery.category;
    }
    
    if (parsedQuery.stockStatus) {
      this.query = this.query.find({ stockStatus: parsedQuery.stockStatus });
      delete parsedQuery.stockStatus;
    }
    
    if (parsedQuery.condition) {
      this.query = this.query.find({ condition: parsedQuery.condition });
      delete parsedQuery.condition;
    }
    
    if (parsedQuery.rarity) {
      this.query = this.query.find({ rarity: parsedQuery.rarity });
      delete parsedQuery.rarity;
    }
    
    if (parsedQuery.country) {
      this.query = this.query.find({ country: { $regex: parsedQuery.country, $options: 'i' } });
      delete parsedQuery.country;
    }
    
    if (parsedQuery.minPrice || parsedQuery.maxPrice) {
      const priceFilter = {};
      if (parsedQuery.minPrice) priceFilter.$gte = Number(parsedQuery.minPrice);
      if (parsedQuery.maxPrice) priceFilter.$lte = Number(parsedQuery.maxPrice);
      this.query = this.query.find({ price: priceFilter });
      delete parsedQuery.minPrice;
      delete parsedQuery.maxPrice;
    }
    
    if (parsedQuery.isFeatured) {
      this.query = this.query.find({ isFeatured: parsedQuery.isFeatured === 'true' });
      delete parsedQuery.isFeatured;
    }
    
    if (parsedQuery.isNew) {
      this.query = this.query.find({ isNew: parsedQuery.isNew === 'true' });
      delete parsedQuery.isNew;
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
        'new-to-old': { createdAt: -1, _id: -1 },
        'old-to-new': { createdAt: 1, _id: 1 },
        'a-z': { name: 1, _id: 1 },
        'z-a': { name: -1, _id: -1 },
        'featured': { isFeatured: -1, createdAt: -1, _id: -1 }
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