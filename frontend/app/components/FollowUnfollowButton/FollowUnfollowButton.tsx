import { useEffect, useState } from "react";
import { useAuth } from "../Providers/AuthContext/AuthContext";
import { FollowUnfollowButtonProps } from "@/app/Types";



const FollowUnfollowButton = ({
  isFollowing,
  onFollow,
  onUnfollow,
  TargetUserId,
}: FollowUnfollowButtonProps) => {
  const { user, token } = useAuth();
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  const [loading, setLoading] = useState(false);


  // Sync prop change to internal state
  useEffect(() => {
    setIsFollowingState(isFollowing);
  }, [isFollowing]);


  const handleFollowClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !token) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/user/${TargetUserId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to follow the user');
      }
      console.log('TargetUserId:', TargetUserId);


      setIsFollowingState(true);
      onFollow();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
console.log('TargetUserId:', TargetUserId);

  const handleUnfollowClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !token) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/user/${TargetUserId}/unfollow`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow the user');
      }

      setIsFollowingState(false);
      onUnfollow();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

    return (
    <button
      onClick={isFollowingState ? handleUnfollowClick : handleFollowClick}
      disabled={loading}
      className={`
        relative px-5 py-2 rounded-full text-sm font-semibold
        transition-colors duration-300 ease-in-out
        flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          isFollowingState
            ? "bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:ring-indigo-400"
        }
        ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
      `}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8h4l-3 3 3 3h-4z"
          ></path>
        </svg>
      ) : isFollowingState ? (
        "Following"
      ) : (
        "Follow"
      )}
    </button>
  );
};

export default FollowUnfollowButton;
