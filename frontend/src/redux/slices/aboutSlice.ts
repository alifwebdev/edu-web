import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { About } from "@/types/api";

export const fetchAbout = createAsyncThunk(
  "about/fetch",
  async () => (await api.get<About>("/about")).data
);
export const upsertAbout = createAsyncThunk(
  "about/upsert",
  async (payload: FormData | Partial<About>) => {
    if (payload instanceof FormData)
      return (
        await api.post("/about", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    return (await api.post("/about", payload)).data;
  }
);
export const updateAbout = createAsyncThunk(
  "about/update",
  async ({
    id,
    payload,
  }: {
    id: number;
    payload: FormData | Partial<About>;
  }) => {
    if (payload instanceof FormData)
      return (
        await api.put(`/about/${id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    return (await api.put(`/about/${id}`, payload)).data;
  }
);

type S = { item: About | null; loading: boolean; error?: string | null };
const initial: S = { item: null, loading: false, error: null };

const slice = createSlice({
  name: "about",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchAbout.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchAbout.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.item = payload;
      })
      .addCase(fetchAbout.rejected, (s, { error }) => {
        s.loading = false;
        s.error = error.message;
      });
    b.addCase(upsertAbout.fulfilled, (s, { payload }) => (s.item = payload));
    b.addCase(updateAbout.fulfilled, (s, { payload }) => (s.item = payload));
  },
});
export default slice.reducer;
