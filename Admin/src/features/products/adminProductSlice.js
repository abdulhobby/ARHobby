import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../services/adminApi';

export const fetchProducts = createAsyncThunk('adminProduct/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await productAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductById = createAsyncThunk('adminProduct/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await productAPI.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Product not found');
  }
});

export const createProduct = createAsyncThunk('adminProduct/create', async (formData, { rejectWithValue }) => {
  try {
    const response = await productAPI.create(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('adminProduct/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await productAPI.update(id, formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update product');
  }
});

export const markProductAsNew = createAsyncThunk(
  'adminProduct/markAsNew',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productAPI.markAsNew(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark product as new');
    }
  }
);

export const removeNewStatus = createAsyncThunk(
  'adminProduct/removeNewStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productAPI.removeNewStatus(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove new status');
    }
  }
);

export const deleteProduct = createAsyncThunk('adminProduct/delete', async (id, { rejectWithValue }) => {
  try {
    await productAPI.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
  }
});

const adminProductSlice = createSlice({
  name: 'adminProduct',
  initialState: {
    products: [],
    product: null,
    totalProducts: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearProduct: (state) => { state.product = null; },
    clearSuccess: (state) => { state.success = false; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
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
      .addCase(fetchProductById.pending, (state) => { state.loading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => { state.loading = true; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products.unshift(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => { state.loading = true; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.product = action.payload.product;
        const index = state.products.findIndex(p => p._id === action.payload.product._id);
        if (index !== -1) state.products[index] = action.payload.product;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
        state.totalProducts -= 1;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Inside extraReducers builder
      .addCase(markProductAsNew.fulfilled, (state, action) => {
        state.success = true;
        state.message = action.payload.message;
        // Update the product in the list
        const index = state.products.findIndex(p => p._id === action.payload.product._id);
        if (index !== -1) {
          state.products[index].isNew = true;
          state.products[index].newMarkedAt = action.payload.product.newMarkedAt;
        }
        if (state.product && state.product._id === action.payload.product._id) {
          state.product.isNew = true;
          state.product.newMarkedAt = action.payload.product.newMarkedAt;
        }
      })
      .addCase(markProductAsNew.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeNewStatus.fulfilled, (state, action) => {
        state.success = true;
        state.message = action.payload.message;
        const index = state.products.findIndex(p => p._id === action.payload.product._id);
        if (index !== -1) {
          state.products[index].isNew = false;
          state.products[index].newMarkedAt = null;
        }
        if (state.product && state.product._id === action.payload.product._id) {
          state.product.isNew = false;
          state.product.newMarkedAt = null;
        }
      })
      .addCase(removeNewStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearProduct, clearSuccess, clearError } = adminProductSlice.actions;
export default adminProductSlice.reducer;