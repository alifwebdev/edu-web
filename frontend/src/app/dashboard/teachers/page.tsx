"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "@/redux/slices/teachersSlice";
import Modal from "@/components/Modal";
import EntityForm from "@/components/EntityForm";
import FileUpload from "@/components/FileUpload";

export default function TeachersPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.teachers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchTeachers() as any);
  }, [dispatch]);

  async function onSubmit(data: any) {
    const fd = new FormData();
    for (const k of Object.keys(data)) if (data[k]) fd.append(k, data[k]);
    if (file) fd.append("profile", file);
    if (editing)
      await dispatch(updateTeacher({ id: editing.id, payload: fd }) as any);
    else await dispatch(createTeacher(fd) as any);
    setOpen(false);
    setFile(null);
    setEditing(null);
    dispatch(fetchTeachers() as any);
  }

  async function onDelete(id: number) {
    if (!confirm("Delete?")) return;
    await dispatch(deleteTeacher(id) as any);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Teachers</h2>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          items.map((t) => (
            <div key={t.id} className="border rounded p-3">
              <img
                src={t.profile_path || "/placeholder.png"}
                alt={t.name}
                className="w-full h-36 object-cover rounded mb-2"
              />
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-500">{t.designation}</div>
              <div className="mt-2">
                <button
                  onClick={() => {
                    setEditing(t);
                    setOpen(true);
                  }}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </button>
                <button onClick={() => onDelete(t.id)} className="text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Teacher" : "Create Teacher"}
      >
        <EntityForm
          defaultValues={editing || undefined}
          fields={[
            { name: "name", label: "Name" },
            { name: "designation", label: "Designation" },
            { name: "phone", label: "Phone" },
            { name: "email", label: "Email" },
            { name: "short_bio", label: "Short Bio" },
          ]}
          onSubmit={onSubmit}
        />
        <div className="mt-3">
          <FileUpload onFile={(f) => setFile(f)} />
        </div>
      </Modal>
    </div>
  );
}
