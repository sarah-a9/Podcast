import { IoPlayOutline, IoPauseOutline } from "react-icons/io5";
import {  useAudio } from "../Providers/AudioProvider";
import { Episode, Podcast } from "@/app/Types";

const PlayPauseButton = ({
  episode,
  podcast,
  buttonSize,
  iconSize  
}: {
  episode?: Episode;
  podcast?: Podcast;
  buttonSize: string;
  iconSize: number;
}) => {
  const { currentEpisode, currentPodcast, isPlaying, playEpisode, togglePlayPause } = useAudio();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Return early if episode or podcast is not provided.
    if (!episode || !podcast) return;

    // Check if the current playing episode and podcast match
    if (
      currentEpisode?._id === episode._id &&
      currentPodcast?._id === podcast._id
    ) {
      togglePlayPause();
    } else {
      playEpisode(episode, podcast);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`text-white cursor-pointer rounded-full hover:bg-gray-500 ${buttonSize}`}
      // Optionally, disable the button if no episode or podcast is set.
      disabled={!episode || !podcast}
    >
      {currentEpisode?._id === episode?._id &&
      currentPodcast?._id === podcast?._id &&
      isPlaying ? (
        <IoPauseOutline size={iconSize} />
      ) : (
        <IoPlayOutline size={iconSize} />
      )}
    </button>
  );
};

export default PlayPauseButton;
