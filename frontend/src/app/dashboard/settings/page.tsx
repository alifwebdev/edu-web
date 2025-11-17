"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchSettings, saveSettings } from "@/redux/slices/settingsSlice";
import Modal from "@/components/Modal";
import EntityForm from "@/components/EntityForm";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((s) => s.settings);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    dispatch(fetchSettings() as any);
  }, [dispatch]);
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function onSubmit(data: any) {
    await dispatch(saveSettings(data) as any);
    alert("Saved");
    dispatch(fetchSettings() as any);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div className="bg-white p-4 rounded shadow">
        <EntityForm
          defaultValues={form}
          fields={[
            { name: "phone", label: "Phone" },
            { name: "email", label: "Email" },
            { name: "address", label: "Address" },
            { name: "facebook", label: "Facebook" },
            { name: "youtube", label: "YouTube" },
            { name: "google_map_embed", label: "Google Map Embed" },
          ]}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
