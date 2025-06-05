// src/app/components/EpisodeActionButtons/EpisodeActionButtons.tsx
import { useEffect, useState } from "react";
import PlayPauseButton from "../PlayPauseButton/PlayPauseButton";
import LikeButton from "../LikeButton/LikeButton";
import MenuButton from "../MenuButton/MenuButton";
import { Episode, Podcast } from "@/app/Types";
import React from "react";
import { useAuth } from "../Providers/AuthContext/AuthContext";

interface Props {
  episode: Episode;
  podcast: Podcast;
  isLiked: boolean;
  onLikeClick: (e: React.MouseEvent) => void;
  size?: "md" | "lg";
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  playlistId?: string | null;
  onRemoveFromPlaylist?: (episodeId: string) => void;
  onEdit?: (ep: Episode) => void;
  onDelete?: (ep: Episode) => void;
}

const ActionButtons: React.FC<Props> = ({
  episode,
  podcast,
  isLiked,
  onLikeClick,
  size = "md",
  showMenu,
  setShowMenu,
  playlistId = null,
  onRemoveFromPlaylist,
  onEdit,
  onDelete,
}) => {
  const buttonSize = size === "lg" ? "text-4xl p-4" : "text-xl p-2";
  const iconSize = size === "lg" ? 40 : 24;
  const { user, token } = useAuth();

  const isCreator = user?._id === podcast.creator._id;
  const isAdmin = user?.role === 0;
  const isRegularUser = user?.role === 1;

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleRemoveFromPlaylist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlistId && onRemoveFromPlaylist) {
      onRemoveFromPlaylist(episode._id);
      setShowMenu(false);
      try {
        const resp = await fetch(
          `http://localhost:3000/playlist/${playlistId}/episode/${episode._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!resp.ok) throw new Error("Failed to remove episode from playlist");
      } catch (err) {
        console.error("Error removing episode from playlist:", err);
      }
    }
  };

  return (
    <div className="flex items-center space-x-10">
      {/* Play/Pause */}
      <PlayPauseButton
        episode={episode}
        podcast={podcast}
        buttonSize={buttonSize}
        iconSize={iconSize}
      />

      {/* Like */}
      <LikeButton
        episodeId={episode._id}
        isLiked={isLiked}
        onLikeClick={onLikeClick}
        buttonSize={buttonSize}
        iconSize={iconSize}
      />

      {/* Menu Button + Dropdown */}
      <div className="relative">
        <MenuButton
          onClick={handleMenuClick}
          buttonSize={buttonSize}
          iconSize={iconSize}
        />

        {showMenu && (
          <div className="absolute top-full right-0 bg-gray-800 text-white rounded-lg shadow-md p-2 mt-2 w-44 z-50">
            <ul>
              {/* Only regular users (role 1) see “Add to Playlist” */}
              {isRegularUser && (
                <li className="cursor-pointer p-2 hover:bg-gray-700 rounded-md text-center">
                  Add to Playlist
                </li>
              )}

              {/* Only creator can “Edit Episode” when status is draft or scheduled */}
              {isCreator &&
                (episode.status === "draft" || episode.status === "scheduled") && (
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEdit?.(episode);
                    }}
                    className="cursor-pointer p-2 hover:bg-gray-700 rounded-md text-center"
                  >
                    Edit Episode
                  </li>
                )}

              {/* Delete Episode: visible if creator OR admin (role 0) */}
              {(isCreator || isAdmin) && (
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete?.(episode);
                  }}
                  className="cursor-pointer p-2 hover:bg-gray-700 rounded-md text-center text-red-400"
                >
                  Delete Episode
                </li>
              )}

              {/* Only show “Remove from Playlist” if playlistId is provided */}
              {playlistId && (
                <li
                  onClick={handleRemoveFromPlaylist}
                  className="cursor-pointer p-2 hover:bg-red-600 rounded-md text-center text-red-400"
                >
                  Remove from Playlist
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
