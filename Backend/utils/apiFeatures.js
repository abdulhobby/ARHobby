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

    const removeFields = ['keyword', 'page', 'limit', 'sort', 'fields'];
    removeFields.forEach((key) => delete queryCopy[key]);

    if (queryCopy.category) {
      this.query = this.query.find({ category: queryCopy.category });
      delete queryCopy.category;
    }

    if (queryCopy.stockStatus) {
      this.query = this.query.find({ stockStatus: queryCopy.stockStatus });
      delete queryCopy.stockStatus;
    }

    if (queryCopy.condition) {
      this.query = this.query.find({ condition: queryCopy.condition });
      delete queryCopy.condition;
    }

    if (queryCopy.country) {
      this.query = this.query.find({ country: { $regex: queryCopy.country, $options: 'i' } });
      delete queryCopy.country;
    }

    if (queryCopy.rarity) {
      this.query = this.query.find({ rarity: queryCopy.rarity });
      delete queryCopy.rarity;
    }

    if (queryCopy.minPrice || queryCopy.maxPrice) {
      const priceFilter = {};
      if (queryCopy.minPrice) priceFilter.$gte = Number(queryCopy.minPrice);
      if (queryCopy.maxPrice) priceFilter.$lte = Number(queryCopy.maxPrice);
      this.query = this.query.find({ price: priceFilter });
      delete queryCopy.minPrice;
      delete queryCopy.maxPrice;
    }

    if (queryCopy.isFeatured) {
      this.query = this.query.find({ isFeatured: queryCopy.isFeatured === 'true' });
      delete queryCopy.isFeatured;
    }

    return this;
  }

  sort() {
  if (this.queryStr.sort) {
    const sortMapping = {
      'price-low-high': { price: 1 },
      'price-high-low': { price: -1 },
      'new-to-old': { createdAt: -1, _id: -1 }, // ✅ FIX
      'old-to-new': { createdAt: 1, _id: 1 },
      'a-z': { name: 1 },
      'z-a': { name: -1 },
      'featured': { isFeatured: -1, createdAt: -1, _id: -1 }
    };

    const sortOption = sortMapping[this.queryStr.sort] || { createdAt: -1, _id: -1 };

    this.query = this.query.sort(sortOption);

  } else {
    // ✅ DEFAULT FIX
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