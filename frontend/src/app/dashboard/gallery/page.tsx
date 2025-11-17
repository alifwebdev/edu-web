"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} from "@/redux/slices/gallerySlice";
import Modal from "@/components/Modal";
import EntityForm from "@/components/EntityForm";
import FileUpload from "@/components/FileUpload";

export default function GalleryPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.gallery);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchGallery() as any);
  }, [dispatch]);

  async function onSubmit(data: any) {
    const fd = new FormData();
    if (data.title) fd.append("title", data.title);
    if (file) fd.append("image", file);
    if (editing)
      await dispatch(updateGallery({ id: editing.id, payload: fd }) as any);
    else await dispatch(createGallery(fd) as any);
    setOpen(false);
    setFile(null);
    setEditing(null);
    dispatch(fetchGallery() as any);
  }

  async function onDelete(id: number) {
    if (!confirm("Delete?")) return;
    await dispatch(deleteGallery(id) as any);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gallery</h2>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add Photo
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          items.map((g) => (
            <div key={g.id} className="border rounded overflow-hidden">
              <img
                src={g.image_path}
                alt={g.alt || g.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 flex justify-between items-center">
                <div className="text-sm">{g.title}</div>
                <div>
                  <button
                    onClick={() => {
                      setEditing(g);
                      setOpen(true);
                    }}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(g.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Photo" : "Upload Photo"}
      >
        <EntityForm
          defaultValues={editing || undefined}
          fields={[
            { name: "title", label: "Title" },
            { name: "alt", label: "Alt Text" },
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
