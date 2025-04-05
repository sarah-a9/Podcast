"use client";
import React, { useEffect, useState } from "react";

interface Episode {
  _id: string;
  episodeTitle: string;
  episodeDescription: string;
  audioUrl: string;
  createdAt: string;
}
const EpisodeDetail = ({ params }: {  episodeId: string } ) => {
  const [podcast, setPodcast] = useState<{
    creator: any;
    _id: string;
    podcastName: string;
    podcastDescription: string;
    podcastImage: string;
    episodes: Episode[];
    categories: any[];
  } | null>(null); // Initialize as null instead of an empty array

  useEffect(() => {
    console.log("Params:", params); 
    fetch(`http://localhost:3000/podcast/${params.podcastId}/episode/${params.episodeId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Log to inspect the structure
        // Assuming the API returns a single podcast, not an array
        if (data) {
          setPodcast(data);
        } else {
          console.error("No data received:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching podcast:", error);
      });
  }, [params.podcastId, params.episodeId]);

  return (
    <div className="h-full text-white rounded-2xl">
      <div className="bg-gray-800 p-8 rounded-2xl h-screen shadow-lg w-full mb-4 flex flex-col">
        {podcast ? (
          <></>
        ) : (
          <p className="text-xl text-gray-400">Podcast not found. </p>
        )}
      </div>
    </div>
  );
};

export default EpisodeDetail;
