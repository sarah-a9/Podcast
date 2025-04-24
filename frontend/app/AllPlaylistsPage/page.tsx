"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Providers/AuthContext/AuthContext";
import PlaylistCard from "../components/PlaylistCard/PlaylistCard";
import { Playlist } from "../Types";
import { usePlaylist } from "../components/Providers/PlaylistContext";

const AllPlaylistsPage = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fetchedPlaylists, setFetchedPlaylists] = useState<Playlist[]>([]);  // Local state to store fetched playlists
  const { playlists, addPlaylist } = usePlaylist();  

  useEffect(() => {
    const fetchUserWithPlaylists = async () => {
      if (!user || !token) return;

      try {
        const res = await fetch(`http://localhost:3000/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user with playlists");

        const data = await res.json();

        // Store fetched playlists locally
        setFetchedPlaylists(data.playlists || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWithPlaylists();
  }, [user, token]);

  useEffect(() => {
    // Add playlists to the context only if they are not already present
    fetchedPlaylists.forEach((playlist) => {
      if (!playlists.some(existingPlaylist => existingPlaylist._id === playlist._id)) {
        addPlaylist(playlist); // Add only if not already in context
      }
    });
  }, [fetchedPlaylists, playlists, addPlaylist]); // This runs after fetching playlists

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Playlists</h1>
      <div className="overflow-y-auto max-h-127 scrollbar-hide"> 
        {loading ? (
          <p>Loading playlists...</p>
        ) : playlists.length === 0 ? (
          <p className="text-gray-500">You haven’t created any playlists yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                _id={playlist._id}
                playlistName={playlist.playlistName}
                playlistImg={playlist.playlistImg}
                episodes={playlist.episodes || []}
                playlistDescription={playlist.playlistDescription || ""}
                creator={{
                  firstName: playlist.creator?.firstName || "",
                  lastName: playlist.creator?.lastName || "",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPlaylistsPage;
