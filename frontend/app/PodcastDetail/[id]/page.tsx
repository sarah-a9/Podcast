"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import EpisodeCard from "@/app/components/EpisodeCard/EpisodeCard";
import CreateEpisodePopup from "../../components/PopUps/CreateEpisodePopUp";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton";
import { useAuth } from "../../components/Providers/AuthContext/AuthContext";
import DeletePodcastPopup from "../../components/PopUps/DeletePodcastPopup";
import EditPodcastPopup from "../../components/PopUps/EditPodcastPopup";
import { Episode } from "@/app/Types";

export default function PodcastDetails() {
  const { id: podcastId } = useParams() as { id: string };
  const router = useRouter();
  const { user, setUser } = useAuth();

  // ────────────────────────────────────────────────────────────────────────────────
  //  ░░ State
  // ────────────────────────────────────────────────────────────────────────────────
  const [podcast, setPodcast] = useState<{
    creator: any;
    _id: string;
    podcastName: string;
    podcastDescription: string;
    podcastImage: string;
    episodes: Episode[];
    favoritedByUsers: string[];
    categories: any[];
    createdAt: string;
  } | null>(null);

  const [openCreateEpisode, setOpenCreateEpisode] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCreatorMenu, setShowCreatorMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ────────────────────────────────────────────────────────────────────────────────
  //  ░░ Derived role‑based booleans
  // ────────────────────────────────────────────────────────────────────────────────
  const isCreator = user?._id === podcast?.creator._id;
  const isAdmin = user?.role === 0;
  const isRegularUser = user?.role === 1 && !isCreator;

  // ────────────────────────────────────────────────────────────────────────────────
  //  ░░ Fetch podcast   ░░
  // ────────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`http://localhost:3000/podcast/${podcastId}`)
      .then(res => res.json())
      .then(data => {
        setPodcast(data);

        // favourite state for regular users only
        if (user && data) {
          const favs = Array.isArray(user.favoritePodcasts) ? user.favoritePodcasts : [];
          setIsFavorite(favs.includes(data._id));
        }
      })
      .catch(console.error);
  }, [podcastId, user]);

  // ────────────────────────────────────────────────────────────────────────────────
  //  ░░ Close creator menu on outside click ░░
  // ────────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowCreatorMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ────────────────────────────────────────────────────────────────────────────────
  //  ░░ Favourite toggle handler (regular users only) ░░
  // ────────────────────────────────────────────────────────────────────────────────
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !podcast || !isRegularUser) return;

    const updatedFavs = isFavorite
      ? user.favoritePodcasts.filter((x: string) => x !== podcast._id)
      : [...user.favoritePodcasts, podcast._id];

    setUser({ ...user, favoritePodcasts: updatedFavs });
    setIsFavorite(!isFavorite);
  };

  if (!podcast) return <p className="text-gray-400">Loading…</p>;

  // ────────────────────────────────────────────────────────────────────────────────
  //  ░░ JSX ░░
  // ────────────────────────────────────────────────────────────────────────────────
  return (
  <div className="h-screen text-white bg-gray-900 scrollable-container scrollbar-hide">
    <div className="bg-gradient-to-b from-[#1e1e1e] to-black p-8 rounded-lg shadow-xl w-full flex flex-col">
      {/* ── Header Row ── */}
      <div className="flex justify-between items-start mb-8">
        

        {/* Creator menu – Creator only */}
        {isCreator && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowCreatorMenu(prev => !prev)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <MoreHorizontal size={24} />
            </button>
            {showCreatorMenu && (
              <ul className="absolute right-0 mt-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-10">
                <li
                  onClick={() => {
                    setShowEdit(true);
                    setShowCreatorMenu(false);
                  }}
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                >
                  Edit Podcast
                </li>
                <li
                  onClick={() => {
                    setShowDelete(true);
                    setShowCreatorMenu(false);
                  }}
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                >
                  Delete Podcast
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Admin buttons */}
      {isAdmin && (
        <div className="flex gap-4 mb-4 self-end">
          <button
            onClick={() => setShowEdit(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-800 rounded transition-colors"
          >
            Update Podcast
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-700 rounded transition-colors"
          >
            Delete Podcast
          </button>
        </div>
      )}

      {/* ── Podcast Info Section ── */}
      <div className="grid grid-cols-6 gap-6 bg-white/5 p-6 rounded-2xl backdrop-blur-md shadow-md">
        {/* Image */}
        <div className="col-span-1">
          <img
            className="rounded-xl w-full h-auto object-cover shadow-lg"
            src={`http://localhost:3000/uploads/podcasts/${podcast.podcastImage}`}
            alt={podcast.podcastName}
          />
        </div>

        {/* Info */}
        <div className="col-span-4 space-y-6">
          {/* Title */}
        <h2 className="text-4xl font-extrabold truncate max-w-[70%] drop-shadow-lg">
          {podcast.podcastName}
        </h2>
          <p className="text-lg text-gray-300">{podcast.podcastDescription}</p>
          <p className="text-md text-gray-400">
            Created by <span className="font-semibold text-white">{podcast.creator.firstName} {podcast.creator.lastName}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {podcast.categories.length > 0 ? (
              podcast.categories.map(category => (
                <span
                  key={category._id}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-xs px-4 py-1 font-medium shadow-sm"
                >
                  {category.categoryName}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No categories available</p>
            )}
          </div>
        </div>

        {/* Favorite Button */}
        {isRegularUser && (
          <div className="col-span-1 content-center">
            <FavoriteButton
              podcastId={podcast._id}
              isFavorite={isFavorite}
              onFavoriteClick={handleFavoriteClick}
              buttonSize=""
              iconSize={50}
            />
          </div>
        )}
      </div>

      {/* ── Episodes Section ── */}
      <div className="bg-black/60 p-6 mt-10 rounded-2xl shadow-xl backdrop-blur-md border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-white">All Episodes</h3>

          {(isCreator || isAdmin) && (
            <button
              onClick={() => setOpenCreateEpisode(true)}
              className="flex items-center space-x-2 text-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
            >
              <PlusCircle size={18} />
              <span>Add Episode</span>
            </button>
          )}
        </div>

        <hr className="mb-4 border-gray-700" />

        <div className="pr-2">
          {podcast.episodes.length > 0 ? (
            podcast.episodes.map(ep => (
              <EpisodeCard key={ep._id} episode={ep} podcast={podcast} />
            ))
          ) : (
            <p className="text-gray-400">No episodes available</p>
          )}
        </div>
      </div>


        {/* ── Pop‑ups ── */}
        <CreateEpisodePopup
          isOpen={openCreateEpisode}
          onClose={() => setOpenCreateEpisode(false)}
          podcastId={podcast._id}
          creatorId={podcast.creator._id}
          podcastImage={podcast.podcastImage}
        />

        <EditPodcastPopup
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          podcast={podcast}
          onUpdated={updated => setPodcast(updated)}
        />

        <DeletePodcastPopup
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          podcastId={podcast._id}
          onDeleted={() => router.push("/")}
        />
      </div>
    </div>
  );
}
