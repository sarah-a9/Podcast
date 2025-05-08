"use client";

import React, { useState } from "react";
import {
  Menu,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MdFavorite, MdPlaylistPlay, MdDashboard } from "react-icons/md";
import { FaHeart, FaStar } from "react-icons/fa";
import { HiFolderDownload } from "react-icons/hi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CreatePlaylistModal from "../PopUps/CreatePlaylistModal/CreatePlaylistModal";
import { usePlaylist } from "../Providers/PlaylistContext";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const { addPlaylist } = usePlaylist();

  if (pathname.startsWith("/auth")) return null;

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const menuItems = [
    {
      name: "Favourites Podcasts",
      href: "/FavoritePodcastsPage",
      icon: <FaStar size={20} className="text-yellow-400" />,
    },
    {
      name: "Liked Episodes",
      href: "/LikedEpisodesPage",
      icon: <FaHeart size={20} className="text-pink-500" />,
    },
    {
      name: "My Playlists",
      href: "/AllPlaylistsPage",
      icon: <HiFolderDownload size={20} className="text-blue-400" />,
    },
    {
      name: "Dashboard",
      href: "/DashboardUserPage",
      icon: <MdDashboard size={20} className="text-green-500" />,
    },
  ];

  return (
    <div
      className={`sticky h-screen   height bg-gray-900 text-white p-4 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } rounded-lg shadow-lg flex flex-col relative`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="text-white">
          <Menu size={24} />
        </button>
        {!isCollapsed && (
          <span className="text-lg font-semibold">Your Library</span>
        )}
        {/* Plus Button with Tooltip */}
        <div className="relative group inline-block">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-2 py-1 rounded bg-gray-700 text-white text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[9999] shadow-lg">
            Create a playlist
          </div>
          <button
            onClick={toggleModal}
            className="text-gray-400 text-sm cursor-pointer hover:text-white rounded-full p-2 bg-gray-700 hover:bg-gray-600"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-6 space-y-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-2 py-2 rounded-lg transition-all duration-200 ${
              pathname === item.href
                ? "bg-gray-700 text-white font-semibold"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <div className="p-2 bg-gray-800 rounded-lg flex items-center justify-center">
              {item.icon}
            </div>
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-4 bg-gray-800 p-2 rounded-full text-white"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Modal Component */}
      {isModalOpen && (
        <CreatePlaylistModal
          onClose={() => setIsModalOpen(false)}
          onCreate={(newPlaylist) => addPlaylist(newPlaylist)}
        />
      )}
    </div>
  );
};

export default Sidebar;
