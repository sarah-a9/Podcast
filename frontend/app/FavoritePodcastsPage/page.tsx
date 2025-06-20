'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../components/Providers/AuthContext/AuthContext';
import PodcastCard from '../components/PodcastCard/PodcastCard';

export default function FavoritePodcastPage() {
  const { user, token } = useAuth(); // Get the user data from the context
  const [favoritePodcasts, setFavoritePodcasts] = useState<any[]>([]); // Store full podcast details
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state

  useEffect(() => {
    if (user) {
      fetchFavoritePodcasts(user._id); // Fetch podcasts using the user ID
    }
  }, [user]);

  // Fetch user's favorite podcasts from your API
  const fetchFavoritePodcasts = async (userId: string) => {
    try {
      // API call to get the user's favorite podcasts
      const res = await fetch(`http://localhost:3000/user/${userId}/favoritePodcasts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include token for authentication
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch favorite podcasts');
      }

      const data = await res.json();
      console.log('Fetched user data:', data);  // Log the full user data

      // Extract favoritePodcasts array from the response
      const favoritePodcastsData = data.favoritePodcasts || [];  // Default to an empty array if not present

      // Check if the favoritePodcasts data is an array
      if (Array.isArray(favoritePodcastsData)) {
        setFavoritePodcasts(favoritePodcastsData);  // Set the favorite podcasts if it's an array
      } else {
        setFavoritePodcasts([]); // Set an empty array if it's not an array
        console.error('favoritePodcasts is not an array:', favoritePodcastsData);
      }
    } catch (error: any) {
      console.error('Error fetching favorite podcasts:', error);
      setError(error.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error if any
  }

  if (favoritePodcasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[78vh] bg-gray-900 rounded-lg text-center px-6">
        <div className="text-4xl mb-4 text-yellow-400">🎧</div>
        <h2 className="text-2xl font-semibold text-white mb-2">No Favorite Podcasts Yet</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          You haven't favorited any podcasts yet. Discover amazing content and add your favorites here!
        </p>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition"
          onClick={() => window.location.href = '/'}
        >
          Go to Home
        </button>
      </div>
    );
  }


  return (
    <div className="scrollable-container scrollbar-hide bg-gray-900 rounded-lg pl-6 ">
  <h1 className='text-2xl font-bold mb-4'>Your Favorite Podcasts</h1>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-7">
    {favoritePodcasts.map((podcast) => (
      <PodcastCard
        key={podcast._id}
        id={podcast._id}
        podcastName={podcast.podcastName}
        podcastImage={`http://localhost:3000/uploads/podcasts/${podcast.podcastImage}`} 
        podcastDescription={podcast.podcastDescription}
        creator={{
          firstName: podcast.creator.firstName,
          lastName: podcast.creator.lastName,
        }}
      />
    ))}
  </div>
</div>

  );
}
