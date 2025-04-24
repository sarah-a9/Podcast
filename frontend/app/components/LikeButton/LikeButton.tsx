import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useAuth } from "../Providers/AuthContext/AuthContext";
import { LikeButtonProps } from "@/app/Types";
import { useState } from "react";
import toast from "react-hot-toast";

const LikeButton = ({ episodeId, isLiked, onLikeClick, buttonSize, iconSize }: LikeButtonProps) => {
  const { user, setUser, token } = useAuth();

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (user && token) {
      const userId = user._id;

      try {
        const response = await fetch(`http://localhost:3000/user/${userId}/like/${episodeId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isLiked }),
        });

        if (!response.ok) {
          throw new Error('Failed to like/unlike the episode');
        }

        const data = await response.json();

        // Update liked episodes
        setUser({
          ...user,
          likedEpisodes: isLiked
            ? user.likedEpisodes.filter((id) => id !== episodeId)
            : [...user.likedEpisodes, episodeId],
        });

        // Show toast message
        toast.success(isLiked ? "Removed from liked Episodes" : "Added to liked Episodes");

      } catch (error) {
        console.error('Error liking/unliking the episode:', error);
        toast.error("Something went wrong.");
      }
    }

    if (onLikeClick) onLikeClick(e);
  };

  return (
    <button
      className={`text-gray-400 hover:text-red-500 ${isLiked ? "text-red-500" : ""} ${buttonSize}`}
      onClick={handleLikeClick}
    >
      {isLiked ? <IoMdHeart size={iconSize} /> : <IoMdHeartEmpty size={iconSize} />}
    </button>
  );
};

export default LikeButton;
