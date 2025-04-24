"use client";

import ActionButtons from "@/app/components/EpisodeActionButtons/EpisodeActionButtons";
import { useAuth } from "@/app/components/Providers/AuthContext/AuthContext"; // Import the useAuth hook
import { Podcast } from "@/app/Types";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { use, useEffect, useState } from "react";
import { MdOutlineAccessTime } from "react-icons/md";

const EpisodeDetail = ({ params }: { params: Promise<{ id: string; episodeId: string }> }) => {
  const { id, episodeId } = use(params);  
  const [episode, setEpisode] = useState<{
    _id: string;
    episodeTitle: string;
    episodeDescription: string;
    audioUrl: string;
    podcast: Podcast;
    likedByUsers: string[];
    createdAt : string;
    categories: any[];
    status: string;
  } | null>(null); // Initialize as null instead of an empty array
  const [liked, setLiked] = useState(false);
  const { user, setUser } = useAuth(); // Access user and setUser from context
  // const { playEpisode, currentEpisode, isPlaying } = useAudio();
  const router = useRouter();

  // Fetch episode data when component mounts
  useEffect(() => {
    fetch(`http://localhost:3000/podcast/${id}/episode/${episodeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setEpisode(data);
        } else {
          console.error("No data received:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching episode:", error);
      });
  }, [id, episodeId]);

  useEffect(() => {
    if (user && episode) {
      // Check if the episode is in the user's likedEpisodes
      setLiked(user.likedEpisodes.includes(episode._id));
    }
  }, [user, episode]); // Re-run when user or episode changes

  const handleLikeClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click event from propagating to the parent div
    if (user && episode) {
      // Update likedEpisodes in AuthContext
      const updatedLikedEpisodes = liked
        ? user.likedEpisodes.filter((id) => id !== episode._id) // Remove episode from likedEpisodes
        : [...user.likedEpisodes, episode._id]; // Add episode to likedEpisodes

      // Update the context with the new likedEpisodes list
      setUser({
        ...user,
        likedEpisodes: updatedLikedEpisodes,
      });
    }
    setLiked(!liked); // Toggle local liked state
  };

  const handleOnClick = () => {
    router.push(`/PodcastDetail/${episode?.podcast._id}`);
  };

  return (
    <div className="scrollable-container scrollbar-hide h-full text-white rounded-lg">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full flex flex-col">
        {episode ? (
          <>
            {/* Episode Details */}
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-1">
                <img
                  className="rounded-2xl"
                  src={episode.podcast.podcastImage}
                  alt={episode.podcast.podcastName}
                />
              </div>
              <div className="col-span-4">
                <h2 className="text-3xl font-bold mb-4">{episode.episodeTitle}</h2>
                <p className="text-lg mb-4">
                  Created by {episode.podcast.creator.firstName} 
                  {episode.podcast.creator.lastName}
                </p>
                <div className="text-sm text-gray-300 mb-4">
                  <p className="text-gray-400 italic">
                    {episode.episodeDescription}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  <Link href={`/PodcastDetail/${episode.podcast._id}`} className="hover:underline">
                    {episode.podcast.podcastName}
                  </Link>
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="mt-4 mb-4">
              <hr style={{ color: "grey" }} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-6">
              <p className="flex items-center gap-2 mt-4">
                <MdOutlineAccessTime size={30} />
                Duration
              </p>

              <ActionButtons
                  episode={episode}
                  podcast={episode.podcast}
                isLiked={liked}
                onLikeClick={handleLikeClick}
                size="lg" showMenu={false} setShowMenu={function (value: React.SetStateAction<boolean>): void {
                  throw new Error("Function not implemented.");
                } }              />
            </div>

            {/* Episode Description */}
            <div className="mt-6">
              <p className="text-2xl">Episode Description</p>
              <p className="text-l text-gray-400 mt-4">{episode.episodeDescription}</p>
            </div>

            {/* See Episodes Button */}
            <div className="mt-20">
              <button
               
                className="bg-amber-50 text-black px-4 py-2 rounded-full hover:bg-gray-600 transition"
               
                onClick={handleOnClick}
              
              >
                See Episodes
              </button>
            </div>
          </>
        ) : (
          <p className="text-xl text-gray-400">episode not found.</p>
        )}
      </div>
    </div>
  );
};

export default EpisodeDetail;