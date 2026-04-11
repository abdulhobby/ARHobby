import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/adminApi';

export const adminLogin = createAsyncThunk('adminAuth/login', async (data, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(data);
    localStorage.setItem('adminToken', response.data.token);
    localStorage.setItem('adminUser', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const adminLogout = createAsyncThunk('adminAuth/logout', async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    // continue logout
  }
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
});

export const loadAdmin = createAsyncThunk('adminAuth/load', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) return rejectWithValue('No token');
    const response = await authAPI.getMe();
    if (response.data.user.role !== 'admin') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return rejectWithValue('Not admin');
    }
    return response.data;
  } catch (error) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return rejectWithValue('Session expired');
  }
});

const storedUser = localStorage.getItem('adminUser');

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!localStorage.getItem('adminToken'),
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loadAdmin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadAdmin.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  }
});

export const { clearError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;