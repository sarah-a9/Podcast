"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Providers/AuthContext/AuthContext";
import PlaylistCard from "../components/PlaylistCard/PlaylistCard";
import { Playlist } from "../Types";
import { usePlaylist } from "../components/Providers/PlaylistContext";
import CreatePlaylistModal from "../components/PopUps/CreatePlaylistModal/CreatePlaylistModal";

const AllPlaylistsPage = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fetchedPlaylists, setFetchedPlaylists] = useState<Playlist[]>([]);
  const { playlists, addPlaylist } = usePlaylist();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchUserWithPlaylists = async () => {
      if (!user || !token) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch playlists");
        const data = await res.json();
        setFetchedPlaylists(data.playlists || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWithPlaylists();

    const onPlaylistUpdated = () => {
      fetchUserWithPlaylists();
    };
    const onOpenCreatePlaylistModal = () => {
      openModal();
    };

    window.addEventListener("playlistUpdated", onPlaylistUpdated);
    window.addEventListener("openCreatePlaylistModal", onOpenCreatePlaylistModal);

    return () => {
      window.removeEventListener("playlistUpdated", onPlaylistUpdated);
      window.removeEventListener("openCreatePlaylistModal", onOpenCreatePlaylistModal);
    };
  }, [user, token]);

  useEffect(() => {
    fetchedPlaylists.forEach((playlist) => {
      if (!playlists.some((p) => p._id === playlist._id)) {
        addPlaylist(playlist);
      }
    });
  }, [fetchedPlaylists, playlists, addPlaylist]);

  return (
    <div className="scrollable-container scrollbar-hide bg-gray-900 rounded-lg p-6">
      {playlists.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Playlists</h1>
        </div>
      )}

      <div className="overflow-y-auto max-h-127 scrollbar-hide">
        {loading ? (
          <p className="text-center text-gray-300">Loading playlists...</p>
        ) : playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
            <div className="text-4xl mb-4 text-pink-400">📻</div>
            <h2 className="text-2xl font-semibold text-white mb-2">No Playlists Yet</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              You haven’t created any playlists yet. Organize your favorite episodes into playlists for easy listening!
            </p>
            <button
              onClick={openModal}
              className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded transition"
            >
              Create Your Playlist
            </button>
          </div>
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

      {/* Modal */}
      {isModalOpen && (
        <CreatePlaylistModal
          onClose={closeModal}
          onCreate={(newPlaylist) => {
            addPlaylist(newPlaylist);
            closeModal();
          }}
        />
      )}
    </div>
  );

};

export default AllPlaylistsPage;
