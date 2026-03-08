import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginApi, registerApi } from '../api/authApi';
import type { LoginPayload, RegisterPayload, AuthApiResponse } from '../api/authApi';

interface AuthState {
  accessToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  status: 'idle',
  error: null,
};

export const register = createAsyncThunk<AuthApiResponse, RegisterPayload>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      return await registerApi(payload);
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const login = createAsyncThunk<AuthApiResponse, LoginPayload>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      return await loginApi(payload);
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const usersSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('accessToken');
    },
    resetAuthStatus(state) {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(register.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })

      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
  },
});

export const { logout, resetAuthStatus } = usersSlice.actions;

export const selectToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.accessToken;
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default usersSlice.reducer;
