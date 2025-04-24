'use client';
import React from 'react';
import Modal from './Modal';
import { useAuth } from '../Providers/AuthContext/AuthContext';

interface Props {
  isOpen: boolean;
  podcastId: string;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeletePodcastPopup({
  isOpen, onClose, podcastId, onDeleted
}: Props) {
  const { token } = useAuth();

  const del = async () => {
    const res = await fetch(`http://localhost:3000/podcast/${podcastId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return alert('Delete failed');
    onDeleted();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Podcast?">
      <p>This cannot be undone.</p>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-4 py-2 bg-gray-500 rounded text-white">
          Cancel
        </button>
        <button onClick={del} className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700">
          Delete
        </button>
      </div>
    </Modal>
  );
}
