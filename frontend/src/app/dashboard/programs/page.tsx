"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "@/redux/slices/programsSlice";
import Modal from "@/components/Modal";
import EntityForm from "@/components/EntityForm";

export default function ProgramsPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.programs);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchPrograms() as any);
  }, [dispatch]);

  async function onSubmit(data: any) {
    if (editing)
      await dispatch(updateProgram({ id: editing.id, payload: data }) as any);
    else await dispatch(createProgram(data) as any);
    setOpen(false);
    setEditing(null);
    dispatch(fetchPrograms() as any);
  }

  async function onDelete(id: number) {
    if (!confirm("Delete?")) return;
    await dispatch(deleteProgram(id) as any);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Programs</h2>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add Program
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-3">
            {items.map((p) => (
              <div
                key={p.id}
                className="p-3 border rounded flex justify-between"
              >
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-500">{p.description}</div>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setEditing(p);
                      setOpen(true);
                    }}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
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
        title={editing ? "Edit Program" : "Create Program"}
      >
        <EntityForm
          defaultValues={editing || undefined}
          fields={[
            { name: "title", label: "Title" },
            { name: "description", label: "Description" },
            { name: "duration", label: "Duration" },
            { name: "fees", label: "Fees" },
          ]}
          onSubmit={onSubmit}
        />
      </Modal>
    </div>
  );
}
