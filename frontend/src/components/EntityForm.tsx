"use client";
import React from "react";
import {
  useForm,
  type FieldValues,
  type Path,
  type SubmitHandler,
  type DefaultValues,
} from "react-hook-form";

export default function EntityForm<F extends FieldValues>({
  defaultValues,
  fields,
  onSubmit,
}: {
  defaultValues?: Partial<F>;
  fields: { name: Path<F>; label: string; type?: string }[];
  onSubmit: SubmitHandler<F>;
}) {
  // Convert Partial<F> → DefaultValues<F>
  const castDefaults = React.useMemo(
    () => (defaultValues ? (defaultValues as DefaultValues<F>) : undefined),
    [defaultValues]
  );

  const { register, handleSubmit, reset } = useForm<F>({
    defaultValues: castDefaults,
  });

  React.useEffect(() => {
    reset(castDefaults);
  }, [castDefaults, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3">
        {fields.map((f) => (
          <div key={String(f.name)}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {f.label}
            </label>
            <input
              {...register(f.name)}
              type={f.type || "text"}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <div className="flex gap-2 justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
