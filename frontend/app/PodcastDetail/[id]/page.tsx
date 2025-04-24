'use client';

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineAccessTime } from "react-icons/md";
import { MoreHorizontal, MoreVertical, PlusCircle } from "lucide-react";
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

  const [podcast, setPodcast] = useState<{
    creator: any;
    _id: string;
    podcastName: string;
    podcastDescription: string;
    podcastImage: string;
    episodes: Episode[];
    favoritedByUsers: string[];
    categories: any[];
  } | null>(null);

  const [open, setOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch podcast
  useEffect(() => {
    fetch(`http://localhost:3000/podcast/${podcastId}`)
      .then((res) => res.json())
      .then((data) => {
        setPodcast(data);
        console.log( "podcast categories", podcast);
        if (user) {
          const favs = Array.isArray(user.favoritePodcasts)
            ? user.favoritePodcasts
            : [];
          setIsFavorite(favs.includes(data._id));
        }
      })
      .catch(console.error);
  }, [podcastId, user]);

  

  // Close menu on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !podcast) return;
    const updated = isFavorite
      ? user.favoritePodcasts.filter((x: string) => x !== podcast._id)
      : [...user.favoritePodcasts, podcast._id];
    setUser({ ...user, favoritePodcasts: updated });
    setIsFavorite(!isFavorite);
  };

  const isCreator = user?._id === podcast?.creator._id;

  if (!podcast) {
    return <p className="text-gray-400">Loading…</p>;
  }

  return (
    <div className="h-screen text-white rounded-lg scrollable-container scrollbar-hide">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full flex flex-col">

        {/* Top bar: title + menu */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">{podcast.podcastName}</h2>

          {isCreator && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded hover:bg-gray-700"
              >
                <MoreHorizontal size={24} />
              </button>
              {showMenu && (
                <ul className="absolute right-0 mt-1 bg-gray-700 rounded shadow-lg z-10">
                  <li
                    onClick={() => {
                      setShowEdit(true);
                      setShowMenu(false);
                    }}
                    className="px-15 py-1 hover:bg-gray-600 cursor-pointer"
                  >
                    Edit Podcast
                  </li>
                  <li
                    onClick={() => {
                      setShowDelete(true);
                      setShowMenu(false);
                    }}
                    className="px-15 py-1 hover:bg-gray-600 cursor-pointer"
                  >
                    Delete Podcast
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-1">
            <img
              className="rounded-lg"
              src={podcast.podcastImage}
              alt={podcast.podcastName}
            />
          </div>

          <div className="col-span-4">
            <p className="text-sm text-gray-400 mb-2">
              Created by {podcast.creator.firstName}{" "}
              {podcast.creator.lastName}
            </p>

            <div className="flex gap-2 flex-wrap mb-4">
              {podcast.categories.length > 0 ? (
                podcast.categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="rounded-full shadow-md flex items-center justify-center border border-white text-white text-xs bg-transparent px-3 py-1"
                  >
                    {cat.categoryName}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No categories available</p>
              )}
            </div>

            <p className="text-lg italic">{podcast.podcastDescription}</p>
          </div>

          <div className="col-span-1 flex items-start justify-end">
            <FavoriteButton
              podcastId={podcast._id}
              isFavorite={isFavorite}
              onFavoriteClick={handleFavoriteClick}
              buttonSize=""
              iconSize={50}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <h3 className="font-bold text-xl">All Episodes</h3>
          {isCreator && (
            <button
              onClick={() => setOpen(true)}
              className="flex items-center space-x-2 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
            >
              <PlusCircle size={18} />
              <span>Add Episode</span>
            </button>
          )}
        </div>

        <hr className="my-4 border-gray-600" />

        <div className="space-y-4">
          {podcast.episodes.length > 0 ? (
            podcast.episodes.map((ep) => (
              <EpisodeCard
                key={ep._id}
                episode={ep}
                podcast={podcast}
              />
            ))
          ) : (
            <p className="text-gray-500">No episodes available</p>
          )}
        </div>

        {/* Popups */}
        <CreateEpisodePopup
          isOpen={open}
          onClose={() => setOpen(false)}
          podcastId={podcast._id}
          creatorId={podcast.creator._id}
          podcastImage={podcast.podcastImage}
        />

        <EditPodcastPopup
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          podcast={podcast}
          onUpdated={(upd) => setPodcast(upd)}
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
