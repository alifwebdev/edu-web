"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/redux/slices/usersSlice";
import Modal from "@/components/Modal";
import EntityForm from "@/components/EntityForm";
import DataTable from "@/components/DataTable";
import type { User } from "@/types/api";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.users);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, [dispatch]);

  async function onSubmit(data: any) {
    if (editing)
      await dispatch(updateUser({ id: editing.id, payload: data }) as any);
    else await dispatch(createUser(data) as any);
    setOpen(false);
    setEditing(null);
    dispatch(fetchUsers() as any);
  }

  async function onDelete(id: number) {
    if (!confirm("Delete user?")) return;
    await dispatch(deleteUser(id) as any);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add User
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <DataTable
            data={items}
            columns={[
              { header: "ID", accessor: "id" },
              { header: "Name", accessor: "name" },
              { header: "Email", accessor: "email" },
              { header: "Role", accessor: (u: User) => u.role ?? "editor" },
              {
                header: "Actions",
                accessor: (u: User) => (
                  <div>
                    <button
                      onClick={() => {
                        setEditing(u);
                        setOpen(true);
                      }}
                      className="text-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(u.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit User" : "Create User"}
      >
        <EntityForm
          defaultValues={editing || undefined}
          fields={[
            { name: "name", label: "Name" },
            { name: "email", label: "Email" },
            { name: "password", label: "Password", type: "password" },
            { name: "role", label: "Role" },
          ]}
          onSubmit={onSubmit}
        />
      </Modal>
    </div>
  );
}
