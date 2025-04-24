// EditProfilePopup.tsx (refactored)
'use client';

import { useState, useRef } from "react";
import { EditProfilePopupProps } from "../../Types";
import Modal from "./Modal"; // import the generic Modal

export default function EditProfilePopup({ onClose, onSave, user }: EditProfilePopupProps) {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState(user.profilePic || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (reader.result) setImage(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const [selectedImage, setSelectdImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ firstName, lastName, bio, profilePic: image });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Profile Details">
      <form onSubmit={handleSubmit} className="flex gap-4">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={image || '/default-profile.png'}
            alt="Profile"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-80"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e)=> {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                const imageUrl = URL.createObjectURL(file);
                setSelectdImage(imageUrl);
              }

            }}
          />
        </div>
        {/* Inputs */}
        <div className="flex flex-col flex-1 gap-3">
          <div>
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            ></textarea>
          </div>
        </div>
      </form>
      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-black rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
