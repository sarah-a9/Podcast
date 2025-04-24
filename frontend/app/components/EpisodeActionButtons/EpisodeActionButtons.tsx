import { useEffect, useState } from "react";
import PlayPauseButton from "../PlayPauseButton/PlayPauseButton";
import LikeButton from "../LikeButton/LikeButton";
import MenuButton from "../MenuButton/MenuButton";
import { Episode, Podcast } from "@/app/Types";
import React from "react";
import { useAuth } from "../Providers/AuthContext/AuthContext";

const ActionButtons = ({
  episode,
  podcast,
  isLiked,
  onLikeClick,
  size = "md",
  showMenu,
  setShowMenu,
  playlistId = null,   // added this prop
  onRemoveFromPlaylist // callback function to remove from playlist
}: {
  episode: Episode;
  podcast: Podcast;
  isLiked: boolean;
  onLikeClick: (e: React.MouseEvent) => void;
  size?: "md" | "lg";
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  playlistId?: string | null;   // optional string prop
  onRemoveFromPlaylist?: (episodeId: string, playlistId: string) => void; // added callback for remove action
}) => {
  const buttonSize = size === "lg" ? "text-4xl p-4" : "text-xl p-2";
  const iconSize = size === "lg" ? 40 : 24;
  const { user, token } = useAuth();

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleRemoveFromPlaylist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (playlistId) {
      try {
        // Using fetch API to remove episode from playlist
        const response = await fetch(`http://localhost:3000/playlist/${playlistId}/episode/${episode._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to remove episode: ${response.statusText}`);
        }

        console.log(`Episode ${episode._id} removed from playlist ${playlistId}`);

        // If the remove action is successful, update UI or call the parent remove handler
        if (onRemoveFromPlaylist) {
          onRemoveFromPlaylist(episode._id, playlistId);
        }

        setShowMenu(false);
      } catch (error) {
        console.error("Failed to remove episode from playlist:", error);
      }
    }
  };

  return (
    <div className="flex items-center space-x-10">
      {/* Play/Pause Button */}
      <PlayPauseButton
        episode={episode}
        podcast={podcast}
        buttonSize={buttonSize}
        iconSize={iconSize}
      />

      {/* Like Button */}
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
            <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md text-center">
              Add to Playlist
            </p>
            <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md text-center">
              Download
            </p>
            <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md text-center">
              Share
            </p>

            {/* Only show this if playlistId exists */}
            {playlistId && (
              <p
                onClick={handleRemoveFromPlaylist}
                className="cursor-pointer p-2 hover:bg-red-600 rounded-md text-center text-red-400"
              >
                Remove from Playlist
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
