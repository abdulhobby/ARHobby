// frontend/src/features/subCategory/adminSubCategorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subCategoryAPI } from '../../services/adminApi';

// Fetch all sub-categories
export const fetchSubCategories = createAsyncThunk(
  'adminSubCategory/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await subCategoryAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sub-categories');
    }
  }
);

// Fetch sub-category by ID
export const fetchSubCategoryById = createAsyncThunk(
  'adminSubCategory/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await subCategoryAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sub-category');
    }
  }
);

// Fetch sub-categories by category
export const fetchSubCategoriesByCategory = createAsyncThunk(
  'adminSubCategory/fetchByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await subCategoryAPI.getByCategory(categoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sub-categories');
    }
  }
);

// Create sub-category
export const createSubCategory = createAsyncThunk(
  'adminSubCategory/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await subCategoryAPI.create(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create sub-category');
    }
  }
);

// Update sub-category
export const updateSubCategory = createAsyncThunk(
  'adminSubCategory/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await subCategoryAPI.update(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update sub-category');
    }
  }
);

// Delete sub-category
export const deleteSubCategory = createAsyncThunk(
  'adminSubCategory/delete',
  async (id, { rejectWithValue }) => {
    try {
      await subCategoryAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete sub-category');
    }
  }
);

const adminSubCategorySlice = createSlice({
  name: 'adminSubCategory',
  initialState: {
    subCategories: [],
    currentSubCategory: null,
    loading: false,
    error: null,
    totalCount: 0,
    filters: {
      category: '',
      isActive: ''
    }
  },
  reducers: {
    clearSubCategory: (state) => {
      state.currentSubCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { category: '', isActive: '' };
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
      // Fetch by ID
      .addCase(fetchSubCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubCategory = action.payload.subCategory;
      })
      .addCase(fetchSubCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by category
      .addCase(fetchSubCategoriesByCategory.fulfilled, (state, action) => {
        state.subCategories = action.payload.subCategories;
      })
      // Create sub-category
      .addCase(createSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories.unshift(action.payload.subCategory);
        state.totalCount++;
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update sub-category
      .addCase(updateSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subCategories.findIndex(sc => sc._id === action.payload.subCategory._id);
        if (index !== -1) {
          state.subCategories[index] = action.payload.subCategory;
        }
        state.currentSubCategory = action.payload.subCategory;
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete sub-category
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = state.subCategories.filter(sc => sc._id !== action.payload);
        state.totalCount--;
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSubCategory, clearError, setFilters, clearFilters } = adminSubCategorySlice.actions;
export default adminSubCategorySlice.reducer;