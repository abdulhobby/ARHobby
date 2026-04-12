// frontend/src/features/subCategory/subCategorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subCategoryAPI } from '../../services/api';

export const fetchSubCategories = createAsyncThunk(
  'subCategory/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await subCategoryAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sub-categories');
    }
  }
);

export const fetchSubCategoriesByCategory = createAsyncThunk(
  'subCategory/fetchByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await subCategoryAPI.getByCategory(categoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sub-categories');
    }
  }
);

export const fetchSubCategoryBySlug = createAsyncThunk(
  'subCategory/fetchBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await subCategoryAPI.getBySlug(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Sub-category not found');
    }
  }
);

const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState: {
    subCategories: [],
    currentSubCategory: null,
    loading: false,
    error: null,
    totalCount: 0
  },
  reducers: {
    clearSubCategory: (state) => {
      state.currentSubCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all sub-categories
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload.subCategories;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by category
      .addCase(fetchSubCategoriesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategoriesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload.subCategories;
      })
      .addCase(fetchSubCategoriesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by slug
      .addCase(fetchSubCategoryBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategoryBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubCategory = action.payload.subCategory;
      })
      .addCase(fetchSubCategoryBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSubCategory, clearError } = subCategorySlice.actions;
export default subCategorySlice.reducer;