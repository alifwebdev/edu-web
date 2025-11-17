import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { Gallery } from "@/types/api";

export const fetchGallery = createAsyncThunk(
  "gallery/fetch",
  async () => (await api.get<Gallery[]>("/gallery")).data
);
export const createGallery = createAsyncThunk(
  "gallery/create",
  async (payload: FormData) =>
    (
      await api.post("/gallery", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data
);
export const updateGallery = createAsyncThunk(
  "gallery/update",
  async ({
    id,
    payload,
  }: {
    id: number;
    payload: FormData | Partial<Gallery>;
  }) => {
    if (payload instanceof FormData)
      return (
        await api.put(`/gallery/${id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    return (await api.put(`/gallery/${id}`, payload)).data;
  }
);
export const deleteGallery = createAsyncThunk(
  "gallery/delete",
  async (id: number) => {
    await api.delete(`/gallery/${id}`);
    return id;
  }
);

type S = { items: Gallery[]; loading: boolean; error?: string | null };
const initial: S = { items: [], loading: false, error: null };
const slice = createSlice({
  name: "gallery",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchGallery.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchGallery.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
      })
      .addCase(fetchGallery.rejected, (s, { error }) => {
        s.loading = false;
        s.error = error.message;
      });
    b.addCase(createGallery.fulfilled, (s, { payload }) => {
      s.items.unshift(payload);
    });
    b.addCase(updateGallery.fulfilled, (s, { payload }) => {
      s.items = s.items.map((i) => (i.id === payload.id ? payload : i));
    });
    b.addCase(deleteGallery.fulfilled, (s, { payload }) => {
      s.items = s.items.filter((i) => i.id !== payload);
    });
  },
});
export default slice.reducer;
