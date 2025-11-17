import React from "react";

type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
};

export default function DataTable<T>({
  columns,
  data,
}: {
  columns: Column<T>[];
  data: T[];
}) {
  return (
    <table className="w-full border">
      <thead className="bg-slate-100">
        <tr>
          {columns.map((c, i) => (
            <th key={i} className="p-2 text-left">
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, ri) => (
          <tr key={ri} className="border-t hover:bg-gray-50">
            {columns.map((c, ci) => (
              <td key={ci} className="p-2">
                {typeof c.accessor === "function"
                  ? c.accessor(row)
                  : String((row as any)[c.accessor])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
