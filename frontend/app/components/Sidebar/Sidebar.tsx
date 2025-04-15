"use client";

import React, { useState } from "react";
import {
  Menu,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Download,
  Folder,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CreatePlaylistModal from "../CreatePlaylistModal/CreatePlaylistModal";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  // Hide Sidebar on auth pages
  if (pathname.startsWith("/auth")) return null;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div
      className={`sticky h-screen height bg-gray-800 text-white p-4 transition-all duration-300 ${
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
        <div className="flex items-center space-x-2">
          <Link
            href="/FavoritePodcastsPage"
            className="flex items-center space-x-2"
          >
            <Star size={24} />
            {!isCollapsed && <span>Favourites Podcasts</span>}
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/LikedEpisodesPage"
            className="flex items-center space-x-2"
          >
            <Heart size={24} />
            {!isCollapsed && <span>Liked Episodes</span>}
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Download size={24} />
          {!isCollapsed && <span>Downloads</span>}
        </div>
        <div className="flex items-center space-x-2">
          <Folder size={24} />
          {!isCollapsed && <span>My Playlists</span>}
        </div>
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
        <CreatePlaylistModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Sidebar;
