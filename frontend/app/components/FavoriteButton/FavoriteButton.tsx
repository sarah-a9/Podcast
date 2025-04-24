import { FaStar, FaRegStar } from "react-icons/fa";
import { useAuth } from "../Providers/AuthContext/AuthContext";
import { FavoriteButtonProps } from "@/app/Types";
import React from "react";
import toast from "react-hot-toast";

const FavoriteButton = ({
  podcastId,
  isFavorite,
  onFavoriteClick,
  buttonSize,
  iconSize,
}: FavoriteButtonProps) => {
  const { user, setUser, token } = useAuth();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click event from propagating to the parent div

    if (user && token) {
      const userId = user._id;

      try {
        const response = await fetch(`http://localhost:3000/user/${userId}/favorite/${podcastId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isFavorite }), 
        });

        if (!response.ok) {
          throw new Error('Failed to favorite/unfavorite the podcast');
        }

        const data = await response.json();

        // Update favorite podcasts
        setUser({
          ...user,
          favoritePodcasts: !isFavorite
            ? [...user.favoritePodcasts, podcastId] 
            : user.favoritePodcasts.filter((id) => id !== podcastId),
        });

        // Show toast notification
        toast.success(!isFavorite ? "Added to favorite Podcasts" : "Removed from favorite Podcasts");

      } catch (error) {
        console.error('Error favoriting/unfavoriting the podcast:', error);
        toast.error("Something went wrong.");
      }
    }

    // Call the parent onFavoriteClick callback if needed
    if (onFavoriteClick) onFavoriteClick(e);
  };

  return (
    <div className="">
      <button
        className={`${buttonSize}`}
        onClick={handleFavoriteClick}
      >
        {isFavorite ? <FaStar size={iconSize} /> : <FaRegStar size={iconSize} />}
      </button>
    </div>
  );
};

export default FavoriteButton;
