"use client";
import ActionButtons from "@/app/components/EpisodeActionButtons/EpisodeActionButtons";
import EpisodeActionButtons from "@/app/components/EpisodeActionButtons/EpisodeActionButtons";
import { Episode, useAudio } from "@/app/components/Providers/AudioProvider";
import { Podcast } from "@/app/Types";
import Link from "next/link";
import { useRouter } from "next/navigation";


import React, { useEffect, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoPlayOutline } from "react-icons/io5";
import { MdMoreVert, MdOutlineAccessTime } from "react-icons/md";


const EpisodeDetail = ({
  params,
}: {
  params: { id: string; episodeId: string };
}) => {
  const [episode, setEpisode] = useState<{
    _id: string;

    episodeTitle: string;

    episodeDescription: string;

    audioUrl:string;
    podcast: Podcast;
    createdAt : string;

    categories: any[];
  } | null>(null); // Initialize as null instead of an empty array
  const [liked, setLiked] = useState(false);
  // const { playEpisode, currentEpisode, isPlaying } = useAudio();
  const router = useRouter();

  useEffect(() => {
    fetch(
      `http://localhost:3000/podcast/${params.id}/episode/${params.episodeId}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(
          `http://localhost:3000/podcast/${params.id}/episode/${params.episodeId}`
        ); // Log to inspect the structure
        // Assuming the API returns a single podcast, not an array
        if (data) {
          setEpisode(data);
        } else {
          console.error("No data received:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching podcast:", error);
      });
  }, [params.id, params.episodeId]);




  const handleLikeClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Empêcher la propagation au parent
    setLiked(!liked);
  };

  const handleOnClick = () => {
    router.push(`/PodcastDetail/${episode?.podcast._id}`);
  };

  // console.log(params);
  // console.log(episode?.podcast);
  // console.log(`/PodcastDetail/${episode?.podcast._id}`);
  // console.log(process.env.PWD)
console.log(episode?.audioUrl);

  return (
    <div className="scrollable-container  scrollbar-hide h-full text-white rounded-lg">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full flex flex-col ">
        {episode ? (
          <>
            {/* episode Details */}
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-1">
                <img
                  className="rounded-2xl"
                  src={episode.podcast.podcastImage}
                  alt={episode.podcast.podcastName}
                />
              </div>
              <div className="col-span-4">
                <h2 className="text-3xl font-bold mb-4">
                  {episode.episodeTitle}
                </h2>
                <p className="text-lg mb-4">
                  Created by {episode.podcast.creator.firstName}{" "}
                  {episode.podcast.creator.lastName}
                </p>
                <p className="text-sm text-gray-400">
                  <Link
                    href={`/PodcastDetail/${episode.podcast._id}`}
                    className="hover:underline "
                  >
                    {episode.podcast.podcastName}
                  </Link>
                </p>

                <div className="flex gap-2 flex-wrap"></div>
              </div>
            </div>

            {/* Separator */}
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
                // onPlayClick={handlePlayClick} // Pass the play function here
              />
            </div>

            <div className="mt-6">
              <p className="text-2xl">Episode Description</p>
              <p className="text-l text-gray-400 mt-4">
                {episode.episodeDescription}
              </p>
            </div>

            <div className="mt-20">
              <button className="bg-amber-50 text-black px-4 py-2 rounded-full hover:bg-gray-600 transition" onClick={handleOnClick}>
                See Episodes
              </button>
            </div>
          </>
        ) : (
          <p className="text-xl text-gray-400">episode not found. </p>
        )}
      </div>
    </div>
  );
};

export default EpisodeDetail;
