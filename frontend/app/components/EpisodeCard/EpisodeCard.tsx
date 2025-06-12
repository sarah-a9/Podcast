// File: components/EpisodeCard/EpisodeCard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ActionButtons from "../EpisodeActionButtons/EpisodeActionButtons";
import { useAuth } from "../Providers/AuthContext/AuthContext";
import { Episode, Podcast } from "@/app/Types";
import DeleteEpisodePopUp from "../PopUps/DeleteEpisodePopUp";

export default function EpisodeCard({
  episode,
  podcast,
  className = "",
  imageClassName = "",
  playlistId = null,
  onEditEpisode,
  onDeleteEpisode,
  onStatusChange, // ✅ NEW PROP
}: {
  episode: Episode;
  podcast: Podcast;
  className?: string;
  imageClassName?: string;
  playlistId?: string | null;
  onEditEpisode?: (ep: Episode) => void;
  onDeleteEpisode?: (ep: Episode) => void;
  onStatusChange?: () => void; // ✅ NEW PROP TYPE
}) {
  const router = useRouter();
  const { user, setUser, token } = useAuth();
  const [liked, setLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [playlist, setPlaylist] = useState<Episode[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isCreator = user?._id === podcast.creator._id;
  const isRegular = user?.role === 1 && !isCreator;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const updated = liked
      ? user.likedEpisodes.filter((id) => id !== episode._id)
      : [...user.likedEpisodes, episode._id];
    setUser({ ...user, likedEpisodes: updated });
    setLiked(!liked);
  };

  useEffect(() => {
    setLiked(user?.likedEpisodes.includes(episode._id) ?? false);
    if (playlistId) {
      fetchPlaylistData();
    }
  }, [user, episode._id, playlistId]);

  const fetchPlaylistData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/playlist/${playlistId}`);
      const data = await res.json();
      setPlaylist(data.episodes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToPlaylist = (episodeId: string, playlistId: string) => {
    setPlaylist((pl) => [...pl, { ...episode, _id: episodeId }]);
  };

  const handleRemoveFromPlaylist = (episodeId: string) => {
    setPlaylist((pl) => pl.filter((ep) => ep._id !== episodeId));
  };

  const handleClick = () =>
    router.push(
      `/PodcastDetail/${podcast._id}/EpisodeDetail/${episode._id}`,
      { scroll: false }
    );

  // ✅ ARCHIVE HANDLER
  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(
        `http://localhost:3000/episode/archive/${episode._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to archive episode");

      if (onStatusChange) onStatusChange(); // ✅ Notify parent
    } catch (error) {
      console.error("Error archiving episode:", error);
    }
  };

  return (
    <div
      className={`grid grid-cols-8 gap-4 cursor-pointer rounded-2xl hover:bg-black/50 transition duration-200 ${className}`}
      onClick={handleClick}
    >
      <div className="col-span-1">
        <img
          className={`rounded-lg h-32 w-35 object-cover ${imageClassName}`}
          src={`http://localhost:3000/uploads/podcasts/${podcast.podcastImage}`}
          alt={episode.episodeTitle}
        />
      </div>

      <div className="col-span-3 mt-1 space-y-2">
        <p className="text-xl">{episode.episodeTitle}</p>
        <p className="text-sm text-gray-400">{episode.episodeDescription}</p>

        {(isCreator || (user?.role === 0 && ["archived", "reported"].includes(episode.status))) &&
          episode.status !== "published" && (
            <div
              className={`
                inline-block text-xs font-semibold text-white 
                bg-gradient-to-r px-3 py-1 rounded-xl shadow-md 
                hover:scale-105 transform transition-transform
                ${
                  episode.status === "draft" || episode.status === "scheduled"
                    ? "from-purple-600 via-pink-600 to-rose-500"
                    : episode.status === "reported"
                    ? "from-red-600 via-red-700 to-red-800"
                    : episode.status === "archived"
                    ? "from-orange-500 via-orange-600 to-yellow-400"
                    : ""
                }
              `}
            >
              {episode.status === "archived"
                ? isCreator
                  ? "Blocked"
                  : "Archived"
                : episode.status
                ? episode.status.charAt(0).toUpperCase() + episode.status.slice(1)
                : "Unknown"}
            </div>
          )}
      </div>

      <div className="col-span-1">
        <p className="text-sm text-gray-400 mt-16">
          {(episode.createdAt ?? "").split("T")[0] || "Date inconnue"}
        </p>
      </div>

      <div className="col-span-1" />

      <div className="col-span-1 flex items-center space-x-4">
        <ActionButtons
          episode={episode}
          podcast={podcast}
          isLiked={liked}
          onLikeClick={handleLikeClick}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          playlistId={playlistId}
          onAddToPlaylist={handleAddToPlaylist}
          onRemoveFromPlaylist={handleRemoveFromPlaylist}
          onEdit={onEditEpisode}
          onDelete={() => setShowDeleteConfirm(true)}
        />

        {/* ✅ ARCHIVE BUTTON (TEMP EXAMPLE) */}
        {user?.role === 0 && episode.status === "reported" && (
          <button
            className="px-2 py-1 text-xs text-white bg-orange-500 rounded hover:bg-orange-600"
            onClick={handleArchive}
          >
            Archive
          </button>
        )}

        {showDeleteConfirm && (
          <DeleteEpisodePopUp
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            episodeId={episode._id}
            onDeleted={() => {
              setShowDeleteConfirm(false);
              router.push(`/PodcastDetail/${podcast._id}`);
            }}
          />
        )}
      </div>

      <div className="col-span-8">
        <hr style={{ color: "grey" }} />
      </div>
    </div>
  );
}
