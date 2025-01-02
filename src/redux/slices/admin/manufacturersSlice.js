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

// Fetch manufacturers
export const fetchManufacturers = createAsyncThunk(
  'manufacturers/fetchManufacturers',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest('get', `${API_URL}/api/manufacturers`, null, searchParams);
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(ErrorMessage(error));
    }
  }
);

// Create manufacturer
export const createManufacturer = createAsyncThunk(
  'manufacturers/createManufacturer',
  async (manufacturerData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      for (const key in manufacturerData) {
        formData.append(key, manufacturerData[key]);
      }
      const response = await axios.post(`${API_URL}/api/manufacturers`, formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(ErrorMessage(error));
    }
  }
);

// Delete manufacturer
export const deleteManufacturer = createAsyncThunk(
  'manufacturers/deleteManufacturer',
  async (manufacturerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/api/manufacturers/${manufacturerId}`);
      return manufacturerId;
    } catch (error) {
      return rejectWithValue(ErrorMessage(error));
    }
  }
);

const manufacturersSlice = createSlice({
  name: 'manufacturers',
  initialState: {
    manufacturers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchManufacturers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchManufacturers.fulfilled, (state, action) => {
        state.loading = false;
        state.manufacturers = action.payload;
      })
      .addCase(fetchManufacturers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createManufacturer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createManufacturer.fulfilled, (state, action) => {
        state.loading = false;
        state.manufacturers.push(action.payload);
      })
      .addCase(createManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteManufacturer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteManufacturer.fulfilled, (state, action) => {
        state.loading = false;
        state.manufacturers = state.manufacturers.filter(
          (manufacturer) => manufacturer._id !== action.payload
        );
      })
      .addCase(deleteManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default manufacturersSlice.reducer;
