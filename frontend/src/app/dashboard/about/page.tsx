"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAbout, upsertAbout } from "@/redux/slices/aboutSlice";
import Modal from "@/components/Modal";
import EntityForm from "@/components/EntityForm";
import FileUpload from "@/components/FileUpload";
import Image from "next/image";

export default function AboutPage() {
  const dispatch = useAppDispatch();
  const { item, loading } = useAppSelector((s) => s.about);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    dispatch(fetchAbout() as any);
  }, [dispatch]);

  async function onSubmit(data: any) {
    const fd = new FormData();
    if (data.mission) fd.append("mission", data.mission);
    if (data.vision) fd.append("vision", data.vision);
    if (data.history) fd.append("history", data.history);
    files.forEach((f) => fd.append("images[]", f));
    await dispatch(upsertAbout(fd) as any);
    setOpen(false);
    setFiles([]);
    dispatch(fetchAbout() as any);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">About</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Edit About
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="mb-3">
              <strong>Mission:</strong> {item?.mission}
            </div>
            <div className="mb-3">
              <strong>Vision:</strong> {item?.vision}
            </div>
            <div className="mb-3">
              <strong>History:</strong> {item?.history}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {item?.images?.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`about-${i}`}
                  width={300}
                  height={112}
                  className="w-full h-28 object-cover rounded"
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Edit About">
        <EntityForm
          defaultValues={item || undefined}
          fields={[
            { name: "mission", label: "Mission" },
            { name: "vision", label: "Vision" },
            { name: "history", label: "History" },
          ]}
          onSubmit={onSubmit}
        />
        <div className="mt-3">
          <label className="block text-sm text-gray-700">Add Images</label>
          <FileUpload onFile={(f) => setFiles((prev) => [...prev, f])} />
        </div>
      </Modal>
    </div>
  );
}
