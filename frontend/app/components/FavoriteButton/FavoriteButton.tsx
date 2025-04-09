import { FaStar, FaRegStar } from "react-icons/fa";
import { useAuth } from "../Providers/AuthContext/AuthContext";
import { FavoriteButtonProps } from "@/app/Types";
import React from "react";

const FavoriteButton = ({
  podcastId,
  isFavorite,
  onFavoriteClick,
  buttonSize,
  iconSize,
}: FavoriteButtonProps) => {
  const { user, setUser, token } = useAuth(); // Destructure token from useAuth

  const [favoriteMessage, setFavoriteMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click event from propagating to the parent div

    // Handle favorite/unfavorite logic
    if (user && token) {
      const userId = user._id; // Assuming the user object has an _id field
      console.log(userId, podcastId, isFavorite); // Log userId and podcastId for debugging

      try {
        // Make API request to favorite/unfavorite the podcast
        const response = await fetch(`http://localhost:3000/user/${userId}/favorite/${podcastId}`, {
          method: 'POST', // Use POST for both actions
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isFavorite}), // Explicitly set isFavorite
        });

        if (!response.ok) {
          throw new Error('Failed to favorite/unfavorite the podcast');
        }

        const data = await response.json();

        // Update favorite podcasts in the AuthContext state based on favorite/unfavorite status
        setUser({
          ...user,
          favoritePodcasts: !isFavorite
            ? [...user.favoritePodcasts, podcastId] // Add to favorite podcasts
            : user.favoritePodcasts.filter((id) => id !== podcastId), // Remove from favorite podcasts
        });

        // Show toast message
        setFavoriteMessage(!isFavorite ? "Added to favorite Podcasts" : "Removed from favorite Podcasts");
        setShowToast(true);

        // Hide the toast after 3 seconds
        setTimeout(() => {
          setShowToast(false);
          setFavoriteMessage("");
        }, 3000);

        console.log(data.message); // Success message (optional feedback)

      } catch (error) {
        console.error('Error favoriting/unfavoriting the podcast:', error);
      }
    }

    // Call the parent onFavoriteClick callback if needed
    if (onFavoriteClick) onFavoriteClick(e);
  };
  console.log("userId", user?._id);
console.log("podcastId", podcastId);
    console.log("isFavorite", isFavorite);



  return (
    <div className="relative">
      <button
        className={`${buttonSize}`}
        onClick={handleFavoriteClick}
      >
        {isFavorite ? <FaStar size={iconSize} /> : <FaRegStar size={iconSize} />}
      </button>

      {showToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 p-4 bg-white text-black rounded-md shadow-lg transition-all duration-300 opacity-100">
          {favoriteMessage}
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;
