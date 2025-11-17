import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { Program } from "@/types/api";

export const fetchPrograms = createAsyncThunk(
  "programs/fetch",
  async () => (await api.get<Program[]>("/programs")).data
);
export const createProgram = createAsyncThunk(
  "programs/create",
  async (payload: Partial<Program>) =>
    (await api.post("/programs", payload)).data
);
export const updateProgram = createAsyncThunk(
  "programs/update",
  async ({ id, payload }: { id: number; payload: Partial<Program> }) =>
    (await api.put(`/programs/${id}`, payload)).data
);
export const deleteProgram = createAsyncThunk(
  "programs/delete",
  async (id: number) => {
    await api.delete(`/programs/${id}`);
    return id;
  }
);

type S = { items: Program[]; loading: boolean; error?: string | null };
const initial: S = { items: [], loading: false, error: null };
const slice = createSlice({
  name: "programs",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPrograms.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchPrograms.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
      })
      .addCase(fetchPrograms.rejected, (s, { error }) => {
        s.loading = false;
        s.error = error.message;
      });
    b.addCase(createProgram.fulfilled, (s, { payload }) => {
      s.items.unshift(payload);
    });
    b.addCase(updateProgram.fulfilled, (s, { payload }) => {
      s.items = s.items.map((i) => (i.id === payload.id ? payload : i));
    });
    b.addCase(deleteProgram.fulfilled, (s, { payload }) => {
      s.items = s.items.filter((i) => i.id !== payload);
    });
  },
});
export default slice.reducer;
