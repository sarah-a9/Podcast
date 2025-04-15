"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineAccessTime } from "react-icons/md";
import { FaRegStar, FaStar } from "react-icons/fa";
import { PlusCircle } from "lucide-react";
import { use } from "react";

import EpisodeCard from "@/app/components/EpisodeCard/EpisodeCard";
import { Episode } from "@/app/Types";
import CreateEpisodePopup from "../../components/PopUps/CreateEpisodePopUp";

const PodcastDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const podcastId = resolvedParams.id;  const [podcast, setPodcast] = useState<{
    creator: any;
    _id: string;
    podcastName: string;
    podcastDescription: string;
    podcastImage: string;
    episodes: Episode[];
    categories: any[];
  } | null>(null);

  const [open, setOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:3000/podcast/${podcastId }`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setPodcast(data);
        } else {
          console.error("No data received:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching podcast:", error);
      });
  }, [podcastId]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="h-screen text-white rounded-lg scrollable-container scrollbar-hide">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full flex flex-col">
        {podcast ? (
          <>
            <div className="grid grid-cols-6 gap-4">
              {/* Podcast Image */}
              <div className="col-span-1">
                <img
                  className="rounded-lg"
                  src={podcast.podcastImage}
                  alt={podcast.podcastName}
                />
              </div>

              {/* Podcast Info (Name, Creator, Description, Categories) */}
              <div className="col-span-4 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-2">{podcast.podcastName}</h2>
                <p className="text-sm text-gray-400 mb-2">
                  Created by {podcast.creator.firstName} {podcast.creator.lastName}
                </p>

                {/* Description */}
                <p className="text-md text-white mb-2">{podcast.podcastDescription}</p>

                {/* Categories */}
                <div className="flex gap-2 flex-wrap mt-1">
                  {podcast.categories.length > 0 ? (
                    podcast.categories.map((category) => (
                      <div
                        key={category._id}
                        className="flex-shrink-0 h-8 rounded-full shadow-md flex items-center justify-center border border-white text-white font-medium text-xs bg-transparent px-3"
                      >
                        {category.categoryName}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No categories available</p>
                  )}
                </div>
              </div>

              {/* Favorite Icon */}
              <div className="col-span-1 flex items-start justify-end">
                <button onClick={handleFavoriteClick}>
                  {isFavorite ? <FaStar size={40} /> : <FaRegStar size={40} />}
                </button>
              </div>
            </div>


            <div className="mt-4 mb-4">
              <hr style={{ color: "grey" }} />
            </div>

            

            {/* Episodes Header with Add Button */}
            <div className="mt-10 flex justify-between items-center">
              <p className="font-bold text-xl">All Episodes</p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setOpen(true)}
                  className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-sm font-semibold px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
                >
                  <PlusCircle className="inline-block mr-2" size={18} />
                  Add Episode
                </button>
                <CiCalendar size={24} />
                <MdOutlineAccessTime size={24} />
              </div>
            </div>

            <div className="mt-4">
              <hr style={{ color: "grey" }} />
            </div>

            <div className="pr-2">
              {podcast.episodes.length > 0 ? (
                podcast.episodes.map((episode) => (
                  <EpisodeCard
                    key={episode._id}
                    episode={episode}
                    podcast={podcast}
                  />
                ))
              ) : (
                <p className="text-gray-500">No episodes available</p>
              )}
            </div>

            {/* Episode Popup */}
            <CreateEpisodePopup
              isOpen={open}
              onClose={() => setOpen(false)}
              podcastId={podcast._id}
              creatorId={podcast.creator._id}
              podcastImage={podcast.podcastImage}
            />
          </>
        ) : (
          <p className="text-xl text-gray-400">Podcast not found.</p>
        )}
      </div>
    </div>
  );
};

export default PodcastDetails;
