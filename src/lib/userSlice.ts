import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const signupUser = createAsyncThunk(
  'user/signupUser',
  async (userData: { name: string; email: string; password: string; rePassword: string; dateOfBirth: string; gender: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://linked-posts.routemisr.com/users/signup', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Signup failed');
    }
  }
);

export const signinUser = createAsyncThunk(
  'user/signinUser',
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://linked-posts.routemisr.com/users/signin', userData);
      
      const { token, user } = response.data;

      localStorage.setItem('userToken', token);

      return user;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Signin failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
