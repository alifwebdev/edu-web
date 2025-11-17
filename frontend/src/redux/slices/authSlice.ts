import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest, logoutRequest, meRequest } from "@/lib/auth";
import type { User } from "@/types/api";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error?: string | null;
};

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const data = await loginRequest(email, password);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const fetchMe = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    return await meRequest();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutRequest();
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(login.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.user = payload.user;
        s.token = payload.access_token;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })
      .addCase(fetchMe.fulfilled, (s, { payload }) => {
        s.user = payload;
      })
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.token = null;
        localStorage.removeItem("token");
      });
  },
});

export default slice.reducer;
