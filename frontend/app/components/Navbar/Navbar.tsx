"use client";

import { useState } from "react";
import { Search, Sun, User } from "lucide-react";
import { GoHome } from "react-icons/go";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../components/Providers/AuthContext/AuthContext";
import LogoutPopup from "../PopUps/LogoutPopUp";
import Image from "next/image";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("podcast");

  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, setToken } = useAuth();

  // Hide Navbar on auth pages
  if (pathname.startsWith("/auth")) return null;

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.push("/");
  };

  const handleSearch = () => { 
    if (searchQuery.length > 0) {
      // Redirect to the SearchPage with query and filter as URL parameters
      router.push(`/Search?q=${searchQuery}&filter=${searchFilter}`);
    }
  };

  console.log("Search Query:", searchQuery);
  console.log("Search Filter:", searchFilter);
  console.log("User:", user?.profilePic);

  return (
    <div className="bg-black sticky top-0 text-white">
      <nav className="flex items-center justify-between py-0.5 px-4 relative">

        {/* LOGO + NOM A GAUCHE */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logoPodcast.png"
            alt="AudiAura logo"
            width={0}
            height={0}
            sizes="150px"
            className="w-[150px] h-auto rounded-full object-contain"
          />
        </Link>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
        <Link
          href="/"
          className="text-gray-400 hover:text-purple-500 bg-gray-800 rounded-full p-3"
        >
          <GoHome size={25} />
        </Link>

        <div className="relative flex gap-2 items-center w-[400px]">
          <div className="relative flex flex-1">
            <Search
              onClick={handleSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-500 transition"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search podcasts, episodes, creators..."
              className="w-full pl-10 pr-32 py-3 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 transition"
            />
            <select
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full px-4 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer hover:bg-gray-700 transition"
            >
              <option value="podcast">Podcast</option>
              <option value="episode">Episode</option>
              <option value="creator">Profile</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

        {/* USER MENU */}

        <div className="w-1/3 flex items-center justify-end gap-4">
          {/* <button className="p-3 rounded-lg hover:bg-gray-800">
            <Sun size={20} />
          </button> */}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700 hover:border-purple-500"
              >
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-800">
                    <User size={20} className="text-white" />
                  </div>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-gray-900 text-white rounded-lg shadow-lg z-50">
                  <ul>
                    <Link href={`/Profile/me`} onClick={() => setMenuOpen(false)}>
                      <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                        Profile
                      </li>
                    </Link>

                    <li
                      onClick={() => {
                        setMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                    >
                      Sign out
                    </li>
                  </ul>
                </div>
              )}

            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition text-white px-4 py-2 rounded-full font-semibold shadow-md"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hover:underline"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      <LogoutPopup
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirmLogout={handleLogout}
      />
    </div>
  );
};

export default Navbar;
