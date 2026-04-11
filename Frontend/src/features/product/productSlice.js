// frontend/src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../services/api';

export const fetchProducts = createAsyncThunk('product/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await productAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductBySlug = createAsyncThunk('product/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const response = await productAPI.getBySlug(slug);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Product not found');
  }
});

export const fetchProductsByCategory = createAsyncThunk('product/fetchByCategory', async ({ slug, params }, { rejectWithValue }) => {
  try {
    const response = await productAPI.getByCategory(slug, params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchFeaturedProducts = createAsyncThunk('product/fetchFeatured', async (params, { rejectWithValue }) => {
  try {
    const response = await productAPI.getFeatured(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
  }
});

export const fetchNewProducts = createAsyncThunk('product/fetchNew', async (params, { rejectWithValue }) => {
  try {
    const response = await productAPI.getNew(params);
    console.log('New Products API Response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('New Products API Error:', error);
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch new products');
  }
});

export const fetchLatestProducts = createAsyncThunk('product/fetchLatest', async (params, { rejectWithValue }) => {
  try {
    const response = await productAPI.getLatest(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch latest products');
  }
});

export const fetchRelatedProducts = createAsyncThunk('product/fetchRelated', async ({ id, params }, { rejectWithValue }) => {
  try {
    const response = await productAPI.getRelated(id, params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch related products');
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    product: null,
    featuredProducts: [],
    newProducts: [],
    latestProducts: [],
    relatedProducts: [],
    categoryProducts: [],
    category: null,
    totalProducts: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null
  },
  reducers: {
    clearProduct: (state) => { state.product = null; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductBySlug.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryProducts = action.payload.products;
        state.category = action.payload.category;
        state.totalProducts = action.payload.totalProducts;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload.products || action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchNewProducts.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response structures
        const products = action.payload.products || action.payload;
        state.newProducts = Array.isArray(products) ? products : [];
        state.totalProducts = action.payload.totalProducts || state.newProducts.length;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
        console.log('New products loaded:', state.newProducts.length); // Debug log
      })
      .addCase(fetchNewProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.newProducts = [];
        console.error('Failed to load new products:', action.payload);
      })
      .addCase(fetchLatestProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchLatestProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.latestProducts = action.payload.products || action.payload;
      })
      .addCase(fetchLatestProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload.products || action.payload;
      });
  }
});

export const { clearProduct, clearError } = productSlice.actions;
export default productSlice.reducer;