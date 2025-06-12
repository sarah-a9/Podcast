// /app/all-podcasts/page.tsx
'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import PodcastCard from '../components/PodcastCard/PodcastCard';

const AllPodcasts = () => {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    console.log('Fetching all podcasts...');
    fetch('http://localhost:3000/podcast')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPodcasts(data);
        } else {
          console.error('Received data is not an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching podcasts:', error);
      });
  }, []);

  return (
    <div className="h-screen container mx-auto pl-6 scrollable-container scrollbar-hide bg-gray-900  rounded-lg">
      <h2 className="text-3xl font-semibold pb-5 ">All Podcasts</h2>
      <div className="podcast-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-y-auto scrollbar-hide">
        {podcasts.length > 0 ? (
          podcasts.map((podcast) => (
            <PodcastCard
              key={podcast._id}
              podcastName={podcast.podcastName}
              podcastDescription={podcast.podcastDescription}
              podcastImage={`http://localhost:3000/uploads/podcasts/${podcast.podcastImage}`} 
              creator={podcast.creator}
              id={podcast._id}
            />
          ))
        ) : (
          <p>No podcasts available.</p>
        )}
      </div>
    </div>
  );
};

export default AllPodcasts;
