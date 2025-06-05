'use client';
import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../Providers/AuthContext/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  podcastId: string;
  creatorId: string;
  podcastImage: string; // can be ignored on backend, but passed
}

enum EpisodeStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
}

export default function CreateEpisodePopup({
  isOpen,
  onClose,
  podcastId,
  creatorId,
}: Props) {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [status, setStatus] = useState(EpisodeStatus.PUBLISHED);
  const [scheduledAt, setScheduledAt] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setAudioFile(e.target.files[0]);
  };

  const submit = async (saveStatus: EpisodeStatus) => {
    if (!title || !description || (saveStatus !== EpisodeStatus.DRAFT && !audioFile)) {
      alert('Please fill all required fields');
      return;
    }

    const form = new FormData();
    form.append('episodeTitle', title);
    form.append('episodeDescription', description);
    form.append('podcast', podcastId);
    form.append('creator', creatorId);
    form.append('status', saveStatus);
    if (saveStatus === EpisodeStatus.SCHEDULED) {
      form.append('scheduledAt', scheduledAt);
    }
    if (audioFile) form.append('audioFile', audioFile);

    const res = await fetch('http://localhost:3000/episode/create', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      
      body: form,
    });

    if (!res.ok) {
      console.error(await res.text());
      alert('Error saving episode');
    } else {
      onClose();
      window.location.reload();
    }
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
        <label className="flex flex-col p-2 bg-gray-700 text-white rounded">
          Select Audio File
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
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-600'
            } text-white`}
            onClick={() => setStatus(EpisodeStatus.PUBLISHED)}
            type="button"
          >
            Publish
          </button>
          <button
            className={`px-4 py-2 rounded ${
              status === EpisodeStatus.DRAFT
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-600'
            } text-white`}
            onClick={() => setStatus(EpisodeStatus.DRAFT)}
            type="button"
          >
            Draft
          </button>
          <button
            className={`px-4 py-2 rounded ${
              status === EpisodeStatus.SCHEDULED
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-600'
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
            onClick={onClose}   // ← simply close the modal
            type="button"
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
            onClick={() => submit(status)}
            type="button"
          >
            {status === EpisodeStatus.SCHEDULED
              ? 'Schedule'
              : status === EpisodeStatus.PUBLISHED
              ? 'Publish'
              : 'Save Draft'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
