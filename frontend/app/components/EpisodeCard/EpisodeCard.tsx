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
}: {
  episode: Episode;
  podcast: Podcast;
  className?: string;
  imageClassName?: string;
}) => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && user.likedEpisodes) {
      setLiked(user.likedEpisodes.includes(episode._id));
    }
  }, [user, episode._id]);

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

  return (
    <div
      key={episode._id}
      className="grid grid-cols-8 gap-4 cursor-pointer rounded-2xl hover:bg-black/50 transition duration-200"


      onClick={handleOnClick}
    >
      {/* Episode Image */}
      <div className="col-span-1 ">
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
        />
      </div>

      {/* Optional Separator */}
      <div className="col-span-8 ">
        <hr style={{ color: "grey" }} />
      </div>
    </div>
  );
};

export default EpisodeCard;