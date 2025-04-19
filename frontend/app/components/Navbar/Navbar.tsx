"use client";
import { useState } from "react";
import { Search, Sun, User } from "lucide-react";
import { GoHome } from "react-icons/go";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // Hide Navbar on auth pages
  if (pathname.startsWith("/auth")) return null;

  return (
    <div className="bg-black sticky top-0  text-white">
      <nav className="flex items-center justify-between p-4">
        {/* Left Column: Empty */}
        <div className="w-1/3"></div>

        {/* Center Column: Home Button and Search Bar */}
        <div className="relative w-1/3 flex items-center justify-center space-x-4">
          {/* Home Icon */}
          <Link
            href="/"
            className="text-gray-400 hover:text-white bg-gray-800 rounded-full p-3"
          >
            <GoHome size={25} />
          </Link>

          {/* Search Bar */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search podcasts..."
              className="w-full p-3 pl-10 bg-gray-800 text-white rounded-4xl focus:outline-none "
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Right Column: Sun Icon and Profile */}
        <div className="w-1/3 flex items-center justify-end gap-4">
          {/* Theme Toggle */}
          <button className="p-3 rounded-lg hover:bg-gray-800">
            <Sun size={20} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <User size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-gray-900 text-white rounded-lg shadow-lg">
                <ul>
                  <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                    <Link href={`/Profile/${"defaultUserId"}`}>Profile</Link>
                  </li>
                  <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                    <Link href="/settings">Settings</Link>
                  </li>
                  <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                    <Link href="/signout">Sign out</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
