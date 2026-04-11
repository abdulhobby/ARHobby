import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, userAPI } from '../../services/api';

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await authAPI.register(data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.errors?.[0]?.message ||
      error.response?.data?.message || 
      'Registration failed'
    );
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.errors?.[0]?.message ||
      error.response?.data?.message || 
      'Login failed'
    );
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authAPI.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token');
    const response = await authAPI.getMe();
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return rejectWithValue(error.response?.data?.message || 'Session expired');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await authAPI.forgotPassword(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.errors?.[0]?.message ||
      error.response?.data?.message || 
      'Failed to send reset email'
    );
  }
});

// ✅ FIXED: Include confirmPassword in the request
export const resetPassword = createAsyncThunk(
  'auth/resetPassword', 
  async ({ token, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword(token, { 
        password,
        confirmPassword 
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message || 
        'Password reset failed'
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await userAPI.changePassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message || 
        'Password change failed'
      );
    }
  }
);

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await userAPI.updateProfile(data);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.errors?.[0]?.message ||
      error.response?.data?.message || 
      'Update failed'
    );
  }
});

export const updatePassword = createAsyncThunk('auth/updatePassword', async (data, { rejectWithValue }) => {
  try {
    const response = await userAPI.updatePassword(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.errors?.[0]?.message ||
      error.response?.data?.message || 
      'Password update failed'
    );
  }
});

export const updateAvatar = createAsyncThunk('auth/updateAvatar', async (formData, { rejectWithValue }) => {
  try {
    const response = await userAPI.updateAvatar(formData);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.errors?.[0]?.message ||
      error.response?.data?.message || 
      'Avatar update failed'
    );
  }
});

const storedUser = localStorage.getItem('user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    message: null,
    errors: []
  },
  reducers: {
    clearError: (state) => { 
      state.error = null;
      state.errors = [];
    },
    clearMessage: (state) => { state.message = null; }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Login
      .addCase(login.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Reset Password
      .addCase(resetPassword.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message || 'Password reset successfully';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Change Password
      .addCase(changePassword.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Password
      .addCase(updatePassword.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Avatar
      .addCase(updateAvatar.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;