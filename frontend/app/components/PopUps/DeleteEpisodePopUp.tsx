// src/app/components/PopUps/DeleteEpisodeConfirm.tsx
"use client";

import React from "react";
import Modal from "./Modal";
import { useAuth } from "../Providers/AuthContext/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  episodeId: string;
  onDeleted: () => void;
}

export default function DeleteEpisodeConfirm({
  isOpen,
  onClose,
  episodeId,
  onDeleted,
}: Props) {
  const { token } = useAuth();

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/episode/${episodeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        alert("Failed to delete episode: " + text);
        return;
      }

      onClose();
      onDeleted();
    } catch (error) {
      console.error("Error deleting episode:", error);
      alert("An error occurred while deleting the episode.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Episode">
      <p className="text-white mb-4">
        Are you sure you want to delete this episode? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 rounded text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
