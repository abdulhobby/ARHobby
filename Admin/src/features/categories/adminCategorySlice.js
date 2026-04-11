import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryAPI } from '../../services/adminApi';

export const fetchCategories = createAsyncThunk('adminCategory/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await categoryAPI.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
  }
});

export const fetchCategoryById = createAsyncThunk('adminCategory/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await categoryAPI.getById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Category not found');
  }
});

export const createCategory = createAsyncThunk('adminCategory/create', async (formData, { rejectWithValue }) => {
  try {
    const response = await categoryAPI.create(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create category');
  }
});

export const updateCategory = createAsyncThunk('adminCategory/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await categoryAPI.update(id, formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update category');
  }
});

export const deleteCategory = createAsyncThunk('adminCategory/delete', async (id, { rejectWithValue }) => {
  try {
    await categoryAPI.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
  }
});

const adminCategorySlice = createSlice({
  name: 'adminCategory',
  initialState: {
    categories: [],
    category: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearCategory: (state) => { state.category = null; },
    clearSuccess: (state) => { state.success = false; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategoryById.pending, (state) => { state.loading = true; })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload.category;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.pending, (state) => { state.loading = true; })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.categories.push(action.payload.category);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => { state.loading = true; })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.category = action.payload.category;
        const idx = state.categories.findIndex(c => c._id === action.payload.category._id);
        if (idx !== -1) state.categories[idx] = action.payload.category;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearCategory, clearSuccess, clearError } = adminCategorySlice.actions;
export default adminCategorySlice.reducer;