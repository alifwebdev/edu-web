"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();
  const links = [
    { name: "Overview", href: "/dashboard" },
    { name: "Users", href: "/dashboard/users" },
    { name: "Menus", href: "/dashboard/menus" },
    { name: "Hero", href: "/dashboard/hero" },
    { name: "About", href: "/dashboard/about" },
    { name: "Notices", href: "/dashboard/notices" },
    { name: "Programs", href: "/dashboard/programs" },
    { name: "Gallery", href: "/dashboard/gallery" },
    { name: "Teachers", href: "/dashboard/teachers" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen p-4">
      <div className="text-2xl font-bold mb-6">Admin</div>
      <nav className="space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`block px-3 py-2 rounded ${
              path === l.href ? "bg-slate-700" : "hover:bg-slate-700"
            }`}
          >
            {l.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
