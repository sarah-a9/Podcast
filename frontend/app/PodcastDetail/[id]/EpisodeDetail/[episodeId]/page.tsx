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
    <div className="scrollable-container scrollbar-hide h-screen text-white rounded-lg">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full flex flex-col">
        {episode ? (
          <>
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-1">
                <img
                  className="rounded-2xl"
                  src={`http://localhost:3000/uploads/podcasts/${episode.podcast.podcastImage}`}
                  alt={episode.podcast.podcastName}
                />
              </div>
              <div className="col-span-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <h2 className="text-3xl font-bold">{episode.episodeTitle}</h2>
                    <p className="text-lg mb-4">
                      Created by {episode.podcast.creator.firstName} {episode.podcast.creator.lastName}
                    </p>
                    <div className="text-sm text-gray-300 mb-4">
                      <p className="text-gray-400 italic">{episode.episodeDescription}</p>
                    </div>
                    <p className="text-sm text-gray-400">
                      <Link href={`/PodcastDetail/${episode.podcast._id}`} className="hover:underline">
                        {episode.podcast.podcastName}
                      </Link>
                    </p>
                  </div>
                  <div className="col-span-1 flex justify-end items-start mt-16 mr-16">
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

            <div className="mt-4 mb-4">
              <hr style={{ color: "grey" }} />
            </div>

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
                size="lg"
                showMenu={false}
                setShowMenu={() => {}}
              />
            </div>

            <div className="mt-4">
              <p className="text-2xl">Episode Description</p>
              <p className="text-l text-gray-400 mt-4">{episode.episodeDescription}</p>
            </div>

            <div className="mt-9 flex justify-end">
              <button
                className="bg-amber-50 text-black px-4 py-2 rounded-full hover:bg-gray-600 transition cursor-pointer"
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
