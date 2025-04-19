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
    const fetchPlaylists = async () => {
      if (!user || !token) return;

      try {
        const res = await fetch(`http://localhost:3000/user/${user._id}/playlists`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error("Failed to fetch playlists");

        const data = await res.json();
        setPlaylists(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [user, token]);

  console.log("user", user?._id);
  console.log("playlists",user?.playlists);
  console.log("playlists",playlists);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Playlists</h1>

      {loading ? (
        <p>Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <p className="text-gray-500">You haven’t created any playlists yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* {user?.playlists.map((playlist) => (
            <PlaylistCard playlistDescription={playlist.} key={playlist._id} _id={playlist._id} playlistName={playlist.playlistName} creator={{
                  firstName: playlist.creator.firstName,
                  lastName: playlist.creator.lastName,
              }} episodes={[]}  />
          ))} */}
        </div>
      )}
    </div>
  );
};

export default AllPlaylistsPage;



***************************************************************************************************

 // const fetchAllEpisodes = async () => {
    //   if (!user || !token) return;

    //   try {
    //     const res = await fetch(`http://localhost:3000/episodes`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     if (!res.ok) throw new Error("Failed to fetch episodes");
    //     const data = await res.json();
    //     setAllEpisodes(data);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };


    // const handleAddEpisode = async (episodeId: string) => {
      //   try {
      //     const res = await fetch(
      //       `http://localhost:3000/playlists/${params.PlaylistId}/episode/${episodeId}`,
      //       {
      //         method: "POST",
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //           "Content-Type": "application/json",
      //         },
      //       }
      //     );
      //     if (!res.ok) throw new Error("Failed to add episode");
      //     const updatedPlaylist = await res.json();
      //     setPlaylist(updatedPlaylist);
      //   } catch (err) {
      //     console.error(err);
      //   }
      // };
    
      // const handleRemoveEpisode = async (episodeId: string) => {
      //   try {
      //     const res = await fetch(
      //       `http://localhost:3000/playlists/${params.PlaylistId}/episode/${episodeId}`,
      //       {
      //         method: "DELETE",
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //           "Content-Type": "application/json",
      //         },
      //       }
      //     );
      //     if (!res.ok) throw new Error("Failed to remove episode");
      //     const updatedPlaylist = await res.json();
      //     setPlaylist(updatedPlaylist);
      //   } catch (err) {
      //     console.error(err);
      //   }
      // };
    
      // const handleUpdatePlaylist = async (updatedDetails: { name: string; description: string }) => {
      //   try {
      //     const res = await fetch(`http://localhost:3000/Playlist/${params.PlaylistId}`, {
      //       method: "PATCH",
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(updatedDetails),
      //     });
      //     if (!res.ok) throw new Error("Failed to update playlist");
      //     const updatedPlaylist = await res.json();
      //     setPlaylist(updatedPlaylist);
      //   } catch (err) {
      //     console.error(err);
      //   }
      // };
    
      // const handleDeletePlaylist = async () => {
      //   try {
      //     const res = await fetch(`http://localhost:3000/Playlist/${params.PlaylistId}`, {
      //       method: "DELETE",
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //         "Content-Type": "application/json",
      //       },
      //     });
      //     if (!res.ok) throw new Error("Failed to delete playlist");
      //     router.push("/playlists"); // Redirect after deletion
      //   } catch (err) {
      //     console.error(err);
      //   }
      // };


      {/* Update Playlist Form */}
      {/* <div className="mb-6">
        <h3 className="font-semibold mb-2">Edit Playlist Info</h3> */}
        {/* <button
          onClick={() => handleUpdatePlaylist({ name: "New Name", description: "New description" })}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Update Playlist
        </button> */}
      {/* </div> */}

      {/* Episodes List */}
      {/* <h3 className="font-semibold mb-2">Episodes</h3> */}
      {/* <ul>
        {playlist.episodes.map((episode) => (
          <li key={episode._id} className="flex justify-between items-center mb-2">
            <span>{episode.episodeTitle}</span> */}
            {/* <button
              onClick={() => handleRemoveEpisode(episode._id)}
              className="text-red-500"
            >
              Remove
            </button> */}
          {/* </li>
        ))}
      </ul> */}

      {/* Add Episode */}
      {/* <div className="mt-6">
        <h3 className="font-semibold mb-2">Add an Episode</h3> */}
        {/* <select
          onChange={(e) => handleAddEpisode(e.target.value)}
          className="bg-gray-200 p-2 rounded-md"
        >
          <option value="">Select an episode</option>
          {allEpisodes.map((episode) => (
            <option key={episode._id} value={episode._id}>
              {episode.episodeTitle}
            </option>
          ))}
        </select> */}
      {/* </div> */}

      {/* Delete Playlist */}
      {/* <div className="mt-6"> */}
        {/* <button
          onClick={handleDeletePlaylist}
          className="bg-red-500 text-white p-2 rounded-md"
        >
          Delete Playlist
        </button> */}
      {/* </div> */}
