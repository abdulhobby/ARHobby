import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../services/api';

export const createOrder = createAsyncThunk('order/create', async (data, { rejectWithValue }) => {
  try {
    const response = await orderAPI.create(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to place order');
  }
});

export const fetchMyOrders = createAsyncThunk('order/fetchMy', async (params, { rejectWithValue }) => {
  try {
    const response = await orderAPI.getMyOrders(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrderById = createAsyncThunk('order/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await orderAPI.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Order not found');
  }
});

export const trackOrder = createAsyncThunk('order/track', async (id, { rejectWithValue }) => {
  try {
    const response = await orderAPI.track(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Tracking info not available');
  }
});

export const downloadInvoice = createAsyncThunk('order/invoice', async (id, { rejectWithValue }) => {
  try {
    const response = await orderAPI.downloadInvoice(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Invoice not available');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    order: null,
    bankDetails: null,
    trackingInfo: null,
    totalOrders: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
    orderPlaced: false
  },
  reducers: {
    clearOrder: (state) => { state.order = null; state.bankDetails = null; },
    clearOrderPlaced: (state) => { state.orderPlaced = false; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.bankDetails = action.payload.bankDetails;
        state.orderPlaced = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => { state.loading = true; })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.bankDetails = action.payload.bankDetails;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(trackOrder.pending, (state) => { state.loading = true; })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = { ...state.order, ...action.payload.order };
        state.trackingInfo = action.payload.trackingInfo;
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(downloadInvoice.fulfilled, (state, action) => {
        if (action.payload.invoiceUrl) {
          window.open(action.payload.invoiceUrl, '_blank');
        }
      });
  }
});

export const { clearOrder, clearOrderPlaced, clearError } = orderSlice.actions;
export default orderSlice.reducer;