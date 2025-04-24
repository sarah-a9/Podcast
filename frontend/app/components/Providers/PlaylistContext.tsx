"use client";
// PlaylistContext.tsx
import React, { createContext, useContext, useState } from "react";
import { Playlist } from "@/app/Types";

type PlaylistContextType = {
  playlists: Playlist[];
  addPlaylist: (playlist: Playlist) => void;
};

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const addPlaylist = (playlist: Playlist) => {
    setPlaylists((prev) => [...prev, playlist]);
  };

  return (
    <PlaylistContext.Provider value={{ playlists, addPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};
