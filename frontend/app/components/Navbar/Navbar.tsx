"use client";
import { useState } from "react";
import { Search, Sun, User } from "lucide-react";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { GoHome } from "react-icons/go";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // Hide Navbar on auth pages
  if (pathname.startsWith('/auth')) return null;

  return (
    <div className="bg-black sticky top-0 z-10 text-white">
      <nav className="flex items-center justify-between p-4">
    
        <div className="relative w-1/3 flex items-center">
        {/* Home Icon */}
         <Link href="/" className="text-gray-400 hover:text-white mr-2">
          <GoHome size={25} />
        </Link>
       </div>
        {/* Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search podcasts..."
            className="w-full p-2 pl-10 bg-gray-800 text-white rounded-lg focus:outline-none"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
        </div>
        

        {/* Right Side: Theme Toggle + Profile */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button className="p-2 rounded-lg hover:bg-gray-800">
            <Sun size={20} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <User size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-gray-900 text-white rounded-lg shadow-lg">
                <ul>
                  <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer">Profile</li>
                  <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer">Settings</li>
                  <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer">Login</li>
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
