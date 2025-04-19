"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Providers/AuthContext/AuthContext";
import PlaylistCard from "../components/PlaylistCard/PlaylistCard";
import { Playlist } from "../Types";

const AllPlaylistsPage = () => {
  const { user, token } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  

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
        setPlaylists(data.playlists || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWithPlaylists();
  }, [user, token]);
  console.log("playlistImage", )

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
