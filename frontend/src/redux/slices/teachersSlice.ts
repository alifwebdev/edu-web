import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { Teacher } from "@/types/api";

export const fetchTeachers = createAsyncThunk(
  "teachers/fetch",
  async () => (await api.get<Teacher[]>("/teachers")).data
);
export const createTeacher = createAsyncThunk(
  "teachers/create",
  async (payload: FormData | Partial<Teacher>) => {
    if (payload instanceof FormData)
      return (
        await api.post("/teachers", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    return (await api.post("/teachers", payload)).data;
  }
);
export const updateTeacher = createAsyncThunk(
  "teachers/update",
  async ({
    id,
    payload,
  }: {
    id: number;
    payload: FormData | Partial<Teacher>;
  }) => {
    if (payload instanceof FormData)
      return (
        await api.put(`/teachers/${id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    return (await api.put(`/teachers/${id}`, payload)).data;
  }
);
export const deleteTeacher = createAsyncThunk(
  "teachers/delete",
  async (id: number) => {
    await api.delete(`/teachers/${id}`);
    return id;
  }
);

type S = { items: Teacher[]; loading: boolean; error?: string | null };
const initial: S = { items: [], loading: false, error: null };
const slice = createSlice({
  name: "teachers",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTeachers.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchTeachers.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
      })
      .addCase(fetchTeachers.rejected, (s, { error }) => {
        s.loading = false;
        s.error = error.message;
      });
    b.addCase(createTeacher.fulfilled, (s, { payload }) => {
      s.items.unshift(payload);
    });
    b.addCase(updateTeacher.fulfilled, (s, { payload }) => {
      s.items = s.items.map((i) => (i.id === payload.id ? payload : i));
    });
    b.addCase(deleteTeacher.fulfilled, (s, { payload }) => {
      s.items = s.items.filter((i) => i.id !== payload);
    });
  },
});
export default slice.reducer;
