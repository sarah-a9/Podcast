import React from "react";
import { Episode, Podcast } from "@/app/Types";

const EpisodeSearchCard = ({
  episode,
  podcast,
  isInPlaylist,
  onAddClick,
}: {
  episode: Episode;
  podcast: Podcast;
  isInPlaylist: boolean;
  onAddClick: () => void;
}) => {
  return (
    <div className="grid grid-cols-12 items-center p-2 hover:bg-black/40 transition duration-150 rounded-xl text-sm">
      {/* Image */}
      <div className="col-span-2">
        <img
          src={podcast.podcastImage}
          alt={episode.episodeTitle}
          className="w-12 h-12 object-cover rounded-md"
        />
      </div>

      {/* Episode Title */}
      <div className="col-span-7 pl-2">
        <p className="font-medium">{episode.episodeTitle}</p>
        <p className="text-xs text-gray-400">{podcast.podcastName}</p>
      </div>

      {/* Button */}
      <div className="col-span-3 flex justify-end pr-2">
        {isInPlaylist ? (
          <button
            disabled
            className="text-xs text-gray-400 border border-gray-400 rounded-md px-3 py-1 cursor-not-allowed"
          >
            Already in Playlist
          </button>
        ) : (
          <button
            onClick={onAddClick}
            className="bg-white text-black text-xs rounded-md px-3 py-1 hover:bg-gray-200 transition"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default EpisodeSearchCard;
