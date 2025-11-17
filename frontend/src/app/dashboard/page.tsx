"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    users: 0,
    notices: 0,
    programs: 0,
    teachers: 0,
  });
  const [notices, setNotices] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const [u, n, p, t] = await Promise.all([
          api.get("/users"),
          api.get("/notices"),
          api.get("/programs"),
          api.get("/teachers"),
        ]);
        setStats({
          users: u.data.length,
          notices: n.data.length,
          programs: p.data.length,
          teachers: t.data.length,
        });
        setNotices(n.data.slice(-6).reverse());
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  const pieData = [
    { name: "Users", value: stats.users },
    { name: "Notices", value: stats.notices },
    { name: "Programs", value: stats.programs },
  ];
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm">Users</div>
          <div className="text-3xl font-bold">{stats.users}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm">Notices</div>
          <div className="text-3xl font-bold">{stats.notices}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm">Programs</div>
          <div className="text-3xl font-bold">{stats.programs}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
              >
                {pieData.map((e, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Recent Notices</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notices.map((n) => (
              <div key={n.id} className="p-2 border rounded">
                {n.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
