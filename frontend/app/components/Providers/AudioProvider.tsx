"use client";
import { Episode, Podcast } from "@/app/Types";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

// Define the shape of an episode
// export interface Episode {
//   // podcast: Podcast;
//   _id: string;
//   episodeTitle: string;
//   episodeDescription: string;
//   audioUrl: string;
//   createdAt: string;
// }

// Define the shape of a podcast
// export interface Podcast {
//   _id: string;
//   podcastName: string;
//   podcastImage: string;
//   episodes: Episode[]; // List of episodes within the podcast
// }

// Define the type of the context
interface AudioContextType {
  currentEpisode: Episode | null;
  currentPodcast: Podcast | null;
  isPlaying: boolean;
  playEpisode: (episode: Episode, podcast: Podcast) => void;
  togglePlayPause: () => void;
  nextEpisode: () => void;
  prevEpisode: () => void;
  audioRef: React.RefObject<HTMLAudioElement>; // Add this
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  //   // Function to play an episode
  // const playEpisode = (episode: Episode) => {
  //   setCurrentEpisode(episode);
  //   setIsPlaying(true);
  // };

  //this is the correct one if you wanna go bach before you add the podcast
  // const playEpisode = (episode: Episode) => {
  //   setCurrentEpisode(episode);
  //   setIsPlaying(true);

  //   if (audioRef.current) {
  //     audioRef.current.src = episode.audioUrl;
  //     audioRef.current.play();
  //   }
  // };

  // **Updated playEpisode function**
  const playEpisode = (episode: Episode, podcast: Podcast) => {
    setCurrentPodcast(podcast); // Set the podcast when playing an episode
    setCurrentEpisode(episode);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.src = episode.audioUrl;
      audioRef.current.play();
    }
  };

  // Function to play an episode from a specific podcast
  //  const playEpisode = (episode: Episode, podcast: Podcast) => {
  //   setCurrentEpisode(episode);
  //   setCurrentPodcast(podcast);
  //   setIsPlaying(true);
  // };

  // Function to toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // **Updated nextEpisode function (No Looping)**
  const nextEpisode = () => {
    if (!currentPodcast || !currentEpisode || !Array.isArray(currentPodcast.episodes)) {
      console.log("No podcast or episode data available.");
      return;
    }
  
    const currentIndex = currentPodcast.episodes.findIndex(
      (ep) => ep._id === currentEpisode._id
    );
  
    if (currentIndex !== -1 && currentIndex < currentPodcast.episodes.length - 1) {
      playEpisode(currentPodcast.episodes[currentIndex + 1], currentPodcast);
    } else {
      console.log("You have reached the last episode.");
    }
  };
  

  // **Updated prevEpisode function (No Looping)**
  const prevEpisode = () => {
    if (!currentPodcast || !currentEpisode) return;

    const currentIndex = currentPodcast.episodes.findIndex(
      (ep) => ep._id === currentEpisode._id
    );

    if (currentIndex > 0) {
      playEpisode(currentPodcast.episodes[currentIndex - 1], currentPodcast);
    } else {
      console.log("You are already at the first episode.");
    }
  };

  const forward = () => {
    if (
      audioRef.current &&
      audioRef.current.currentTime &&
      audioRef.current.duration &&
      audioRef.current.currentTime + 5 < audioRef.current.duration
    ) {
      audioRef.current.currentTime += 5;
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const rewind = () => {
    if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
      audioRef.current.currentTime -= 5;
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Play new episode when `currentEpisode` changes
  // useEffect(() => {
  //     if (currentEpisode && audioRef.current) {
  //       console.log("Playing audio from:", currentEpisode.audioUrl);
  //       audioRef.current.src = currentEpisode.audioUrl;
  //       audioRef.current.play();
  //       setIsPlaying(true);
  //     }
  //   }, [currentEpisode]);

  // **Handle Audio Source Update & Cleanup**
  useEffect(() => {
    if (currentEpisode && audioRef.current) {
      const audio = audioRef.current;

      if (audio.src !== currentEpisode.audioUrl) {
        audio.pause();
        audio.src = currentEpisode.audioUrl;
        audio.load();
      }

      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Playback error:", error));

      return () => {
        audio.pause(); // Ensure audio stops when switching episodes
      };
    }
  }, [currentEpisode]);

  // Reset the audio when navigating to "/create-podcast"
  // useEffect(() => {
  //     if (pathname === "/create-podcast") {
  //       setCurrentEpisode(null);
  //       setIsPlaying(false);
  //     }
  //   }, [pathname]);

  return (
    <AudioContext.Provider
      value={{
        currentEpisode,
        currentPodcast,
        isPlaying,
        playEpisode,
        togglePlayPause,
        nextEpisode,
        prevEpisode,
        audioRef: audioRef as React.RefObject<HTMLAudioElement>, // Provide the ref to other components
      }}
    >
      {children}
      <audio ref={audioRef} />
    </AudioContext.Provider>
  );
};

// Custom hook to use the Audio Context
const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export { AudioProvider, useAudio };
