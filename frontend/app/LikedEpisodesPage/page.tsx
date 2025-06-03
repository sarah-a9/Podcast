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
        return<div> No liked episodes yet . Add some to your Liked Episodes !</div>
    }

  return (
    <div className='height-[40vh]'>
    <h1 className="text-2xl font-bold mb-4">Your Liked Episodes</h1>
    <div className='scrollable-container scrollbar-hide '>
    {likedEpisodes.map((episode) => (
      <EpisodeCard key={episode._id} episode={episode} podcast={episode.podcast}  />
    ))}
    </div>
  </div>
  )
}

