import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { User } from "@/types/api";

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await api.get<User[]>("/users");
  return res.data;
});

export const createUser = createAsyncThunk(
  "users/create",
  async (payload: Partial<User>) => {
    const res = await api.post("/users", payload);
    return res.data;
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, payload }: { id: number; payload: any }) => {
    const res = await api.put(`/users/${id}`, payload);
    return res.data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: number) => {
    await api.delete(`/users/${id}`);
    return id;
  }
);

type State = { items: User[]; loading: boolean; error?: string | null };
const initial: State = { items: [], loading: false, error: null };

const slice = createSlice({
  name: "users",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchUsers.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || null;
      });

    b.addCase(createUser.fulfilled, (s, { payload }) => {
      s.items.unshift(payload);
    });

    b.addCase(updateUser.fulfilled, (s, { payload }) => {
      s.items = s.items.map((i) => (i.id === payload.id ? payload : i));
    });

    b.addCase(deleteUser.fulfilled, (s, { payload }) => {
      s.items = s.items.filter((i) => i.id !== payload);
    });
  },
});

export default slice.reducer;
