// src/components/ResourceTable.tsx
"use client";

type Column = { key: string; label: string };

type Props<T extends { id: number }> = {
  items: T[];
  columns: Column[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function ResourceTable<T extends { id: number }>({
  items,
  columns,
  onEdit,
  onDelete,
}: Props<T>) {
  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left p-3">
                {c.label}
              </th>
            ))}
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const rec = item as unknown as Record<string, unknown>;
            return (
              <tr key={item.id} className="border-t">
                {columns.map((c) => {
                  const v = rec[c.key];
                  return (
                    <td key={c.key} className="p-3">
                      {v === undefined ? "-" : String(v)}
                    </td>
                  );
                })}
                <td className="p-3">
                  {onEdit && (
                    <button
                      className="mr-2 text-blue-600"
                      onClick={() => onEdit(item.id)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="text-red-600"
                      onClick={() => onDelete(item.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
