'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import { Category } from '@/app/Types';
import { FiCamera } from 'react-icons/fi';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { useAuth } from '../Providers/AuthContext/AuthContext';

interface EditPodcastPopupProps {
  isOpen: boolean;
  onClose: () => void;
  podcast: {
    _id: string;
    podcastName: string;
    podcastDescription: string;
    categories: { _id: string; categoryName: string }[];
    podcastImage: string;
    creator: { _id: string };
  };
  onUpdated: (p: any) => void;
}

export default function EditPodcastPopup({
  isOpen,
  onClose,
  podcast,
  onUpdated,
}: EditPodcastPopupProps) {
  const { token } = useAuth();

  const [form, setForm] = useState({
    podcastName: podcast.podcastName,
    podcastDescription: podcast.podcastDescription,
    category: podcast.categories[0]?._id || '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    podcast.podcastImage
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load categories
  useEffect(() => {
    fetch('http://localhost:3000/category')
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Reset form when podcast changes
  useEffect(() => {
    setForm({
      podcastName: podcast.podcastName,
      podcastDescription: podcast.podcastDescription,
      category: podcast.categories[0]?._id || '',
    });
    setImagePreview(podcast.podcastImage);
    setImageFile(null);
  }, [podcast]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (catId: string) => {
    setForm({ ...form, category: catId });
    setShowDropdown(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('podcastName', form.podcastName);
    formData.append('podcastDescription', form.podcastDescription);
    formData.append('creator', podcast.creator._id);
    formData.append('categories', form.category);
    if (imageFile) {
      formData.append('podcastImage', imageFile);
    }
    const res = await fetch(
      `http://localhost:3000/podcast/${podcast._id}`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    if (!res.ok) {
      alert('Update failed');
      return;
    }
    const updated = await res.json();
    onUpdated(updated);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Podcast">
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
                alt="Cover preview"
                className="absolute inset-0 w-full h-full object-cover rounded z-0"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
            </>
          ) : (
            <IoMusicalNotesOutline className="absolute text-5xl text-gray-500 group-hover:opacity-0 transition-opacity duration-300" />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-white z-20">
            <FiCamera className="text-2xl mb-1" />
            Change Image
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
          <div ref={dropdownRef} className="relative w-full">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 text-left flex items-center justify-between"
            >
              <span>
                {form.category
                  ? categories.find((c) => c._id === form.category)
                      ?.categoryName
                  : 'Select Category'}
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

          {/* Buttons */}
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
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
