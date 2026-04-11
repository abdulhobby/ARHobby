import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../services/adminApi';

export const fetchOrders = createAsyncThunk('adminOrder/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await orderAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrderById = createAsyncThunk('adminOrder/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await orderAPI.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Order not found');
  }
});

export const updateOrderStatus = createAsyncThunk('adminOrder/updateStatus', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await orderAPI.updateStatus(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update order');
  }
});

export const fetchNewOrders = createAsyncThunk('adminOrder/fetchNew', async (_, { rejectWithValue }) => {
  try {
    const response = await orderAPI.getNew();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch new orders');
  }
});

export const markOrderViewed = createAsyncThunk('adminOrder/markViewed', async (id, { rejectWithValue }) => {
  try {
    await orderAPI.markViewed(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed');
  }
});

export const markAllOrdersViewed = createAsyncThunk('adminOrder/markAllViewed', async (_, { rejectWithValue }) => {
  try {
    await orderAPI.markAllViewed();
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed');
  }
});

export const downloadInvoice = createAsyncThunk('adminOrder/invoice', async (id, { rejectWithValue }) => {
  try {
    const response = await orderAPI.downloadInvoice(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Invoice not available');
  }
});

const adminOrderSlice = createSlice({
  name: 'adminOrder',
  initialState: {
    orders: [],
    order: null,
    bankDetails: null,
    newOrders: [],
    newOrderCount: 0,
    totalOrders: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null
  },
  reducers: {
    clearOrder: (state) => { state.order = null; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
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
      .addCase(updateOrderStatus.pending, (state) => { state.loading = true; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        const idx = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (idx !== -1) state.orders[idx] = action.payload.order;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNewOrders.fulfilled, (state, action) => {
        state.newOrders = action.payload.orders;
        state.newOrderCount = action.payload.count;
      })
      .addCase(markOrderViewed.fulfilled, (state, action) => {
        state.newOrders = state.newOrders.filter(o => o._id !== action.payload);
        state.newOrderCount = Math.max(0, state.newOrderCount - 1);
      })
      .addCase(markAllOrdersViewed.fulfilled, (state) => {
        state.newOrders = [];
        state.newOrderCount = 0;
      })
      .addCase(downloadInvoice.fulfilled, (state, action) => {
        if (action.payload.invoiceUrl) {
          window.open(action.payload.invoiceUrl, '_blank');
        }
      });
  }
});

export const { clearOrder, clearError } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;