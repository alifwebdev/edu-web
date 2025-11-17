// src/app/register/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { register } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (auth.token) router.push("/dashboard");
  }, [auth.token, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(
      register({ name: form.name, email: form.email, password: form.password })
    );
    if (register.fulfilled.match(res)) router.push("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border p-2 rounded"
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border p-2 rounded"
              type="password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            {auth.loading ? "Registering..." : "Register"}
          </button>
          {auth.error && (
            <p className="text-red-600 text-sm mt-2">{auth.error}</p>
          )}
        </form>
      </div>
    </main>
  );
}
