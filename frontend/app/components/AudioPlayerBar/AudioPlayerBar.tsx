"use client";
import PlayPauseButton from "../PlayPauseButton/PlayPauseButton";
import VolumeControl from "../VolumeControl/VolumeControl";
import ProgressBar from "../ProgressBar/ProgressBar";
import NextPreviousButton from "../NextPreviousButton/NextPreviousButton";
import { useAudio } from "../Providers/AudioProvider";
import { useEffect, useState } from "react";
import PreviousButton from "../PreviousButton/PreviousButton";
import NextButton from "../NextButton/NextButton";
import { usePathname } from "next/navigation";


const AudioPlayerBar = () => {
  const {
    currentEpisode,
    currentPodcast, // ✅ Added to pass to PlayPauseButton
    isPlaying,
    togglePlayPause,
    nextEpisode,
    prevEpisode,
    audioRef
  } = useAudio();

  const pathname = usePathname();
  // Hide audioplayer on auth pages
  if (pathname.startsWith('/auth')) return null;
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode?.audioUrl) return;

    audio.src = currentEpisode.audioUrl;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [currentEpisode]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleProgressBarChange = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  return (
    <div className="sticky bottom-0 w-full bg-black flex text-white">
      {/* Left Column: Episode Image & Title */}
      <div className="flex items-center space-x-4 p-2 w-1/3">
        <img
          src={currentPodcast?.podcastImage}
          alt={currentEpisode?.episodeTitle || "Episode"}
          className="w-14 h-14 rounded-sm object-cover"
        />
        <div>
          <p className="text-sm">{currentEpisode?.episodeTitle || "No episode playing"}</p>
        </div>
      </div>
  
      {/* Center Column: Buttons & Progress Bar */}
      <div className="flex flex-col items-center justify-center w-1/3">
        {/* Controls Row: Previous, Play/Pause, Next */}
        <div className="flex items-center space-x-4 ">
          <PreviousButton onPrevClick={prevEpisode} />
          
          {currentEpisode && currentPodcast && (
            <PlayPauseButton
              episode={currentEpisode}
              podcast={currentPodcast}
              buttonSize="p-2"
              iconSize={24}
            />
          )}
          
          <NextButton onNextClick={nextEpisode} />
        </div>
        
        {/* Progress Bar */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onProgressChange={handleProgressBarChange}
          
        />
      </div>
  
      {/* Right Column: Volume Control */}
      <div className="flex items-center p-5 w-1/3 justify-end">
        <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
      </div>
    </div>
  );
  

};

export default AudioPlayerBar;
