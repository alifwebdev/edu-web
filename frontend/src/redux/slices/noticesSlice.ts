import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { Notice } from "@/types/api";

export const fetchNotices = createAsyncThunk(
  "notices/fetch",
  async () => (await api.get<Notice[]>("/notices")).data
);

export const createNotice = createAsyncThunk(
  "notices/create",
  async (payload: FormData | Partial<Notice>) => {
    if (payload instanceof FormData)
      return (
        await api.post("/notices", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    return (await api.post("/notices", payload)).data;
  }
);

export const updateNotice = createAsyncThunk(
  "notices/update",
  async ({
    id,
    payload,
  }: {
    id: number;
    payload: FormData | Partial<Notice>;
  }) => {
    if (payload instanceof FormData)
      return (
        await api.put(`/notices/${id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    return (await api.put(`/notices/${id}`, payload)).data;
  }
);

export const deleteNotice = createAsyncThunk(
  "notices/delete",
  async (id: number) => {
    await api.delete(`/notices/${id}`);
    return id;
  }
);

type S = { items: Notice[]; loading: boolean; error?: string | null };
const initial: S = { items: [], loading: false, error: null };

const slice = createSlice({
  name: "notices",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNotices.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchNotices.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
      })
      .addCase(fetchNotices.rejected, (s, { error }) => {
        s.loading = false;
        s.error = error.message || null;
      });

    b.addCase(createNotice.fulfilled, (s, { payload }) => {
      s.items.unshift(payload);
    });

    b.addCase(updateNotice.fulfilled, (s, { payload }) => {
      s.items = s.items.map((i) => (i.id === payload.id ? payload : i));
    });

    b.addCase(deleteNotice.fulfilled, (s, { payload }) => {
      s.items = s.items.filter((i) => i.id !== payload);
    });
  },
});

export default slice.reducer;
