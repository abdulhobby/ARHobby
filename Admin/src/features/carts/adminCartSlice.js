import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/adminApi.js';

// Get all carts
export const getAllCarts = createAsyncThunk(
  'adminCart/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get cart analytics
export const getCartAnalytics = createAsyncThunk(
  'adminCart/getAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getAnalytics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get cart by user
export const getCartByUser = createAsyncThunk(
  'adminCart/getByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCartByUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove item from cart
export const removeCartItem = createAsyncThunk(
  'adminCart/removeItem',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeItem(userId, productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  'adminCart/updateItem',
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateItem(userId, productId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Clear user's cart
export const clearUserCart = createAsyncThunk(
  'adminCart/clearCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.clearCart(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete cart
export const deleteUserCart = createAsyncThunk(
  'adminCart/deleteCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.deleteCart(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Export carts
export const exportCarts = createAsyncThunk(
  'adminCart/export',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.exportCarts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const adminCartSlice = createSlice({
  name: 'adminCart',
  initialState: {
    carts: [],
    selectedCart: null,
    analytics: null,
    stats: {
      totalCarts: 0,
      totalCartValue: 0,
      emptyCarts: 0,
      nonEmptyCarts: 0
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0
    },
    loading: false,
    error: null,
    filters: {
      search: '',
      status: 'all'
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedCart: (state) => {
      state.selectedCart = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all carts
      .addCase(getAllCarts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = action.payload.carts;
        state.stats = action.payload.stats;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get cart analytics
      .addCase(getCartAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.analytics;
      })
      .addCase(getCartAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get cart by user
      .addCase(getCartByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCart = action.payload.cart;
      })
      .addCase(getCartByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove item
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (state.selectedCart) {
          state.selectedCart = action.payload.cart;
        }
        // Update in carts list
        const index = state.carts.findIndex(c => c.user?._id === action.payload.cart.user?._id);
        if (index !== -1) {
          state.carts[index] = action.payload.cart;
        }
      })
      // Update item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (state.selectedCart) {
          state.selectedCart = action.payload.cart;
        }
        const index = state.carts.findIndex(c => c.user?._id === action.payload.cart.user?._id);
        if (index !== -1) {
          state.carts[index] = action.payload.cart;
        }
      })
      // Clear cart
      .addCase(clearUserCart.fulfilled, (state, action) => {
        if (state.selectedCart) {
          state.selectedCart.items = [];
          state.selectedCart.totalItems = 0;
          state.selectedCart.totalPrice = 0;
        }
      })
      // Delete cart
      .addCase(deleteUserCart.fulfilled, (state, action) => {
        state.carts = state.carts.filter(c => c.user?._id !== action.meta.arg);
        if (state.selectedCart?.user?._id === action.meta.arg) {
          state.selectedCart = null;
        }
      });
  }
});

export const { setFilters, clearSelectedCart, clearError } = adminCartSlice.actions;
export default adminCartSlice.reducer;