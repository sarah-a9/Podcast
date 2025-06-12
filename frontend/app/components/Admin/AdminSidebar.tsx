"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Podcast,
  ListMusic,
  FolderKanban,
  BarChart3,
  LogOut,
} from "lucide-react";
import clsx from "clsx";

const navLinks = [

  {
    href: "../../Users",
    label: "Users",
    icon: Users,
    color: "text-pink-400",
  },
  {
    href: "../../Admin/podcasts",
    label: "Podcasts",
    icon: Podcast,
    color: "text-blue-400",
  },
  {
    href: "../../Admin/episodes",
    label: "Episodes",
    icon: ListMusic,
    color: "text-green-400",
  },
  {
    href: "../../AllCategories",
    label: "Categories",
    icon: FolderKanban,
    color: "text-purple-400",
  },
  {
    href: "../../DashboardAdminPage",
    label: "Analytics",
    icon: BarChart3,
    color: "text-red-400",
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="sticky h-screen height bg-gray-900 text-white p-6 w-70 shadow-xl flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>

      <nav className="space-y-4">
        {navLinks.map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-md transition-colors duration-200",
              pathname === href
                ? "bg-gray-700 font-semibold text-white"
                : "hover:bg-gray-700 hover:text-white",
            )}
          >
            <Icon className={clsx("w-5 h-5", color)} />
            <span>{label}</span>
          </Link>
        ))}

        {/* <Link
          href="/auth/logout"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-red-700 hover:text-white mt-6 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 text-red-400" />
          Logout
        </Link> */}
      </nav>
    </div>
  );
};

export default AdminSidebar;
