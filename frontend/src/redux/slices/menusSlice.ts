import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { Menu } from "@/types/api";

export const fetchMenus = createAsyncThunk(
  "menus/fetch",
  async () => (await api.get<Menu[]>("/menus")).data
);

export const createMenu = createAsyncThunk(
  "menus/create",
  async (payload: Partial<Menu>) => (await api.post("/menus", payload)).data
);

export const updateMenu = createAsyncThunk(
  "menus/update",
  async ({ id, payload }: { id: number; payload: Partial<Menu> }) =>
    (await api.put(`/menus/${id}`, payload)).data
);

export const deleteMenu = createAsyncThunk(
  "menus/delete",
  async (id: number) => {
    await api.delete(`/menus/${id}`);
    return id;
  }
);

type S = { items: Menu[]; loading: boolean; error?: string | null };
const initial: S = { items: [], loading: false, error: null };

const slice = createSlice({
  name: "menus",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMenus.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchMenus.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
      })
      .addCase(fetchMenus.rejected, (s, { error }) => {
        s.loading = false;
        s.error = error.message || null;
      });

    b.addCase(createMenu.fulfilled, (s, { payload }) => {
      s.items.unshift(payload);
    });

    b.addCase(updateMenu.fulfilled, (s, { payload }) => {
      s.items = s.items.map((i) => (i.id === payload.id ? payload : i));
    });

    b.addCase(deleteMenu.fulfilled, (s, { payload }) => {
      s.items = s.items.filter((i) => i.id !== payload);
    });
  },
});

export default slice.reducer;
