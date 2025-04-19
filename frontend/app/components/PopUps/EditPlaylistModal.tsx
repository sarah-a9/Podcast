import React, { useRef, useState, useEffect } from "react";
import { FiCamera } from "react-icons/fi";
import { IoClose, IoMusicalNotesOutline } from "react-icons/io5";

import toast from "react-hot-toast";
import { Playlist } from "@/app/Types";
import { useAuth } from "../Providers/AuthContext/AuthContext";

type EditPlaylistModalProps = {
  onClose: () => void;
  onEdit: (updatedPlaylist: Playlist) => void;
  playlist: Playlist; // Pass the playlist that needs to be edited
};

const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
  onClose,
  onEdit,
  playlist,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState(playlist.playlistName || "");
  const [description, setDescription] = useState(playlist.playlistDescription || "");
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  // Set selectedImage to existing playlist image when modal opens
  useEffect(() => {
    if (playlist.playlistImg) {
      setSelectedImage(`http://localhost:3000/uploads/playlists/${playlist.playlistImg}`);
    }
  }, [playlist]);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEditPlaylist = async () => {
    if (!name.trim()) {
      toast.error("Please enter a playlist name.");
      return;
    }
    if (!user || !token) {
      toast.error("You must be logged in to edit a playlist.");
      return;
    }
  
    const formData = new FormData();
    formData.append("playlistName", name);
    formData.append("playlistDescription", description);
    if (imageFile) {
      formData.append("playlistImg", imageFile); // Add the image file
    }
  
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/Playlist/${playlist._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send as FormData
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        toast.error(data.message || "Something went wrong.");
        return;
      }
  
      toast.success("Playlist updated successfully!");
      onEdit(data); // Pass the updated playlist
      onClose(); // Optionally close modal after success
    } catch (err) {
      toast.error("Failed to update playlist. Please try again.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-900/30 z-50">
      <div className="relative bg-gray-800 text-white p-6 rounded-2xl w-[500px] shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-6 right-4 text-gray-400 hover:bg-gray-500 rounded-full p-1 text-2xl"
          aria-label="Close"
        >
          <IoClose />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Playlist</h2>

        <div className="flex flex-row gap-4">
          <div
            onClick={handleImageClick}
            className="w-40 h-40 bg-gray-700 flex items-center justify-center rounded relative group cursor-pointer overflow-hidden"
          >
            {selectedImage ? (
              <img
                src={selectedImage} // This will show the selected image (either new or existing)
                alt="Selected"
                className="absolute inset-0 w-full h-full object-cover rounded z-0"
              />
            ) : (
              <IoMusicalNotesOutline className="absolute text-5xl text-gray-500 group-hover:opacity-0 transition-opacity duration-300" />
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-white z-20">
              <FiCamera className="text-2xl mb-1" />
              Choose photo
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist Name"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded resize-none h-26 scrollbar-hide"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <button
            onClick={handleEditPlaylist}
            disabled={loading}
            className="w-28 py-3 px-4 bg-white text-black text-sm font-semibold rounded-full hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImageFile(file);
              const imageUrl = URL.createObjectURL(file);
              setSelectedImage(imageUrl); // Update the state with the new image
            }
          }}
        />
      </div>
    </div>
  );
};

export default EditPlaylistModal;
