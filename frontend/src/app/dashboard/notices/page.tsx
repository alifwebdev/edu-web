"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "@/redux/slices/noticesSlice";
import Modal from "@/components/Modal";
import EntityForm from "@/components/EntityForm";
import FileUpload from "@/components/FileUpload";

export default function NoticesPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.notices);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchNotices() as any);
  }, [dispatch]);

  async function onSubmit(data: any) {
    const fd = new FormData();
    if (data.title) fd.append("title", data.title);
    if (data.description) fd.append("description", data.description);
    if (data.publish_date) fd.append("publish_date", data.publish_date);
    if (file) fd.append("attachment", file);
    if (editing)
      await dispatch(updateNotice({ id: editing.id, payload: fd }) as any);
    else await dispatch(createNotice(fd) as any);
    setOpen(false);
    setEditing(null);
    setFile(null);
    dispatch(fetchNotices() as any);
  }

  async function onDelete(id: number) {
    if (!confirm("Delete?")) return;
    await dispatch(deleteNotice(id) as any);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notices</h2>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add Notice
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-3">
            {items.map((n) => (
              <div
                key={n.id}
                className="p-3 border rounded flex justify-between"
              >
                <div>
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-sm text-gray-500">{n.description}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setEditing(n);
                      setOpen(true);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(n.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Notice" : "Create Notice"}
      >
        <EntityForm
          defaultValues={editing || undefined}
          fields={[
            { name: "title", label: "Title" },
            { name: "description", label: "Description" },
            { name: "publish_date", label: "Publish Date", type: "date" },
          ]}
          onSubmit={onSubmit}
        />
        <div className="mt-3">
          <label className="block text-sm text-gray-700">Attachment</label>
          <FileUpload onFile={(f) => setFile(f)} />
        </div>
      </Modal>
    </div>
  );
}
