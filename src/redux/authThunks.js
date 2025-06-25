// src/features/auth/authThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showError, showSuccess } from "../Utils/toast";
import axiosInstance from "../api/axiosInstance";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      // Send as raw JSON (not FormData)
      const response = await axiosInstance.post("/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.data, "response from register");
      showSuccess(response.data.message || "User registered successfully");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      showError(message);
      return rejectWithValue(message);
    }
  }
);

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (loginData, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/auth/login", loginData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const user = response.data?.user;
//       const token = user?.token;

//       if (token) {
//         localStorage.setItem("token", token);
//       }

//       showSuccess(response.data?.message || "Logged in successfully");
//       return user; 
//     } catch (error) {
//       const message = error.response?.data?.message || error.message;
//       showError(message);
//       return rejectWithValue(message);
//     }
//   }
// );

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const user = response.data?.user;
      const token = user?.token;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      showSuccess(response.data?.message || "Logged in successfully");
      return { user, token };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      showError(message);
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post(
        '/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem('token');
      showSuccess(response.data.message || 'Logged out successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      showError(message);
      return rejectWithValue(message);
    }
  }
);

// Thunk to fetch all users
export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data; // data array from response
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      showError(message);
      return rejectWithValue(message);
    }
  }
);

export const searchUser = createAsyncThunk(
  "auth/searchUser",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/auth/search?search=${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data; // array of matched users
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);
