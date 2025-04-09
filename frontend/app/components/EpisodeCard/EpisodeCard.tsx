import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ActionButtons from "../EpisodeActionButtons/EpisodeActionButtons";
import { useAuth } from "../Providers/AuthContext/AuthContext"; // Import the useAuth hook

const EpisodeCard = ({ episode, podcast }: { episode: any; podcast: any }) => {
  const router = useRouter();
  const { user, setUser } = useAuth(); // Access user and setUser from context
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && user.likedEpisodes) {
      // Check if the episode is in the user's likedEpisodes
      setLiked(user.likedEpisodes.includes(episode._id));
    }
  }, [user, episode._id]); // Re-run when the user or episode changes

  const handleOnClick = () => {
    router.push(`/PodcastDetail/${podcast._id}/EpisodeDetail/${episode._id}`, {
      scroll: false,
    });
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click event
    setShowMenu(!showMenu);
  };

  // Handle like button click
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click event from propagating to the parent div
    if (user && user.likedEpisodes) {
      // Update the user's likedEpisodes list
      const updatedLikedEpisodes = liked
        ? user.likedEpisodes.filter((id) => id !== episode._id) // Remove episode from likedEpisodes
        : [...user.likedEpisodes, episode._id]; // Add episode to likedEpisodes

      // Update AuthContext with the new likedEpisodes list
      setUser({
        ...user,
        likedEpisodes: updatedLikedEpisodes,
      });
    }
    setLiked(!liked); // Toggle the liked state locally
  };

  return (
    <div
      key={episode._id}
      className="grid grid-cols-8 gap-4 cursor-pointer hover:bg-gray-700 rounded-2xl mt-6"
      onClick={handleOnClick}
    >
      {/* Episode Image */}
      <div className="col-span-1">
        <img
          className="rounded-lg"
          src={podcast.podcastImage}
          alt={episode.episodeTitle}
        />
      </div>

      {/* Episode Title & Description */}
      <div className="col-span-3 mt-1">
        <p className="text-xl">{episode.episodeTitle}</p>
        <p className="text-sm text-gray-400">{episode.episodeDescription}</p>
      </div>

      {/* Episode Date */}
      <div className="col-span-1">
        <p className="text-sm text-gray-400 mt-5">
          {episode.createdAt.split("T")[0]}
        </p>
      </div>

      {/* Duration (if available) */}
      <div className="col-span-1">
        <p className="text-sm text-gray-400 mt-5"></p>
      </div>

      {/* Action Buttons */}
      <div className="col-span-1 flex items-center space-x-10">
        <ActionButtons
          episode={episode}
          podcast={podcast}
          isLiked={liked}
          onLikeClick={handleLikeClick}
        />
      </div>

      {/* Separator after each episode */}
      <div className="col-span-8 mt-4">
        <hr style={{ color: "grey" }} />
      </div>
    </div>
  );
};

export default EpisodeCard;
