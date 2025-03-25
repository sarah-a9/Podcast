"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CiStar, CiCalendar } from "react-icons/ci";
import { MdOutlineAccessTime } from "react-icons/md";

import { ArrowLeft } from "lucide-react";
import CategoryButton from "@/app/components/CategoryButton/CategoryButton";
import EpisodeCard from "@/app/components/EpisodeCard/EpisodeCard";
import { FaRegStar, FaStar } from "react-icons/fa";

interface Episode {
  _id: string;
  episodeTitle: string;
  episodeDescription: string;
  audioUrl: string;
  createdAt: string;
}
const PodcastDetails = ({ params }: { params: { id: string } }) => {
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
    console.log("Fetching podcast details...");
    // Dynamically inject the `id` into the URL
    fetch(`http://localhost:3000/podcast/${params.id}`) // Use template literals to pass the `id`
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
  }, [params.id]); // Add `params.id` as a dependency to refetch when the `id` changes

  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false); 


  // Handle favorite button click
const handleFavoriteClick = (e: React.MouseEvent) => {
  e.stopPropagation(); // Prevent click event from propagating to the parent div
  setIsFavorite(!isFavorite); // Toggle the favorite status
  // Optionally, make an API call to save the favorite status
};

  // Navigate to the previous page
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="h-full text-white rounded-2xl">
      <div className="bg-gray-800 p-8 rounded-2xl h-screen shadow-lg w-full mb-4 flex flex-col">
        {podcast ? (
          <>
            {/* Podcast Details */}
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-1">
                <img
                  className="rounded-2xl"
                  src={podcast.podcastImage}
                  alt={podcast.podcastName}
                />
              </div>
              <div className="col-span-4">
                <h2 className="text-3xl font-bold mb-4">
                  {podcast.podcastName}
                </h2>
                <p className="text-lg mb-4">{podcast.podcastDescription}</p>
                <p className="text-sm text-gray-400">
                  Created by {podcast.creator.firstName}{" "}
                  {podcast.creator.lastName}
                </p>
              </div>
              <div className="col-span-1 content-center">
                <button onClick={handleFavoriteClick}>
                  {isFavorite ? <FaStar size={40} /> : <FaRegStar size={40} />}
                </button>
              </div>
            </div>

            {/* Separator */}
            <div className="mt-4 mb-4">
              <hr style={{ color: "grey" }} />
            </div>

            {/* Episodes Header */}
            <div className="mt-4 justify-between flex flex-row">
              <p>Episodes</p>
              <p>
                <CiCalendar />
              </p>
              <p>
                <MdOutlineAccessTime />
              </p>
            </div>

            {/* Separator */}
            <div className="mt-4 mb-4">
              <hr style={{ color: "grey" }} />
            </div>

            <div className="mt-4 mb-4 h-80 overflow-y-auto pr-2  scrollbar-hide">
              {/* Episodes List */}
              {podcast.episodes.length > 0 ? (
                podcast.episodes.map((episode) => (
                  <EpisodeCard
                    key={episode._id}
                    episode={episode}
                    podcastImage={podcast.podcastImage}
                  />
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
