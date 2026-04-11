import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addressAPI } from '../../services/api';

export const fetchAddresses = createAsyncThunk('address/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await addressAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
  }
});

export const addAddress = createAsyncThunk('address/add', async (data, { rejectWithValue }) => {
  try {
    const response = await addressAPI.add(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add address');
  }
});

export const updateAddress = createAsyncThunk('address/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await addressAPI.update(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update address');
  }
});

export const deleteAddress = createAsyncThunk('address/delete', async (id, { rejectWithValue }) => {
  try {
    await addressAPI.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
  }
});

export const setDefaultAddress = createAsyncThunk('address/setDefault', async (id, { rejectWithValue }) => {
  try {
    await addressAPI.setDefault(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to set default address');
  }
});

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    clearMessage: (state) => { state.message = null; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => { state.loading = true; })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.addresses;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.pending, (state) => { state.loading = true; })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload.address);
        state.message = action.payload.message;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(a => a._id === action.payload.address._id);
        if (index !== -1) state.addresses[index] = action.payload.address;
        state.message = action.payload.message;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(a => a._id !== action.payload);
        state.message = 'Address deleted successfully';
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map(a => ({
          ...a,
          isDefault: a._id === action.payload
        }));
      });
  }
});

export const { clearMessage, clearError } = addressSlice.actions;
export default addressSlice.reducer;