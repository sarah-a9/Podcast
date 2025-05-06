"use client";
import React, { useEffect, useState } from "react";
import PlayPauseButton from "../PlayPauseButton/PlayPauseButton";
import VolumeControl from "../VolumeControl/VolumeControl";
import ProgressBar from "../ProgressBar/ProgressBar";
import NextButton from "../NextButton/NextButton";
import PreviousButton from "../PreviousButton/PreviousButton";
import { useAudio } from "../Providers/AudioProvider";
import { usePathname } from "next/navigation";
import LikeButton from "../LikeButton/LikeButton";
import { useAuth } from "../Providers/AuthContext/AuthContext"; // Import useAuth hook
import Link from "next/link";

const AudioPlayerBar = () => {
  const {
    currentEpisode,
    currentPodcast,
    isPlaying,
    togglePlayPause,
    nextEpisode,
    prevEpisode,
    audioRef,
  } = useAudio();
  const { user, setUser } = useAuth(); // Access user and setUser from context

  const pathname = usePathname();
  // Hide audioplayer on auth pages
  if (pathname.startsWith("/auth")) return null;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLiked, setIsLiked] = useState(false); // State for "liked" status

  // Sync the liked state with the user's likedEpisodes from AuthContext
  useEffect(() => {
    if (user && currentEpisode) {
      setIsLiked(user.likedEpisodes.includes(currentEpisode._id));
    }
  }, [user, currentEpisode]); // Re-run when the user or episode changes

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

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user && currentEpisode) {
      const updatedLikedEpisodes = isLiked
        ? user.likedEpisodes.filter((id) => id !== currentEpisode._id) // Remove episode from likedEpisodes
        : [...user.likedEpisodes, currentEpisode._id]; // Add episode to likedEpisodes

      // Update AuthContext with the new likedEpisodes list
      setUser({
        ...user,
        likedEpisodes: updatedLikedEpisodes,
      });
    }
    setIsLiked((prev) => !prev); // Toggle the like status locally
  };

  return (
    <div
      className={`sticky bottom-0 w-full flex text-white transition-all duration-300 ${
        currentEpisode ? "bg-black opacity-100" : "bg-black/80 opacity-70"
      }`}
    >
      {/* Left Column: Episode Image & Title */}
      <div className="flex items-center space-x-4 p-2 w-1/3">
        {currentPodcast?.podcastImage ? (
          <img
            src={`http://localhost:3000/uploads/podcasts/${currentPodcast.podcastImage}`}
            alt={currentEpisode?.episodeTitle || "Episode"}
            className="w-14 h-14 rounded-sm object-cover transition-transform duration-200 hover:scale-105"
          />
        ) : (
          <div className="w-14 h-14 flex items-center justify-center bg-gray-800 text-gray-400 rounded-sm">
            🎧
          </div>
        )}

        <div className="flex flex-col">
          <Link
            href={`/PodcastDetail/${currentPodcast?._id}/EpisodeDetail/${currentEpisode?._id}`}
          >
            <p className="text-sm font-medium hover:underline">
              {currentEpisode?.episodeTitle || "No episode playing"}
            </p>
          </Link>

          <p className="text-xs text-gray-400 italic">
            {currentPodcast?.creator.firstName}{" "}
            {currentPodcast?.creator.lastName}
          </p>

          {!currentEpisode && (
            <p className="text-xs text-gray-400 italic">
              Pick an episode to start listening 🎧
            </p>
          )}
        </div>

        <div className="mt-2 ml-2">
          {currentEpisode && ( // Only show the LikeButton if an episode is selected
            <LikeButton
              episodeId={currentEpisode._id} // Pass the episodeId prop
              isLiked={isLiked} // Pass the current like status
              onLikeClick={handleLikeClick} // Pass the toggle function
              buttonSize={""}
              iconSize={24}
            />
          )}
        </div>
      </div>

      {/* Center Column: Buttons & Progress Bar */}
      <div className="flex flex-col items-center justify-center w-1/3">
        {/* Controls Row: Previous, Play/Pause, Next */}
        <div className="flex items-center space-x-4 ">
          <PreviousButton onPrevClick={prevEpisode} />

          <PlayPauseButton
            episode={currentEpisode || undefined}
            podcast={currentPodcast || undefined}
            buttonSize="p-2"
            iconSize={24}
          />

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
