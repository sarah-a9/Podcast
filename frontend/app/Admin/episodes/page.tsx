"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Episode {
  _id: string;
  episodeTitle: string;
  episodeDescription: string;
  podcast: {
    _id: string;
    podcastName: string;
    podcastImage: string;
    creator: {
      firstName: string;
      lastName: string;
    };
  };
}

const EpisodeListPage = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEpisodes = async () => {
    try {
      const res = await fetch("http://localhost:3000/episode"); // make sure this endpoint is correct
      const data = await res.json();
      setEpisodes(data);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">All Episodes</h1>
      {loading ? (
        <p>Loading episodes...</p>
      ) : episodes.length === 0 ? (
        <p>No episodes found.</p>
      ) : (
        <div className="space-y-4">
            {episodes.map((episode) => (
                <div
                key={episode._id}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-200"
                >
                <h2 className="text-xl font-semibold">{episode.episodeTitle}</h2>
                <p className="text-sm text-gray-400">
                    Podcast: {episode.podcast.podcastName}
                </p>
                <p className="text-sm text-gray-400">
                    Creator: {episode.podcast.creator.firstName} {episode.podcast.creator.lastName}
                </p>
                <p className="text-sm text-gray-300 line-clamp-2">{episode.episodeDescription}</p>
                <Link
                href={`/PodcastDetail/${episode.podcast._id}/EpisodeDetail/${episode._id}`}
                className="text-amber-400 hover:underline text-sm mt-2 inline-block"
                >
                View Details
                </Link>     
                </div>
            ))}
            </div>
      )}
    </div>
  );
};

export default EpisodeListPage;
