"use client";

import { useState } from "react";
import { Search, Sun, User } from "lucide-react";
import { GoHome } from "react-icons/go";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../components/Providers/AuthContext/AuthContext";
import LogoutPopup from "../PopUps/LogoutPopUp" // Import LogoutPopup

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, setToken } = useAuth();

  // Hide Navbar on auth pages
  if (pathname.startsWith("/auth")) return null;

  const handleLogout = () => {
    setShowLogoutModal(false); // Close the modal
    // Clear auth info
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.push("/"); // Redirect to homepage
  };

  return (
    <div className="bg-black sticky top-0 text-white z-50">
      <nav className="flex items-center justify-between p-4">
        {/* Left Column */}
        <div className="w-1/3"></div>

        {/* Center Column */}
        <div className="relative w-1/3 flex items-center justify-center space-x-4">

          {/* Home Icon */}
          <Link
            href="/"
            className="text-gray-400 hover:text-white bg-gray-800 rounded-full p-3"
          >
            <GoHome size={25} />
          </Link>

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

        {/* Right Column */}
        <div className="w-1/3 flex items-center justify-end gap-4">

          {/* Theme Toggle */}
          <button className="p-3 rounded-lg hover:bg-gray-800">
            <Sun size={20} />
          </button>
          
          {user ? (
            // Authenticated Dropdown
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-700 hover:border-purple-500"
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
                <div className="absolute right-0 mt-2 w-32 bg-gray-900 text-white rounded-lg shadow-lg">
                  <ul>
                    <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                      <Link href={`/Profile/me`} onClick={() => setMenuOpen(false)} >Profile</Link>
                    </li>
                    <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                      <Link href="/settings" onClick={() => setMenuOpen(false)} >Settings</Link>
                    </li>
                    <li
                      onClick={() => {
                        setMenuOpen(false);
                        setShowLogoutModal(true); // Show the logout confirmation modal
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
            // Not Authenticated → Login button + Signup link
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

      {/* Logout Confirmation Modal */}
      <LogoutPopup
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirmLogout={handleLogout}
      />
    </div>
  );
};

export default Navbar;
