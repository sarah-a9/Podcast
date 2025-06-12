'use client';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/Providers/AuthContext/AuthContext';
import EpisodeCard from '../components/EpisodeCard/EpisodeCard';

export default function LikedEpisodesPage() {
  const { user, token } = useAuth(); // Get the user data from the context
  const [likedEpisodes, setLikedEpisodes] = useState<any[]>([]); // Store full podcast details
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state


  useEffect(()=>{
    if (user){
        fetchLikedEpisodes(user._id); // Fetch podcasts using the user ID
    }
  },[user]);

    // Fetch user's favorite podcasts from your API
    const fetchLikedEpisodes = async (userId:string)=>{
        try{
            const res = await fetch(`http://localhost:3000/user/${userId}/likedEpisodes`, {
               method: 'GET',
               headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type':'application/json',
               },

            });

            if(!res.ok){
                throw new Error('Failed to fetch liked episodes');
            }

            const data = await res.json();
            console.log('fetched user data', data);

            const likedEpisodesData = data.likedEpisodes || []; // Default to an empty array if not present

            if (Array.isArray(likedEpisodesData)){
                setLikedEpisodes(likedEpisodesData);
            }else {
                setLikedEpisodes([]);
                console.error('likedEpisodes is not an array :', likedEpisodesData);
            }
    }catch(error:any){
        console.error('Error fetching liked episodes:', error);
        setError(error.message || 'An unknown error occured');
    }finally{
        setLoading(false);
    }

    };
    if (loading){
        return <div>loading...</div>
    }

    if (error) {
        return <div>{error}</div>; // Display error if any
      }

    if (likedEpisodes.length === 0){
      return (
        <div className="flex flex-col items-center justify-center h-[78vh] bg-gray-900 rounded-lg text-center px-6">
          <div className="text-4xl mb-4 text-purple-500">💔</div>
          <h2 className="text-2xl font-semibold text-white mb-2">No Liked Episodes Yet</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            It looks a bit quiet here... Start exploring and tap the heart icon on episodes you love to see them here!
          </p>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition"
            onClick={() => window.location.href = '/'} 
          >
            Discover Episodes
          </button>
        </div>
      );
    }


  return (
    <div className='height-[40vh] bg-gray-900 rounded-lg pl-6 overflow-y-auto'>
    <h1 className="text-2xl font-bold mb-4">Your Liked Episodes</h1>
    <div className='scrollable-container scrollbar-hide '>
    {likedEpisodes.map((episode) => (
      <EpisodeCard key={episode._id} episode={episode} podcast={episode.podcast}  />
    ))}
    </div>
  </div>
  )
}

