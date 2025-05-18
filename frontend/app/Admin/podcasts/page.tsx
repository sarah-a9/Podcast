'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Podcast } from '../../Types';
import Link from 'next/link';
import CreatePodcastPopup from '../../components/PopUps/CreatePodcastPopUp';



export default function AdminPodcastList() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const router = useRouter();
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/podcast') // Adjust to your actual endpoint
      .then((res) => res.json())
      .then((data) => setPodcasts(data))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">All Podcasts</h2>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowCreatePopup(true)}
          className="bg-gradient-to-r from-purple-900 via-purple-600 to-purple-400 rounded-xl shadow-md hover:scale-105 transition-transform text-white font-bold py-2 px-4"
        >
          + Create Podcast
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {podcasts.map((podcast) => (
            <div
            key={podcast._id}
            onClick={() => router.push(`/PodcastDetail/${podcast._id}`)}
            className="cursor-pointer bg-gray-800 rounded-lg shadow-md p-4 hover:bg-gray-700 transition duration-200"
            >
            {/* You can add an image here if podcast has one */}
            <img
                className="rounded-lg w-full h-40 object-cover bg-gray-300 mb-4"
                src={`http://localhost:3000/uploads/podcasts/${podcast.podcastImage}`}
                alt={podcast.podcastName} ></img>
            <h3 className="text-xl font-semibold mb-1">{podcast.podcastName}</h3>
            <p className="text-gray-400 text-sm mb-1">
              by creator:{" "}
              <Link
                href={`/Users/${podcast.creator._id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-purple-300 hover:underline"
              >
                {podcast.creator.firstName} {podcast.creator.lastName}
              </Link>
            </p>


            <p className="text-gray-300 text-sm mb-2">{podcast.podcastDescription}</p>
            {/* <p className="text-gray-300 text-sm mb-2">Categories: {podcast.categories.map((cat) => cat.cate).join(', ')}</p> */}
            <p className="text-gray-300 text-sm">Episodes: {podcast.episodes.length}</p>
            </div>
        ))}

        <CreatePodcastPopup
          isOpen={showCreatePopup}
          onClose={() => setShowCreatePopup(false)}
          onPodcastCreated={(newPodcast) => {
            setPodcasts((prev) => [newPodcast, ...prev]);
          } } isAdmin={false}        />  

        </div>
    </div>
    
  );

}
