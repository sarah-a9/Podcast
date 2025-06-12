// File: components/EpisodeActionButtons/EpisodeActionButtons.tsx
"use client";

import React, { useState } from "react";
import PlayPauseButton from "../PlayPauseButton/PlayPauseButton";
import LikeButton from "../LikeButton/LikeButton";
import MenuButton from "../MenuButton/MenuButton";
import { Episode, Podcast, Playlist } from "@/app/Types";
import { useAuth } from "../Providers/AuthContext/AuthContext";
import { toast, Toaster } from "react-hot-toast";

interface Props {
  episode: Episode;
  podcast: Podcast;
  isLiked: boolean;
  onLikeClick?: (e: React.MouseEvent) => void;
  size?: "sm" | "md" | "lg";
  playlistId?: string | null;               // when viewing a single playlist
  onAddToPlaylist?: (episodeId: string, playlistId: string) => void;
  onRemoveFromPlaylist?: (episodeId: string, playlistId: string) => void;
  onEdit?: (ep: Episode) => void;
  onDelete?: (ep: Episode) => void;
  onArchive?: (ep: Episode) => void;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionButtons: React.FC<Props> = ({
  episode,
  podcast,
  isLiked,
  onLikeClick = () => {},
  size = "md",
  playlistId = null,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  onEdit,
  onDelete,
  onArchive,
  showMenu,
  setShowMenu,
}) => {
  const { user, token } = useAuth();
  const isCreator = user?._id === podcast.creator._id;
  const isAdmin = user?.role === 0;
  const isRegularUser = user?.role === 1 && !isCreator;

  const buttonSize = size === "lg" ? "text-4xl p-4" : "text-xl p-2";
  const iconSize = size === "lg" ? 40 : 24;

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="flex items-center space-x-4">
        {/* Play/Pause always */}
        <PlayPauseButton
          episode={episode}
          podcast={podcast}
          buttonSize={buttonSize}
          iconSize={iconSize}
        />

        {/* Creator & regular can Like */}
        { (isCreator || isRegularUser) && (
          <LikeButton
            episodeId={episode._id}
            isLiked={isLiked}
            onLikeClick={onLikeClick}
            buttonSize={buttonSize}
            iconSize={iconSize}
          />
        )}

        {/* Regular: report */}
        {/* Report/Un-report */}
        {isRegularUser && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!token) return toast.error("Log in to report.");
              const newStatus =
                episode.status === "reported" ? "published" : "reported";
              fetch(`http://localhost:3000/episode/${episode._id}`, {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
              })
                .then((res) => {
                  if (!res.ok) throw new Error();
                  window.location.reload();
                  toast.success(
                    episode.status === "reported"
                      ? "Episode unreported"
                      : "Episode reported"
                  );
                })
                .catch(() => toast.error("Could not update report status."));
            }}
            className={`text-xl px-2 py-1 rounded transition ${
              episode.status === "reported" ? "text-red-600" : "text-white"
            }`}
            title={
              episode.status === "reported"
                ? "Un-report episode"
                : "Report episode"
            }
          >
            {episode.status === "reported" ? "🚩" : "🏳"}
          </button>
        )}

        {/* ⋮ menu */}
        <div className="relative">
          <MenuButton
            onClick={toggleMenu}
            buttonSize={buttonSize}
            iconSize={iconSize}
          />

          {showMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-full right-0 bg-gray-800 text-white rounded-lg shadow-md p-2 mt-2 w-56 z-50"
            >
              <ul className="space-y-1">
                {/* Creator: Edit if draft/scheduled */}
                {isCreator && ["draft", "scheduled"].includes(episode.status) && (
                  <li
                    onClick={() => { onEdit?.(episode); setShowMenu(false); }}
                    className="cursor-pointer p-2 hover:bg-gray-700 rounded text-center"
                  >
                    Edit Episode
                  </li>
                )}

                {/* Creator/Admin: Delete */}
                {(isCreator || isAdmin) && (
                  <li
                    onClick={() => { onDelete?.(episode); setShowMenu(false); }}
                    className="cursor-pointer p-2 hover:bg-gray-700 rounded text-center text-red-400"
                  >
                    Delete Episode
                  </li>
                )}

          

                {/* Playlist actions */}
                {(isCreator || isRegularUser) && (
                  <PlaylistSubmenu
                    episode={episode}
                    userPlaylists={user?.playlists as unknown as Playlist[] || []}
                    playlistId={playlistId}
                    onAdd={onAddToPlaylist}
                    onRemove={onRemoveFromPlaylist}
                  />
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Submenu for Add/Remove across all user playlists
const PlaylistSubmenu: React.FC<{
  episode: Episode;
  userPlaylists: Playlist[];
  playlistId?: string | null;
  onAdd?: (epId: string, plId: string) => void;
  onRemove?: (epId: string, plId: string) => void;
}> = ({ episode, userPlaylists, playlistId, onAdd, onRemove }) => {
  const { token } = useAuth();
  const [show, setShow] = useState(false);

  const handleAdd = async (pl: Playlist, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return toast.error("Log in to add.");
    try {
      const res = await fetch(
        `http://localhost:3000/playlist/${pl._id}/episode/${episode._id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error();
      onAdd?.(episode._id, pl._id);
      toast.success(`"${episode.episodeTitle}" ➕ ${pl.playlistName}`);
      setShow(false);
    } catch {
      toast.error("Add failed");
    }
  };

  const handleRemove = async (plId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return toast.error("Log in to remove.");
    try {
      const res = await fetch(
        `http://localhost:3000/playlist/${plId}/episode/${episode._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error();
      onRemove?.(episode._id, plId);
      toast.success(`Removed from playlist`);
      setShow(false);
    } catch {
      toast.error("Remove failed");
    }
  };

  return (
    <>
      <li
        onClick={(e) => { e.stopPropagation(); setShow(!show); }}
        className="cursor-pointer p-2 hover:bg-gray-700 rounded text-center"
      >
        ➕/➖ Playlists
      </li>

      {show && (
        <div className="bg-gray-700 rounded p-1 mt-1 space-y-1 max-h-40 overflow-y-auto">
          {userPlaylists.map((pl) => {
            const inThisPlaylist = !!pl.episodes?.some(ep => ep._id === episode._id);
            return (
              <div
                key={pl._id}
                onClick={(e) => {
                  inThisPlaylist
                    ? handleRemove(pl._id, e)
                    : handleAdd(pl, e);
                }}
                className="flex justify-between items-center px-2 py-1 hover:bg-gray-600 rounded cursor-pointer"
              >
                <span>{pl.playlistName}</span>
                <span>{inThisPlaylist ? "⊖" : "⊕"}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ActionButtons;
