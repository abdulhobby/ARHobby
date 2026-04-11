import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { couponAPI } from '../../services/adminApi';

export const fetchCoupons = createAsyncThunk('adminCoupon/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await couponAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch coupons');
  }
});

export const fetchCouponById = createAsyncThunk('adminCoupon/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await couponAPI.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Coupon not found');
  }
});

export const createCoupon = createAsyncThunk('adminCoupon/create', async (data, { rejectWithValue }) => {
  try {
    const response = await couponAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create coupon');
  }
});

export const updateCoupon = createAsyncThunk('adminCoupon/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await couponAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update coupon');
  }
});

export const deleteCoupon = createAsyncThunk('adminCoupon/delete', async (id, { rejectWithValue }) => {
  try {
    await couponAPI.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete coupon');
  }
});

const adminCouponSlice = createSlice({
  name: 'adminCoupon',
  initialState: {
    coupons: [],
    coupon: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearCoupon: (state) => { state.coupon = null; },
    clearSuccess: (state) => { state.success = false; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => { state.loading = true; })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCouponById.pending, (state) => { state.loading = true; })
      .addCase(fetchCouponById.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload.coupon;
      })
      .addCase(fetchCouponById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoupon.pending, (state) => { state.loading = true; })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.coupons.unshift(action.payload.coupon);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCoupon.pending, (state) => { state.loading = true; })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.coupon = action.payload.coupon;
        const idx = state.coupons.findIndex(c => c._id === action.payload.coupon._id);
        if (idx !== -1) state.coupons[idx] = action.payload.coupon;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearCoupon, clearSuccess, clearError } = adminCouponSlice.actions;
export default adminCouponSlice.reducer;