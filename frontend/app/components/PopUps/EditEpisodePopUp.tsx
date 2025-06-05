// src/app/components/PopUps/EditEpisodePopUp.tsx

"use client";

import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useAuth } from "../Providers/AuthContext/AuthContext";
import { Episode } from "@/app/Types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode | null;
  podcastId: string;
  creatorId: string;
}

enum EpisodeStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  SCHEDULED = "scheduled",
}

export default function EditEpisodePopup({
  isOpen,
  onClose,
  episode,
  podcastId,
  creatorId,
}: Props) {
  // ← Call useAuth() at top level
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [status, setStatus] = useState<EpisodeStatus>(EpisodeStatus.DRAFT);
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => {
    if (episode) {
      setTitle(episode.episodeTitle);
      setDescription(episode.episodeDescription);
      setStatus(episode.status as EpisodeStatus);
      if (episode.scheduledAt) {
        const dt = new Date(episode.scheduledAt);
        setScheduledAt(dt.toISOString().slice(0, 16));
      } else {
        setScheduledAt("");
      }
      setAudioFile(null);
    }
  }, [episode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const submitEdit = async () => {
    if (!episode) return;
    if (!title || !description) {
      alert("Title and description are required");
      return;
    }
    if (status !== EpisodeStatus.DRAFT && !audioFile && !episode.audioUrl) {
      alert("Please select an audio file or leave draft");
      return;
    }
    if (status === EpisodeStatus.SCHEDULED && !scheduledAt) {
      alert("Pick a future date/time");
      return;
    }

    if (!token) {
      alert("You must be logged in to edit an episode.");
      return;
    }

    const form = new FormData();
    form.append("episodeTitle", title);
    form.append("episodeDescription", description);
    form.append("podcast", podcastId);
    form.append("creator", creatorId);
    form.append("status", status);
    if (status === EpisodeStatus.SCHEDULED) {
      form.append("scheduledAt", scheduledAt);
    }
    if (audioFile) {
      form.append("audioFile", audioFile);
    }

    try {
      const res = await fetch(`http://localhost:3000/episode/${episode._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (res.status === 401) {
        alert("Your session is invalid or expired. Please log in again.");
        return;
      }
      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        alert("Error updating episode: " + text);
        return;
      }

      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error updating episode");
    }
  };

  if (!isOpen || !episode) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Episode">
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
        <label className="flex flex-col p-2 bg-gray-700 text-white rounded">
          {episode.audioUrl ? "Replace Audio File (optional)" : "Select Audio File"}
          <input
            type="file"
            accept="audio/*"
            className="mt-2"
            onChange={handleFileChange}
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-2 rounded ${
              status === EpisodeStatus.PUBLISHED
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-600"
            } text-white`}
            onClick={() => setStatus(EpisodeStatus.PUBLISHED)}
            type="button"
          >
            Publish
          </button>
          <button
            className={`px-4 py-2 rounded ${
              status === EpisodeStatus.DRAFT
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-600"
            } text-white`}
            onClick={() => setStatus(EpisodeStatus.DRAFT)}
            type="button"
          >
            Draft
          </button>
          <button
            className={`px-4 py-2 rounded ${
              status === EpisodeStatus.SCHEDULED
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-600"
            } text-white`}
            onClick={() => setStatus(EpisodeStatus.SCHEDULED)}
            type="button"
          >
            Scheduled
          </button>
        </div>

        {status === EpisodeStatus.SCHEDULED && (
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-500 rounded text-white"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
            onClick={submitEdit}
            type="button"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
