"use client";
import ActionButtons from "@/app/components/EpisodeActionButtons/EpisodeActionButtons";
import { Podcast } from "@/app/Types";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { MdOutlineAccessTime } from "react-icons/md";

const EpisodeDetail = ({
  params,
}: {
  params: { id: string; episodeId: string };
}) => {
  const [episode, setEpisode] = useState<{
    _id: string;
    episodeTitle: string;
    episodeDescription: string;
    audioUrl: string;
    podcast: Podcast;
    createdAt: string;
    categories: any[];
  } | null>(null);

  const [liked, setLiked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(
      `http://localhost:3000/podcast/${params.id}/episode/${params.episodeId}`
    )
      .then((res) => res.json())
      .then((data) => {
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
    event.stopPropagation();
    setLiked(!liked);
  };

  const handleOnClick = () => {
    router.push(`/PodcastDetail/${episode?.podcast._id}`);
  };

  return (
    <div className="scrollable-container scrollbar-hide h-full text-white rounded-lg">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full flex flex-col">
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

                <div className="text-sm text-gray-300 mb-4">
                  <p className="mb-1">
                    Created by{" "}
                    <span className="text-white font-semibold">
                      {episode.podcast.creator.firstName}{" "}
                      {episode.podcast.creator.lastName}
                    </span>
                  </p>
                  <p className="text-gray-400 italic">
                    {episode.episodeDescription}
                  </p>
                </div>

                <p className="text-sm text-gray-400">
                  <Link
                    href={`/PodcastDetail/${episode.podcast._id}`}
                    className="hover:underline"
                  >
                    {episode.podcast.podcastName}
                  </Link>
                </p>
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
              />
            </div>

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
