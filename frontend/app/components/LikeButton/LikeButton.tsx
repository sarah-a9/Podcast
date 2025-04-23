import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useAuth } from "../Providers/AuthContext/AuthContext";
import { LikeButtonProps } from "@/app/Types";
import { useState } from "react";

const LikeButton = ({ episodeId, isLiked, onLikeClick, buttonSize, iconSize }: LikeButtonProps) => {
  const { user, setUser, token } = useAuth();  // Destructure token from useAuth
  const [likeMessage, setLikeMessage] = useState("");  // Local state to handle the message
  const [showToast, setShowToast] = useState(false);  // State to handle the visibility of the toast

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Handle like/unlike logic
    if (user && token) {  // Ensure both user and token exist
      const userId = user._id;  // Assuming the user object has an _id field
      console.log(userId, episodeId, isLiked); // Log userId and episodeId for debugging

      try {
        // Make API request to like/unlike the episode
        const response = await fetch(`http://localhost:3000/user/${userId}/like/${episodeId}`, {
          method: 'POST',  // Use POST for both actions
          headers: {
            'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
            'Content-Type': 'application/json',  // Optional: Content-Type header, depending on your backend
          },
          body: JSON.stringify({ isLiked }),  // Send the isLiked status in the request body
        });

        if (!response.ok) {
          throw new Error('Failed to like/unlike the episode');
        }

        const data = await response.json();

        // Update likedEpisodes in the AuthContext state based on like/unlike status
        setUser({
          ...user,
          likedEpisodes: isLiked
            ? user.likedEpisodes.filter((id) => id !== episodeId) // Remove from liked episodes
            : [...user.likedEpisodes, episodeId], // Add to liked episodes
        });

        console.log(data.message); // Success message (optional feedback)

        // Show the "Added to liked Episodes" message
        setLikeMessage(isLiked ? "Removed from liked Episodes" : "Added to liked Episodes");
        setShowToast(true);  // Show the toast notification

        // Hide the message after 3 seconds
        setTimeout(() => {
          setShowToast(false);  // Hide the toast
          setLikeMessage("");  // Clear the message
        }, 3000); // Set to 3 seconds to match the typical Spotify toast duration
      } catch (error) {
        console.error('Error liking/unliking the episode:', error);
      }
    }

    // Call the parent onLikeClick callback if needed
    if (onLikeClick) onLikeClick(e);
  };

  return (
    <div className="relative">
      <button
        className={`text-gray-400 hover:text-red-500 ${isLiked ? "text-red-500" : ""} ${buttonSize}`}
        onClick={handleLikeClick}
      >
        {isLiked ? <IoMdHeart size={iconSize} /> : <IoMdHeartEmpty size={iconSize} />}
      </button>

      {/* Show the like message as a toast */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 p-4 bg-white text-black rounded-md shadow-lg transition-all duration-300 opacity-100">
          {likeMessage}
        </div>
      )}
    </div>
  );
};

export default LikeButton;
