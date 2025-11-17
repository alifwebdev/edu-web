"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchHero, upsertHero } from "@/redux/slices/heroSlice";
import Modal from "@/components/Modal";
import EntityForm from "@/components/EntityForm";
import FileUpload from "@/components/FileUpload";

export default function HeroPage() {
  const dispatch = useAppDispatch();
  const { item, loading } = useAppSelector((s) => s.hero);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchHero() as any);
  }, [dispatch]);

  async function onSubmit(data: any) {
    const fd = new FormData();
    if (data.title) fd.append("title", data.title);
    if (data.tagline) fd.append("tagline", data.tagline);
    if (file) fd.append("banner", file);
    await dispatch(upsertHero(fd) as any);
    setOpen(false);
    setFile(null);
    dispatch(fetchHero() as any);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Hero</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Edit Hero
        </button>
      </div>
      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="mb-4">
              <div className="text-lg font-semibold">{item?.title}</div>
              <div className="text-sm">{item?.tagline}</div>
            </div>
            {item?.banner_path && (
              <img
                src={item.banner_path}
                alt="banner"
                className="w-full h-48 object-cover rounded"
              />
            )}
          </>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Edit Hero">
        <EntityForm
          defaultValues={item || undefined}
          fields={[
            { name: "title", label: "Title" },
            { name: "tagline", label: "Tagline" },
          ]}
          onSubmit={onSubmit}
        />
        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">Banner</label>
          <FileUpload onFile={(f) => setFile(f)} />
        </div>
      </Modal>
    </div>
  );
}
