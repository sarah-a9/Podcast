"use client";

import ActionButtons from "@/app/components/EpisodeActionButtons/EpisodeActionButtons";
import { useAuth } from "@/app/components/Providers/AuthContext/AuthContext"; // Import the useAuth hook
import StarRating from "@/app/components/StarRating/StarRating";
import { Podcast } from "@/app/Types";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { use, useEffect, useState } from "react";
import { MdOutlineAccessTime } from "react-icons/md";

const EpisodeDetail = ({ params }: { params: Promise<{ id: string; episodeId: string }> }) => {
  const { id, episodeId } = use(params);
  const [episode, setEpisode] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const { user, setUser, token } = useAuth();
  const router = useRouter();

  // Fetch episode details
  const fetchEpisode = async () => {
    try {
      const res = await fetch(`http://localhost:3000/podcast/${id}/episode/${episodeId}`);
      const data = await res.json();
      setEpisode(data);
    } catch (error) {
      console.error("Error fetching episode:", error);
    }
  };

  const fetchUserRating = async () => {
    if (user) {
      try {
        const res = await fetch(`http://localhost:3000/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("user data", data);

        const episodeRating = data.ratings.find(
          (r: any) => String(r.episode) === String(episodeId)
        );

        console.log("user rating", episodeRating);

        const roundedRating = episodeRating ? Math.round(episodeRating.value) : 0;
        setUserRating(roundedRating);
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    }
  };

  useEffect(() => {
    fetchEpisode();
  }, [id, episodeId]);

  useEffect(() => {
    if (user && episode) {
      setLiked(user.likedEpisodes.includes(episode._id));
      fetchUserRating();
    }
  }, [user, episode]);

  const handleLikeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (user && episode) {
      const updatedLikedEpisodes = liked
        ? user.likedEpisodes.filter((id) => id !== episode._id)
        : [...user.likedEpisodes, episode._id];
      setUser({ ...user, likedEpisodes: updatedLikedEpisodes });
    }
    setLiked(!liked);
  };

  const handleOnClick = () => {
    router.push(`/PodcastDetail/${episode?.podcast._id}`);
  };

  // 
  const handleRating = (newAverageRating: number) => {
    // Only update average rating or fetch episode if needed
    fetchEpisode();
  };
  
return (
  <div className="scrollable-container scrollbar-hide h-screen  text-white rounded-lg">
    <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-lg shadow-xl w-full flex flex-col">
      {episode ? (
        <>
          {/* Header Section */}
          <div className="grid grid-cols-6 gap-8 items-center mb-10">
            {/* Episode Image */}
            <div className="col-span-1">
              <img
                className="rounded-xl shadow-lg w-full"
                src={`http://localhost:3000/uploads/podcasts/${episode.podcast.podcastImage}`}
                alt={episode.podcast.podcastName}
              />
            </div>

            {/* Episode Metadata */}
            <div className="col-span-5">
              <div className="flex justify-between items-start">
                <div>
                  {/* <p className="uppercase text-sm text-gray-400 tracking-widest">Podcast Episode</p> */}
                  <h1 className="text-4xl font-extrabold mt-2 mb-6">{episode.episodeTitle}</h1>
                  
                  <div className="space-y-1">
                    <Link
                      href={`/PodcastDetail/${episode.podcast._id}`}
                      className="text-xl text-purple-500 hover:underline"
                    >
                      {episode.podcast.podcastName}
                    </Link>
                    <p className="text-md text-gray-400">
                      Created by {episode.podcast.creator.firstName} {episode.podcast.creator.lastName}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mt-4 text">
                  <StarRating
                    value={userRating}
                    maxStars={5}
                    onRate={handleRating}
                    isEditable={!!user}
                    episodeId={episode._id}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-700" />

          {/* Action Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-gray-300">
              <MdOutlineAccessTime size={24} />
              <span className="text-lg">Duration</span>
            </div>
            <ActionButtons
              episode={episode}
              podcast={episode.podcast}
              isLiked={liked}
              onLikeClick={handleLikeClick}
              size="lg"
              showMenu={false}
              setShowMenu={() => {}}
            />
          </div>

          {/* Description */}
          <div className="mt-10 bg-[#121212] p-6 rounded-xl shadow-inner">
            <p className="text-2xl font-semibold mb-4">Episode Description</p>
            <p className="text-md text-gray-300 leading-relaxed whitespace-pre-line">{episode.episodeDescription}</p>
          </div>

          {/* Bottom Button */}
          <div className="mt-12 flex justify-end">
            <button
              className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
              onClick={handleOnClick}
            >
              See Episodes
            </button>
          </div>
        </>
      ) : (
        <p className="text-xl text-gray-400">Episode not found.</p>
      )}
    </div>
  </div>
);

};

export default EpisodeDetail;
