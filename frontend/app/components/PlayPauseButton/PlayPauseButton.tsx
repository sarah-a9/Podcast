import { IoPlayOutline, IoPauseOutline } from "react-icons/io5";
import { Episode, Podcast, useAudio } from "../Providers/AudioProvider";

const PlayPauseButton = ({ episode, podcast, buttonSize, iconSize  }: {episode: Episode, podcast: Podcast, buttonSize: string, iconSize: number  }) => {
  const { currentEpisode, currentPodcast, isPlaying, playEpisode, togglePlayPause } = useAudio();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentEpisode?._id === episode._id && currentPodcast?._id === podcast._id) {
      togglePlayPause();
    } else {
      playEpisode(episode, podcast); // Now passing the podcast as well
    }
  };

  return (
    <button onClick={handleClick} className={`text-white cursor-pointer rounded-full hover:bg-gray-500 ${buttonSize}`}>
      {currentEpisode?._id === episode._id && currentPodcast?._id === podcast._id && isPlaying ? (
        <IoPauseOutline size={iconSize} />
      ) : (
        <IoPlayOutline size={iconSize} />
      )}
    </button>
  );
};

export default PlayPauseButton;
