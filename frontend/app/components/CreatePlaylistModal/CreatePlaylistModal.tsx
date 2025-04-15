"use client";
import React, { useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { IoClose, IoMusicalNotesOutline } from "react-icons/io5";

type CreatePlaylistModalProps = {
  onClose: () => void;
};

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({ onClose }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCreatePlaylist = async () => {
    if (!name.trim()) {
      alert("Please enter a playlist name.");
      return;
    }

    // const [formData, setFormData] = useState({
    //   podcastName: "",
    //   podcastDescription: "",
    //   podcastImg: "",
    //   userId: "",
    // });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/Playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create playlist.");
      }
      console.log(formData);

      const data = await response.json();
      console.log("Playlist created:", data);
      onClose(); // close modal
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while creating the playlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-900/30 z-50">
      <div className="relative bg-gray-800 text-white p-6 rounded-2xl w-[500px] shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-4 text-gray-400 hover:bg-gray-500 rounded-full p-1 text-2xl"
          aria-label="Close"
        >
          <IoClose />
        </button>

        <h2 className="text-2xl font-bold mb-6">Create Your Playlist</h2>

        <div className="flex flex-row gap-4">
          {/* Image Upload Section */}
          <div
            onClick={handleImageClick}
            className="w-40 h-40 bg-gray-700 flex items-center justify-center rounded relative group cursor-pointer overflow-hidden"
          >
            {selectedImage ? (
              <>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="absolute inset-0 w-full h-full object-cover rounded z-0"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
              </>
            ) : (
              <IoMusicalNotesOutline className="absolute text-5xl text-gray-500 group-hover:opacity-0 transition-opacity duration-300" />
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-white z-20">
              <FiCamera className="text-2xl mb-1" />
              Choose photo
            </div>
          </div>

          {/* Input Fields */}
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

        {/* Submit Button */}
        <button
          onClick={handleCreatePlaylist}
          disabled={loading}
          className="w-full mt-4 py-2 bg-white text-black font-bold rounded-full hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {/* Hidden File Input */}
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
              setSelectedImage(imageUrl);
            }
          }}
        />
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
