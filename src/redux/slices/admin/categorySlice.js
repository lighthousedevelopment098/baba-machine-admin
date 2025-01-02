import axios from 'axios';
import { API_URL } from '../../../config/apiConfig';
import axiosInstance from '../../../utils/axiosConfig'; 
import { ErrorMessage } from '../../../utils/ErrorMessage';  
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to make API calls with authorization
const makeAuthorizedRequest = async (method, url, data = null, params = null) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params,
  };

  if (method === 'post' || method === 'put') {
    config.data = data;
  }

  return await axiosInstance[method](url, config);
};

// Fetch categories
export const fetchCategories = createAsyncThunk(
  'productCategory/fetchCategories',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest('get', `${API_URL}/api/categories`, null, searchParams);
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(ErrorMessage(error));
    }
  }
);

// Get category by ID
export const fetchCategoryById = createAsyncThunk(
  'productCategory/fetchCategoryById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest('get', `${API_URL}/api/categories/${categoryId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(ErrorMessage(error));
    }
  }
);

// Create category
export const createCategory = createAsyncThunk(
  'productCategory/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      for (const key in categoryData) {
        formData.append(key, categoryData[key]);
      }
      console.log("categoryData", formData)
      const response = await axios.post(`${API_URL}/api/categories`, formData);

      // const response = await axios.post(`${API_URL}/api/categories`, categoryData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(ErrorMessage(error));
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  'productCategory/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      for (const key in categoryData) {
        formData.append(key, categoryData[key]);
      }

      const response = await axios.put(`${API_URL}/api/categories/${categoryId}`, formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(ErrorMessage(error));
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  'productCategory/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await makeAuthorizedRequest('delete', `${API_URL}/api/categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      return rejectWithValue(ErrorMessage(error));
    }
  }
);

// Initial state
const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
};

// Create slice
const productCategorySlice = createSlice({
  name: 'productCategory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload;
        state.categories = state.categories.map((c) =>
          c._id === updatedCategory._id ? updatedCategory : c
        );
        if (state.currentCategory && state.currentCategory._id === updatedCategory._id) {
          state.currentCategory = updatedCategory;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const categoryId = action.payload;
        state.categories = state.categories.filter((c) => c._id !== categoryId);
        if (state.currentCategory && state.currentCategory._id === categoryId) {
          state.currentCategory = null;
        }
      });
  },
});

export default productCategorySlice.reducer;
