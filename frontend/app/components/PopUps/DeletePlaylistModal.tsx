"use client";
import React from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAuth } from "../Providers/AuthContext/AuthContext";

type DeletePlaylistModalProps = {
  onClose: () => void;
  onDelete: () => void;
  playlistName: string;
  playlistId: string; // Assuming the playlist has an ID to delete it
};

const DeletePlaylistModal: React.FC<DeletePlaylistModalProps> = ({
  onClose,
  onDelete,
  playlistName,
  playlistId,
}) => {
  const { user, token } = useAuth();
  const handleDeletePlaylist = async () => {
    try {
      const res = await fetch(`http://localhost:3000/Playlist/${playlistId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed to delete playlist.");
        return;
      }
      if (!user || !token) {
        toast.error("You must be logged in to edit a playlist.");
        return;
      }

      toast.success("Playlist deleted successfully!");
      onDelete(); // Update the UI after successful deletion
      onClose(); // Close modal
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-900/30 z-50">
  <div className="relative bg-white text-white px-8 py-6 rounded-2xl w-[450px] min-h-[100px] shadow-lg flex flex-col justify-between">
    {/* <button
      onClick={onClose}
      className="absolute top-6 right-4 text-gray-400 hover:bg-gray-500 rounded-full p-1 text-2xl"
      aria-label="Close"
    >
      <IoClose />
    </button> */}

    <div className="text-center">
      <p className="text-xl mb-4 font-bold text-black">
      Delete {playlistName} from your playlists?
      </p>
      <p className="text-sm text-black mb-6">
        This will delete <strong>{playlistName}</strong> from your playlists.
      </p>
    </div>

    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={onClose}
        className="w-28 py-3 px-4 bg-gray-500 text-white text-sm font-semibold rounded-full hover:opacity-90"
      >
        Cancel
      </button>
      <button
        onClick={handleDeletePlaylist}
        className="w-28 py-3 px-4 bg-red-600 text-white text-sm font-semibold rounded-full hover:opacity-90"
      >
        Delete
      </button>
    </div>
  </div>
</div>

  );
};

export default DeletePlaylistModal;
