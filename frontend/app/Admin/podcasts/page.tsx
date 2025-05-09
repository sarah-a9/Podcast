'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Podcast {
  _id: string;
  podcastName: string;
  creator: {
    firstName: string;
    lastName: string;
  };
  episodes: any[];
}

export default function AdminPodcastList() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3000/podcast') // Adjust to your actual endpoint
      .then((res) => res.json())
      .then((data) => setPodcasts(data))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">All Podcasts</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {podcasts.map((podcast) => (
            <div
            key={podcast._id}
            onClick={() => router.push(`/PodcastDetail/${podcast._id}`)}
            className="cursor-pointer bg-gray-800 rounded-lg shadow-md p-4 hover:bg-gray-700 transition duration-200"
            >
            {/* You can add an image here if podcast has one */}
            <h3 className="text-xl font-semibold mb-1">{podcast.podcastName}</h3>
            <p className="text-gray-400 text-sm mb-1">
                by {podcast.creator.firstName} {podcast.creator.lastName}
            </p>
            <p className="text-gray-300 text-sm">Episodes: {podcast.episodes.length}</p>
            </div>
        ))}
        </div>
    </div>
  );
}
