'use client';
import { useState } from 'react';
import Modal from "./Modal";

export default function CreateEpisodePopup({ isOpen, onClose, podcastId, creatorId, podcastImage }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const handleSubmit = async () => {
    const newEpisode = {
      episodeTitle: title,
      episodeDescription: description,
      audioUrl,
      podcast: podcastId,
      creator: creatorId,
      podcastImage
    };

    await fetch(`http://localhost:3000/episode/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEpisode)
    });

    onClose(); // close modal
    window.location.reload(); // refresh to show new episode
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Episode">
      <div className="flex flex-col gap-4">
        <input
          className="p-2 rounded bg-gray-700 text-white"
          placeholder="Episode Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="p-2 rounded bg-gray-700 text-white"
          placeholder="Episode Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="p-2 rounded bg-gray-700 text-white"
          placeholder="Audio URL"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
        />

        <button
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white font-semibold"
          onClick={handleSubmit}
        >
          Create Episode
        </button>
      </div>
    </Modal>
  );
}
