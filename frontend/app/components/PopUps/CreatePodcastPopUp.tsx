'use client';

import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { CreatePodcastPopupProps, Category } from "../../Types";
import { FiCamera } from "react-icons/fi";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { useAuth } from "../Providers/AuthContext/AuthContext";

export default function CreatePodcastPopup({
  isOpen,
  onClose,
  onPodcastCreated,
}: CreatePodcastPopupProps) {
  const [form, setForm] = useState({
    podcastName: "",
    podcastDescription: "",
    category: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, token } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/category");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (catId: string) => {
    setSelectedCategory(catId);
    setForm({ ...form, category: catId });
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!user || !user._id || !token) {
      alert("User not logged in");
      return;
    }
  
    const creator = user._id;
    const formData = new FormData();
    formData.append("podcastName", form.podcastName);
    formData.append("podcastDescription", form.podcastDescription);
    formData.append("creator", creator);
  
    // Append selected category (even though it's one, format it like an array)
    formData.append("categories", form.category); // If supporting only one category
  
    // OR if you plan to support multiple in the future:
    // form.category.split(',').forEach((catId) => {
    //   formData.append("categories", catId.trim());
    // });
  
    if (imageFile) formData.append("podcastImage", imageFile);
  
    try {
      const res = await fetch("http://localhost:3000/podcast", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type' should NOT be set when sending FormData with fetch
        },
        body: formData,
      });
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create podcast.");
      }
  
      const newPodcast = await res.json();
      alert("Podcast created successfully!");
      onClose();
      if (onPodcastCreated) onPodcastCreated(newPodcast);
    } catch (error: any) {
      console.error("Podcast creation failed:", error.message);
      alert(`Podcast creation failed: ${error.message}`);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Your Podcast">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row gap-6"
        encType="multipart/form-data"
      >
        {/* Image Upload Section */}
        <div
          onClick={handleImageClick}
          className="w-40 h-40 bg-gray-700 flex items-center justify-center rounded relative group cursor-pointer overflow-hidden"
        >
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
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
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Input Fields Section */}
        <div className="flex-1 flex flex-col gap-4">
          <input
            type="text"
            name="podcastName"
            placeholder="Podcast Name"
            value={form.podcastName}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
          />
          <textarea
            name="podcastDescription"
            placeholder="Podcast Description"
            value={form.podcastDescription}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 resize-none"
          />

          {/* Custom Scrollable Dropdown */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 text-left flex items-center justify-between"
            >
              <span>
                {selectedCategory
                  ? categories.find((c) => c._id === selectedCategory)?.categoryName
                  : "Select Category"}
              </span>
              <span
                className={`transition-transform duration-300 ${
                  showDropdown ? 'rotate-180' : 'rotate-0'
                }`}
              >
                ▾
              </span>
            </button>

            {showDropdown && (
              <ul className="absolute z-10 w-full max-h-20 overflow-y-auto bg-gray-700 border border-gray-600 rounded mt-1 shadow-lg">
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    onClick={() => handleSelect(cat._id)}
                    className="p-2 hover:bg-gray-600 text-white cursor-pointer"
                  >
                    {cat.categoryName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-black rounded"
          >
            Cancel
          </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
