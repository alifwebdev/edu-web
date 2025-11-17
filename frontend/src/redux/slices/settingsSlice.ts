import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { Settings } from "@/types/api";

export const fetchSettings = createAsyncThunk(
  "settings/fetch",
  async () => (await api.get<Settings>("/settings")).data
);
export const saveSettings = createAsyncThunk(
  "settings/save",
  async (payload: Settings) =>
    (await api.post("/settings", { settings: payload })).data
);

type S = { data: Settings | null; loading: boolean; error?: string | null };
const initial: S = { data: null, loading: false, error: null };
const slice = createSlice({
  name: "settings",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchSettings.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchSettings.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.data = payload;
      })
      .addCase(fetchSettings.rejected, (s, { error }) => {
        s.loading = false;
        s.error = error.message;
      });
    b.addCase(saveSettings.fulfilled, (s) => {
      /* no-op */
    });
  },
});
export default slice.reducer;
