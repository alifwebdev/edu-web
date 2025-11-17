// src/app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout is server component; AuthGuard is client and will redirect if no token
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
