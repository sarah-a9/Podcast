import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ActionButtons from "../EpisodeActionButtons/EpisodeActionButtons";
import { useAuth } from "../Providers/AuthContext/AuthContext"; // Import the useAuth hook
import { Episode, Podcast } from "@/app/Types";

const EpisodeCard = ({
  episode,
  podcast,
  className = "",
  imageClassName = "",
  playlistId = null,   // 👈 added this
}: {
  episode: Episode;
  podcast: Podcast;
  className?: string;
  imageClassName?: string;
  playlistId?: string | null;
}) => {
  const router = useRouter();
  const { user, setUser , token } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [playlist, setPlaylist] = useState<Episode[]>([]);  // Assuming playlist is an array of episodes
  

  useEffect(() => {
    if (user && user.likedEpisodes) {
      setLiked(user.likedEpisodes.includes(episode._id));
    }
  }, [user, episode._id]);

  useEffect(() => {
    // Assume you have a method to fetch the playlist for the given playlistId
    if (playlistId) {
      fetchPlaylistData();
    }
  }, [playlistId]);

  const fetchPlaylistData = async () => {
    // Example fetch call for playlist data (replace with actual API logic)
    try {
      const response = await fetch(`http://localhost:3000/playlist/${playlistId}`);
      const data = await response.json();
      setPlaylist(data.episodes);  // Assuming response contains an array of episodes
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  const handleOnClick = () => {
    router.push(`/PodcastDetail/${podcast._id}/EpisodeDetail/${episode._id}`, {
      scroll: false,
    });
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user && user.likedEpisodes) {
      const updatedLikedEpisodes = liked
        ? user.likedEpisodes.filter((id) => id !== episode._id)
        : [...user.likedEpisodes, episode._id];

      setUser({
        ...user,
        likedEpisodes: updatedLikedEpisodes,
      });
    }
    setLiked(!liked);
  };

  const handleRemoveFromPlaylist = async (episodeId: string) => {
    // Step 1: Immediately update the state to reflect the removal in the UI
    const updatedPlaylist = playlist.filter((ep) => ep._id !== episodeId);
    setPlaylist(updatedPlaylist);
  
    // Step 2: Send the DELETE request to the server (to sync with the backend)
    try {
      const response = await fetch(`http://localhost:3000/playlist/${playlistId}/episode/${episodeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        // If the request fails, you can undo the change or show an error
        throw new Error("Failed to remove episode from playlist");
      }
  
      // Optionally, handle a success message or any additional state updates here
      console.log("Episode removed successfully from the playlist.");
    } catch (error) {
      // Step 3: Handle the error (e.g., show a notification or revert the state)
      console.error("Error removing episode from playlist:", error);
      
      // Optionally, you could revert the state update if there's an error
      // setPlaylist(playlist); // Uncomment to revert if needed
    }
  };
  

  return (
    <div
      key={episode._id}
      className="grid grid-cols-8 gap-4 cursor-pointer rounded-2xl hover:bg-black/50 transition duration-200"
      onClick={handleOnClick}
    >
      {/* Episode Image */}
      <div className="col-span-1">
        <img
          className={`rounded-lg ${imageClassName}`}
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
        <p className="text-sm text-gray-400 mt-16">
          {episode.createdAt ? episode.createdAt.split("T")[0] : "Unknown Date"}
        </p>
      </div>

      {/* Duration (empty for now) */}
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
          showMenu={showMenu} // Pass down showMenu as a prop
          setShowMenu={setShowMenu} // Pass down setShowMenu to control it from here
          playlistId={playlistId}  // Pass down playlistId to the ActionButtons component
          onRemoveFromPlaylist={handleRemoveFromPlaylist} // Callback to remove episode from playlist
        />
      </div>

      {/* Optional Separator */}
      <div className="col-span-8">
        <hr style={{ color: "grey" }} />
      </div>
    </div>
  );
};

export default EpisodeCard;
