"use client";

import { useAuth } from "@/app/components/Providers/AuthContext/AuthContext";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import AdminSidebar from "@/app/components/Admin/AdminSidebar";
import AudioPlayerBar from "@/app/components/AudioPlayerBar/AudioPlayerBar";
import Navbar from "@/app/components/Navbar/Navbar";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col  ">
      <Navbar />
      <div className="flex flex-1 pl-2">
        {user && user.role === 0 ? <AdminSidebar /> : <Sidebar />}
        <div className="main-content pl-2 pr-2 w-full h-full overflow-y-auto scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </div>
      <AudioPlayerBar />
    </div>
  );
};

export default LayoutContent;