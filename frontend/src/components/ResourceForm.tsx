// src/components/ResourceForm.tsx
"use client";
import React from "react";

export type Field = {
  name: string;
  label?: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
};

type Props = {
  initial?: Record<string, any>;
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void;
  submitLabel?: string;
};

export default function ResourceForm({
  initial = {},
  fields,
  onSubmit,
  submitLabel = "Save",
}: Props) {
  const [state, setState] = React.useState<Record<string, any>>(initial);

  // initialize once, but update when initial has real content
  React.useEffect(() => {
    if (initial && Object.keys(initial).length > 0) {
      setState(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // also respond when initial changes from undefined -> object (optional)
  React.useEffect(() => {
    if (initial && Object.keys(initial).length > 0) {
      setState(initial);
    }
  }, [initial]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setState((p) => ({ ...p, [name]: value }));
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(state);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-4"
    >
      {fields.map((f) => (
        <div key={f.name}>
          <label className="block text-sm mb-1 font-medium">
            {f.label ?? f.name}
          </label>
          {f.textarea ? (
            <textarea
              name={f.name}
              value={state[f.name] ?? ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder={f.placeholder}
            />
          ) : (
            <input
              name={f.name}
              value={state[f.name] ?? ""}
              onChange={handleChange}
              type={f.type ?? "text"}
              className="w-full border p-2 rounded"
              placeholder={f.placeholder}
            />
          )}
        </div>
      ))}

      <div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
