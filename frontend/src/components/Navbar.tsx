"use client";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <div className="font-semibold">Dashboard</div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600">{user?.name}</div>
        <button
          onClick={() => dispatch(logout())}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
