"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MdFavorite,
  MdMoreVert,
  MdOutlineAccessTime,
  MdPlayArrow,
} from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { IoPlayOutline } from "react-icons/io5";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const PodcastDetails = ({ params }: { params: { id: string } }) => {
  const [podcast, setPodcast] = useState<{
    creator: any;
    _id: string;
    podcastName: string;
    podcastDescription: string;
    podcastImage: string;
    episodes: any[];
    categories: any[];
  } | null>(null);

  useEffect(() => {
    console.log("Fetching podcast details...");

    fetch(`http://localhost:3000/podcast/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data) {
          setPodcast(data);
        } else {
          console.error("No data received:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching podcast:", error);
      });
  }, [params.id]);

  if (!podcast) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{podcast.podcastName}</h1>
      <p className="text-gray-500">{podcast.podcastDescription}</p>

      <div className="mt-6">
        {podcast.episodes.map((episode) => (
          <EpisodeCard
            key={episode._id}
            episode={episode}
            podcastImage={podcast.podcastImage}
          />
        ))}
      </div>
    </div>
  );
};

const EpisodeCard = ({
  episode,
  podcastImage,
}: {
  episode: any;
  podcastImage: string;
}) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [liked, setLiked] = useState(false);

  const handleOnClick = () => {
    router.push(`/EpisodeDetail/${episode._id}`);
    const [liked, setLiked] = useState(false); // Track the like status
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click event
    setShowMenu(!showMenu);
  };

    // Handle like button click
    const handleLikeClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent click event from propagating to the parent div
      setLiked(!liked); // Toggle the like status
    };

  return (
    <div
      key={episode._id}
      className="grid grid-cols-8 gap-4  cursor-pointer hover:bg-gray-700 rounded-2xl"
      onClick={handleOnClick}
    >
      {/* Episode Image */}
      <div className="col-span-1">
        <img
          className="rounded-2xl"
          src={podcastImage}
          alt={episode.episodeTitle}
        />
      </div>

      {/* Episode Title & Description */}
      <div className="col-span-3 mt-1">
        <p className="text-xl">{episode.episodeTitle}</p>
        <p className="text-sm text-gray-400">{episode.episodeDescription}</p>
      </div>

      {/* Episode Date */}
      <div className="col-span-1">
        <p className="text-sm text-gray-400 mt-5">
          {/* <CiCalendar className="inline-block mr-1" /> */}
          {episode.createdAt.split("T")[0]}
        </p>
      </div>

      {/* Duration (if available) */}
      <div className="col-span-1">
        <p className="text-sm text-gray-400 mt-5">
          {/* <MdOutlineAccessTime className="inline-block mr-1" /> */}
          {/* {episode.duration || "N/A"} */}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="col-span-1 flex items-center space-x-10">
        <button className="text-white p-2 rounded-full hover:bg">
          <IoPlayOutline size={25} />
        </button>
        <button
          className={`text-gray-400 hover:text-red-500 ${
            liked ? "text-red-500" : ""
          }`}
          onClick={handleLikeClick}
        >
          {liked ? <IoMdHeart size={24} /> : <IoMdHeartEmpty size={24} />}
        </button>
        
        <button
          className="text-gray-400 hover:text-white relative"
          onClick={toggleMenu}
        >
          <MdMoreVert size={24} />
        </button>
      </div>

      {/* Expanded Options Menu */}
      {showMenu && (
        <div
          className="absolute bg-gray-800 text-white rounded-lg shadow-md p-2 right-12 mt-2 w-36"
          ref={menuRef}
        >
          <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">
            Add to Playlist
          </p>
          <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">
            Download
          </p>
          <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">
            Share
          </p>
        </div>
      )}

      {/* Separator after each episode */}
      <div className="col-span-8 mt-4">
        <hr style={{ color: "grey" }} />
      </div>
    </div>
  );
};

export default EpisodeCard;
