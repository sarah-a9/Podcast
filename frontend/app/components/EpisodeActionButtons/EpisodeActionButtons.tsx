import { useState } from "react";
import PlayPauseButton from "../PlayPauseButton/PlayPauseButton";
import LikeButton from "../LikeButton/LikeButton";
import MenuButton from "../MenuButton/MenuButton";
import { Episode, Podcast } from "@/app/Types";

const ActionButtons = ({
  episode,
  podcast,
  isLiked,
  onLikeClick,
  size = "md",
}: {
  episode: Episode;
  podcast: Podcast;
  isLiked: boolean;
  onLikeClick: (e: React.MouseEvent) => void;
  size?: "md" | "lg";
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const buttonSize = size === "lg" ? "text-4xl p-4" : "text-xl p-2";
  const iconSize = size === "lg" ? 40 : 24;

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  return (
    <div className="flex items-center space-x-10 relative">
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

      {/* Menu Button */}
      <MenuButton onClick={handleMenuClick} buttonSize={buttonSize} iconSize={iconSize} />

      {/* Menu Options */}
      {showMenu && (
        <div className="absolute top-full left-0 z-10 bg-gray-800 text-white rounded-lg shadow-md p-2 mt-2 w-36">
          <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">Add to Playlist</p>
          <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">Download</p>
          <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">Share</p>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
