import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { couponAPI } from '../../services/api';

export const applyCoupon = createAsyncThunk('coupon/apply', async (data, { rejectWithValue }) => {
  try {
    const response = await couponAPI.apply(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Invalid coupon');
  }
});

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    appliedCoupon: null,
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.message = null;
      state.error = null;
    },
    clearCouponError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload.coupon;
        state.message = action.payload.message;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.appliedCoupon = null;
      });
  }
});

export const { removeCoupon, clearCouponError } = couponSlice.actions;
export default couponSlice.reducer;