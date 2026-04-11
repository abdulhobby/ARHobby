import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contactAPI } from '../../services/adminApi';

export const fetchContacts = createAsyncThunk('adminContact/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await contactAPI.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts');
  }
});

export const updateContactStatus = createAsyncThunk('adminContact/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await contactAPI.updateStatus(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update');
  }
});

export const deleteContact = createAsyncThunk('adminContact/delete', async (id, { rejectWithValue }) => {
  try {
    await contactAPI.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete');
  }
});

const adminContactSlice = createSlice({
  name: 'adminContact',
  initialState: {
    contacts: [],
    totalContacts: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => { state.loading = true; })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
        state.totalContacts = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        const idx = state.contacts.findIndex(c => c._id === action.payload.contact._id);
        if (idx !== -1) state.contacts[idx] = action.payload.contact;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c._id !== action.payload);
      });
  }
});

export default adminContactSlice.reducer;