'use client';

import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { CreatePodcastPopupProps, Category } from "../../Types";

export default function CreatePodcastPopup({ isOpen, onClose, onPodcastCreated }: CreatePodcastPopupProps) {
  const [form, setForm] = useState({
    podcastName: "",
    podcastDescription: "",
    category: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const creator = localStorage.getItem("userId");
    if (!creator) {
      alert("User not logged in");
      return;
    }
  
    const payload = {
      podcastName: form.podcastName,
      podcastDescription: form.podcastDescription,
      podcastImage: "", // or imagePreview if you want to store base64 (optional)
      categories: form.category ? [form.category] : [],
      creator,
    };
  
    try {
      const res = await fetch("http://localhost:3000/podcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
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
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Your Podcast">
      <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap" encType="multipart/form-data">
        {/* Left: Image */}
        <div className="flex flex-col items-center">
          {imagePreview ? (
            <img src={imagePreview} alt="Podcast preview" className="w-24 h-24 rounded-lg object-cover mb-2" />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gray-700 mb-2 flex items-center justify-center text-gray-400">
              Image
            </div>
          )}
          <input
            type="file"
            name="podcastImage"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col flex-1 gap-3">
          <input
            type="text"
            name="podcastName"
            placeholder="Podcast Name"
            value={form.podcastName}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
          <textarea
            name="podcastDescription"
            placeholder="Podcast Description"
            value={form.podcastDescription}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          <div className="flex justify-end mt-4">
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
