import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCurrentUserApi, verifyOtpApi, resendOtpApi } from '../api/userApi';
import type { UserDto } from '../api/userApi';
import { logout } from './usersSlice';

interface UserState {
  user: UserDto | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

export const fetchCurrentUser = createAsyncThunk<UserDto>(
  'user/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUserApi();
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const verifyOtp = createAsyncThunk<void, { email: string; code: string }>(
  'user/verifyOtp',
  async ({ email, code }, { rejectWithValue }) => {
    try {
      await verifyOtpApi(email, code);
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const resendOtp = createAsyncThunk<void, string>(
  'user/resendOtp',
  async (email, { rejectWithValue }) => {
    try {
      await resendOtpApi(email);
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserStatus(state) {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      })

      .addCase(fetchCurrentUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(verifyOtp.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.status = 'succeeded';
        if (state.user) state.user.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(resendOtp.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetUserStatus } = userSlice.actions;

export const selectCurrentUser = (state: { user: UserState }) => state.user.user;
export const selectOtpVerified = (state: { user: UserState }) => state.user.user?.otpVerified ?? false;
export const selectUserEmail = (state: { user: UserState }) => state.user.user?.email ?? null;
export const selectUserStatus = (state: { user: UserState }) => state.user.status;
export const selectUserError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;
