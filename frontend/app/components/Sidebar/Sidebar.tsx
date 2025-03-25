// 



"use client";

import React, { useState } from "react";
import { Menu, Plus, ChevronLeft, ChevronRight, Star, Heart, Download, Folder } from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`h-full bg-gray-900 text-white p-4 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } rounded-2xl shadow-lg flex flex-col relative`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="text-white">
          <Menu size={24} />
        </button>
        {!isCollapsed && <span className="text-lg font-semibold">Your Library</span>}
        <button className="text-white">
          <Plus size={24} />
        </button>
      </div>
      
      {/* Menu Items */}
      <div className="mt-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Star size={24} />
          {!isCollapsed && <span>Favourites Podcasts</span>}
        </div>
        <div className="flex items-center space-x-2">
          <Heart size={24} />
          {!isCollapsed && <span>Favourites Episodes</span>}
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
    </div>
  );
};

export default Sidebar;
