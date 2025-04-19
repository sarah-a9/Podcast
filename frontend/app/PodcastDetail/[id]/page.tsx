"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineAccessTime } from "react-icons/md";

import EpisodeCard from "@/app/components/EpisodeCard/EpisodeCard";
import FavoriteButton from "@/app/components/FavoriteButton/FavoriteButton";
import { useAuth } from "@/app/components/Providers/AuthContext/AuthContext";
import { Episode } from "@/app/Types";

const PodcastDetails = ({ params }: { params: { id: string } }) => {
  const [podcast, setPodcast] = useState<{
    creator: any;
    _id: string;
    podcastName: string;
    podcastDescription: string;
    podcastImage: string;
    episodes: Episode[];
    favoritedByUsers:string[];
    categories: any[];
  } | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const { user, setUser } = useAuth(); // Removed loading as it does not exist in AuthContextType

  const podcastId = params.id;

  // Removed loading state check as it is not part of AuthContextType

  useEffect(() => {
    fetch(`http://localhost:3000/podcast/${podcastId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setPodcast(data);
          if (user) {
            const favoritePodcasts = Array.isArray(user.favoritePodcasts)
              ? user.favoritePodcasts
              : [];
            setIsFavorite(favoritePodcasts.includes(data._id)); // Check if this podcast is in user's favorites
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching podcast details:", error);
      });
  }, [podcastId, user]); // Re-fetch when user or podcastId changes

  const router = useRouter();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user && podcast) {
      const updatedFavoritePodcasts = isFavorite
        ? user.favoritePodcasts.filter((id) => id !== podcast._id)
        : [...user.favoritePodcasts, podcast._id];

      setUser({
        ...user,
        favoritePodcasts: updatedFavoritePodcasts,
      });
      console.log("podcastId", podcast);
    }
    setIsFavorite((prev) => !prev);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="h-screen text-white rounded-lg scrollable-container scrollbar-hide">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full flex flex-col">
        {podcast ? (
          <>
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-1">
                <img
                  className="rounded-lg"
                  src={podcast.podcastImage}
                  alt={podcast.podcastName}
                />
              </div>
              <div className="col-span-4">
                <h2 className="text-3xl font-bold mb-2 mt-8">{podcast.podcastName}</h2>
                <p className="text-sm text-gray-400">
                  Created by {podcast.creator.firstName} {podcast.creator.lastName}
                </p>

                   <div className="flex gap-2 flex-wrap">
                {podcast && podcast.categories.length > 0 ? (
                  podcast.categories.map((category) => (
                    <div
                      key={category._id}
                      className="w-1/12 flex-shrink-0 h-10 rounded-full shadow-md flex items-center justify-center border-1 border-white  text-white font-bold text-xs bg-transparent  px-4 mt-2"
                      >
                      {category.categoryName}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No categories available</p>
                )}
              </div> 
              </div>
              <div className="col-span-1 content-center">
                <FavoriteButton
                  podcastId={podcast._id}
                  isFavorite={isFavorite}
                  onFavoriteClick={handleFavoriteClick}
                  buttonSize={""}
                  iconSize={50}
                />
              </div>
            </div>

            <div className="mt-4 mb-4">
              <hr style={{ color: "grey" }} />
            </div>

            <p className="text-lg italic">{podcast.podcastDescription}</p>
            <div className="flex gap-2 flex-wrap">
                {podcast && podcast.categories.length > 0 ? (
                  podcast.categories.map((category) => (
                    <div
                      key={category._id}
                      className="w-1/12 flex-shrink-0 h-10 rounded-full shadow-md flex items-center justify-center border-1 border-white  text-white font-bold text-xs bg-transparent  px-4 mt-2"
                    >
                      {category.categoryName}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No categories available</p>
                )}
              </div>

            <div className="mt-20 justify-between flex flex-row">
              <p className="font-bold text-xl">All Episodes</p>
              <p className="pr-10"><CiCalendar /></p>
              <p> {/* <MdOutlineAccessTime />*/}</p> 
            </div>

            <div className="mt-4">
              <hr style={{ color: "grey" }} />
            </div>

            <div className="pr-2">
              {podcast.episodes.length > 0 ? (
                podcast.episodes.map((episode) => (
                  <EpisodeCard key={episode._id} episode={episode} podcast={podcast} />
                  
                ))
                
              ) : (
                <p className="text-gray-500">No episodes available</p>
              )}
              
            </div>
          </>
        ) : (
          <p className="text-xl text-gray-400">Podcast not found.</p>
        )}
      </div>
    </div>
  );
};

export default PodcastDetails;
