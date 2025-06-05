import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ActionButtons from "../EpisodeActionButtons/EpisodeActionButtons";
import { useAuth } from "../Providers/AuthContext/AuthContext"; 
import { Episode, Podcast } from "@/app/Types";

const EpisodeCard = ({
  episode,
  podcast,
  className = "",
  imageClassName = "",
  playlistId = null,
  onEditEpisode,
}: {
  episode: Episode;
  podcast: Podcast;
  className?: string;
  imageClassName?: string;
  playlistId?: string | null;
  onEditEpisode?: (ep: Episode) => void;
}) => {
  const router = useRouter();
  const { user, setUser, token } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [playlist, setPlaylist] = useState<Episode[]>([]);

  // Only the creator sees draft/scheduled badges
  const isCreator = user?._id === podcast.creator._id;

  useEffect(() => {
    if (user && user.likedEpisodes) {
      setLiked(user.likedEpisodes.includes(episode._id));
    }
  }, [user, episode._id]);

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistData();
    }
  }, [playlistId]);

  const fetchPlaylistData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/playlist/${playlistId}`);
      const data = await response.json();
      setPlaylist(data.episodes);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  const handleOnClick = () => {
    router.push(`/PodcastDetail/${podcast._id}/EpisodeDetail/${episode._id}`, {
      scroll: false,
    });
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user && user.likedEpisodes) {
      const updatedLikedEpisodes = liked
        ? user.likedEpisodes.filter((id) => id !== episode._id)
        : [...user.likedEpisodes, episode._id];

      setUser({
        ...user,
        likedEpisodes: updatedLikedEpisodes,
      });
    }
    setLiked(!liked);
  };

  const handleRemoveFromPlaylist = async (episodeId: string) => {
    const updatedPlaylist = playlist.filter((ep) => ep._id !== episodeId);
    setPlaylist(updatedPlaylist);

    try {
      const response = await fetch(
        `http://localhost:3000/playlist/${playlistId}/episode/${episodeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove episode from playlist");
      }
      console.log("Episode removed successfully from the playlist.");
    } catch (error) {
      console.error("Error removing episode from playlist:", error);
    }
  };

  return (
    <div
      key={episode._id}
      className="grid grid-cols-8 gap-4 cursor-pointer rounded-2xl hover:bg-black/50 transition duration-200"
      onClick={handleOnClick}
    >
      {/* Episode Image */}
      <div className="col-span-1">
        <img
          className={`rounded-lg h-32 w-35 object-cover ${imageClassName}`}
          src={`http://localhost:3000/uploads/podcasts/${podcast.podcastImage}`}
          alt={episode.episodeTitle}
        />
      </div>

      {/* Title, Description, and Badge */}
      <div className="col-span-3 mt-1 space-y-2">
        {/* Title */}
        <p className="text-xl">{episode.episodeTitle}</p>
        {/* Description */}
        <p className="text-sm text-gray-400">{episode.episodeDescription}</p>
        
        {/* ─── Prettier badge under description, only for creator & non-published ─── */}
        {isCreator && episode.status !== "published" && (
          <div
            className={`
              inline-block text-xs font-semibold text-white 
              bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 
              px-3 py-1 rounded-xl shadow-md 
              hover:scale-105 transform transition-transform
            `}
          >
            {episode.status === "draft" ? "Draft" : "Scheduled"}
          </div>
        )}
      </div>

      {/* Episode Date */}
      <div className="col-span-1">
        <p className="text-sm text-gray-400 mt-16">
          published on:
          {episode.createdAt
            ? episode.createdAt.split("T")[0]
            : "Unknown Date"}
        </p>
      </div>

      {/* Duration (empty for now) */}
      <div className="col-span-1">
        <p className="text-sm text-gray-400 mt-5"></p>
      </div>

      {/* Action Buttons */}
      <div className="col-span-1 flex items-center space-x-10">
        <ActionButtons
          episode={episode}
          podcast={podcast}
          isLiked={liked}
          onLikeClick={handleLikeClick}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          playlistId={playlistId}
          onRemoveFromPlaylist={handleRemoveFromPlaylist}
          onEdit={onEditEpisode}
        />
      </div>

      {/* Separator */}
      <div className="col-span-8">
        <hr style={{ color: "grey" }} />
      </div>
    </div>
  );
};

export default EpisodeCard;
