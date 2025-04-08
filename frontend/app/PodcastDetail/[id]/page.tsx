"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineAccessTime } from "react-icons/md";

import EpisodeCard from "@/app/components/EpisodeCard/EpisodeCard";
import { FaRegStar, FaStar } from "react-icons/fa";
import { Episode } from "@/app/Types";


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
  
  console.log("liste episodes",podcast?.episodes);
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
    <div className=" h-screen   text-white rounded-lg scrollable-container scrollbar-hide">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full flex flex-col  ">
        {podcast ? (
          <>
            {/* Podcast Details */}
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-1">
                <img
                  className="rounded-lg"
                  src={podcast.podcastImage}
                  alt={podcast.podcastName}
                />
              </div>
              <div className="col-span-4">
                <h2 className="text-3xl font-bold mb-2 mt-8">
                  {podcast.podcastName}
                </h2>
                {/* <p className="text-lg mb-4">{podcast.podcastDescription}</p> */}
                <p className="text-sm text-gray-400">
                  Created by {podcast.creator.firstName}{" "}
                  {podcast.creator.lastName}
                </p>
                {/* <div className="flex gap-2 flex-wrap">
                {podcast && podcast.categories.length > 0 ? (
                  podcast.categories.map((category) => (
                    <div
                      key={category._id}
                      className="w-1/12 flex-shrink-0 h-10 rounded-full shadow-md flex items-center justify-center  text-white font-bold text-xs bg-cyan-950 px-4 mt-2"
                    >
                      {category.categoryName}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No categories available</p>
                )}
              </div> */}
            
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
             <p className="text-lg font- ">{podcast.podcastDescription}</p>
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

            {/* Episodes Header */}
            <div className="mt-20 justify-between flex flex-row">
              <p className="font-bold text-xl">All Episodes</p>
              <p>
                <CiCalendar />
              </p>
              <p>
                <MdOutlineAccessTime />
              </p>
            </div>

            {/* Separator  mb-4*/}
            <div className="mt-4 ">
              <hr style={{ color: "grey" }} />
            </div>

            <div className="    pr-2  ">
              {/* Episodes List */}
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
          </>
        ) : (
          <p className="text-xl text-gray-400">Podcast not found.</p>
        )}
      </div>
    </div>
  );
};

export default PodcastDetails;
