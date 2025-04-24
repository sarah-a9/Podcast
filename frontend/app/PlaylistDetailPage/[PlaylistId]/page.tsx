"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/Providers/AuthContext/AuthContext";
import { Playlist, Episode } from "@/app/Types";
// @ts-ignore
import ColorThief from "color-thief-browser";
import Color from "color";
import toast from "react-hot-toast";
import EpisodeCard from "@/app/components/EpisodeCard/EpisodeCard";
import EpisodeSearchCard from "@/app/components/EpisodeSearchCard/EpisodeSearchCard";
import { MoreVertical } from "lucide-react";
import EditPlaylistModal from "@/app/components/PopUps/EditPlaylistModal";
import DeletePlaylistModal from "@/app/components/PopUps/DeletePlaylistModal";

interface PlaylistDetailResponse extends Playlist {
  episodes: Episode[];
}

const PlaylistDetailPage = ({ params }: { params: { PlaylistId: string } }) => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [playlist, setPlaylist] = useState<PlaylistDetailResponse | null>(null);
  const [bgGradient, setBgGradient] = useState<string>("bg-gray-100");
  const imageRef = useRef<HTMLImageElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // To control menu visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);





  
  const fetchPlaylistDetail = async () => {
    if (!user || !token) return;
    try {
      const res = await fetch(
        `http://localhost:3000/playlist/${params.PlaylistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch playlist details");
      const data = await res.json();
      setPlaylist(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllEpisodes = async () => {
    const res = await fetch("http://localhost:3000/episode");
    const data = await res.json();
    setAllEpisodes(data);
    setFilteredEpisodes(data);
  };

  useEffect(() => {
    fetchPlaylistDetail();
    fetchAllEpisodes();
  }, [user, token, params.PlaylistId]);

  const handleImageLoad = async () => {
    if (!imageRef.current) return;
    const colorThief = new ColorThief();

    try {
      const rgb = await colorThief.getColor(imageRef.current);
      const baseColor = Color.rgb(rgb[0], rgb[1], rgb[2]);

      setBgGradient(
        `linear-gradient(to bottom, ${baseColor.hex()} 0%, #181818 70%)`
      );
    } catch (err) {
      console.error("Color extraction failed:", err);
    }
  };

  const handleAddToPlaylist = async (episodeId: string) => {
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:3000/playlist/${params.PlaylistId}/episode/${episodeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ episodeId }),
        }
      );

      if (!res.ok) throw new Error("Failed to add episode to playlist");

      const addedEpisode = allEpisodes.find((ep) => ep._id === episodeId);
      if (addedEpisode) {
        setPlaylist((prev) =>
          prev
            ? {
                ...prev,
                episodes: [...prev.episodes, addedEpisode],
              }
            : prev
        );
      }

      toast.success("Episode added to playlist!");
    } catch (err) {
      console.error("Error adding episode:", err);
      toast.error("Oops! Couldn't add the episode.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFeedbackMsg(null);

    const maxDisplay = 10; // Limit the number of episodes to display (adjust this number as needed)

    if (query.trim()) {
      const filtered = allEpisodes.filter((episode) =>
        episode.episodeTitle.toLowerCase().includes(query)
      );

      setFilteredEpisodes(filtered.slice(0, maxDisplay));
    } else {
      setFilteredEpisodes(allEpisodes.slice(0, maxDisplay));
    }
  };

  const handleOpenEditModal = () => {
    setShowEditModal(true);
    setShowMenu(false); // Close the menu when opening the modal
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  

  if (!playlist) return <p>Loading...</p>;
  console.log("Episodes:", playlist.episodes);

  return (
    <div
      style={{ background: bgGradient }}
      className="flex flex-col p-6 rounded-lg h-[79.3vh] overflow-y-auto scrollbar-hide"
    >
      <div className="flex gap-6 mb-8">
        <div style={{ height: "5.3cm", width: "8cm" }} className="w-1/3">
          <img
            ref={imageRef}
            crossOrigin="anonymous"
            src={`http://localhost:3000/uploads/playlists/${playlist.playlistImg}`}
            alt="Playlist"
            onLoad={handleImageLoad}
            className="object-cover w-full h-full rounded-xl"
          />
        </div>

        <div className="flex flex-col justify-center w-2/3 ">
          <div className="flex justify-between items-start">
            <h1 className="text-6xl font-bold mt-9 text-white">
              {playlist.playlistName}
            </h1>
            <div className="relative">
              <MoreVertical
                size={32}
                className="text-white cursor-pointer mt-16"
                onClick={() => setShowMenu((prev) => !prev)} // Toggle menu visibility
              />
              {showMenu && (
                <div className="absolute mt-2 right-0 bg-gray-700 text-white w-48 rounded-lg shadow-lg z-50 cursor-pointer">
                  <button
                    onClick={handleOpenEditModal}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-600 transition-colors rounded-t-lg cursor-pointer"
                  >
                    Edit Playlist
                  </button>
                  <button
                    onClick={handleOpenDeleteModal}
                    className="block w-full text-left px-4 py-3 text-red-400 hover:bg-gray-600 transition-colors rounded-b-lg cursor-pointer"
                  >
                     Delete Playlist
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-white/80 text-lg mb-2 mt-1 font-medium leading-relaxed">
            {playlist.playlistDescription}
          </p>
          <p className="text-sm text-white italic">
            <span className="font-semibold">
              {user?.firstName} {user?.lastName}
            </span>
          </p>
        </div>
      </div>

      <div className="border-t-2 my-4"></div>

      <h2 className="text-white text-2xl font-semibold mb-3 mt-2">
        Your Episodes
      </h2>
      <div className="space-y-4 mb-6">
        {playlist.episodes.length === 0 ? (
          <p className="text-white italic">No episodes added yet.</p>
        ) : (
          playlist.episodes?.map((episode) =>
            episode?._id ? (
              <EpisodeCard
                key={episode._id}
                episode={episode}
                podcast={episode.podcast}
                className="text-sm gap-2"
                imageClassName="w-16 h-16 object-cover mt-2"
                playlistId={playlist._id} 

              />
            ) : null
          )
        )}
      </div>

      <p className="text-white mb-2">Find Episodes for your Playlist</p>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search episodes..."
        className="w-1/3 p-2 rounded-md border border-gray-300 mb-4"
      />

      {feedbackMsg && (
        <div className="mb-2 text-white bg-blue-500 px-3 py-2 rounded">
          {feedbackMsg}
        </div>
      )}

      

      {searchQuery && (
        <div className="flex-1">
          {filteredEpisodes.length === 0 ? (
            <p className="text-white">No episodes found.</p>
          ) : (
            filteredEpisodes.map((episode) => (
              <EpisodeSearchCard
                key={episode._id}
                episode={episode}
                podcast={episode.podcast}
                isInPlaylist={playlist.episodes.some(
                  (ep) => ep._id === episode._id
                )}
                onAddClick={() => handleAddToPlaylist(episode._id)}
              />
            ))
          )}
        </div>
      )}

      {showEditModal && (
        <EditPlaylistModal
          playlist={playlist}
          onClose={handleCloseEditModal}
          onEdit={(updatedPlaylist) => {
            console.log("Updated Playlist:", updatedPlaylist);
            fetchPlaylistDetail();
            setPlaylist(updatedPlaylist);
            handleCloseEditModal();
          }}
        />
      )}

      {showDeleteModal && (
        <DeletePlaylistModal
          onClose={handleCloseDeleteModal}
          onDelete={() => {
            router.push("/");
          }}
          playlistName={playlist.playlistName}
          playlistId={playlist._id}
        />
      )}
    </div>
  );
};

export default PlaylistDetailPage;
