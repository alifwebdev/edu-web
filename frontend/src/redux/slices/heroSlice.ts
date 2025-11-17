import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { Hero } from "@/types/api";

export const fetchHero = createAsyncThunk(
  "hero/fetch",
  async () => (await api.get<Hero>("/hero")).data
);
export const upsertHero = createAsyncThunk(
  "hero/upsert",
  async (payload: FormData | Partial<Hero>) => {
    if (payload instanceof FormData) {
      const res = await api.post("/hero", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } else {
      return (await api.post("/hero", payload)).data;
    }
  }
);
export const updateHero = createAsyncThunk(
  "hero/update",
  async ({
    id,
    payload,
  }: {
    id?: number;
    payload: FormData | Partial<Hero>;
  }) => {
    if (payload instanceof FormData) {
      const res = await api.put(`/hero/${id ?? ""}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } else return (await api.put(`/hero/${id ?? ""}`, payload)).data;
  }
);

type S = { item: Hero | null; loading: boolean; error?: string | null };
const initial: S = { item: null, loading: false, error: null };

const slice = createSlice({
  name: "hero",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchHero.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchHero.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.item = payload;
      })
      .addCase(fetchHero.rejected, (s, { error }) => {
        s.loading = false;
        s.error = error.message;
      });
    b.addCase(upsertHero.fulfilled, (s, { payload }) => (s.item = payload));
    b.addCase(updateHero.fulfilled, (s, { payload }) => (s.item = payload));
  },
});
export default slice.reducer;
