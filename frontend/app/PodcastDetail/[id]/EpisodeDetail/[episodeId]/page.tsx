// src/app/[your-path]/EpisodeDetail.tsx
"use client";

import React, { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdOutlineAccessTime } from "react-icons/md";
import ActionButtons from "@/app/components/EpisodeActionButtons/EpisodeActionButtons";
import StarRating from "@/app/components/StarRating/StarRating";
import { useAuth } from "@/app/components/Providers/AuthContext/AuthContext";
import EditEpisodePopUp from "@/app/components/PopUps/EditEpisodePopUp";
import DeleteEpisodePopUp from "@/app/components/PopUps/DeleteEpisodePopUp";

const EpisodeDetail = ({ params }: { params: Promise<{ id: string; episodeId: string }> }) => {
  const { id, episodeId } = use(params);
  const [episode, setEpisode] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const { user, setUser, token } = useAuth();
  const router = useRouter();

  // ───‐ showMenu is now passed down to ActionButtons ───
  const [showMenu, setShowMenu] = useState(false);

  // ─── Popup states ───
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ─── Fetch episode details ───
  const fetchEpisode = async () => {
    try {
      const res = await fetch(`http://localhost:3000/podcast/${id}/episode/${episodeId}`);
      const data = await res.json();
      setEpisode(data);
    } catch (error) {
      console.error("Error fetching episode:", error);
    }
  };

  const fetchUserRating = async () => {
    if (user) {
      try {
        const res = await fetch(`http://localhost:3000/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const episodeRating = data.ratings.find(
          (r: any) => String(r.episode) === String(episodeId)
        );
        const rounded = episodeRating ? Math.round(episodeRating.value) : 0;
        setUserRating(rounded);
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    }
  };

  useEffect(() => {
    fetchEpisode();
  }, [id, episodeId]);

  useEffect(() => {
    if (user && episode) {
      setLiked(user.likedEpisodes.includes(episode._id));
      fetchUserRating();
    }
  }, [user, episode]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user && episode) {
      const updated = liked
        ? user.likedEpisodes.filter((eid) => eid !== episode._id)
        : [...user.likedEpisodes, episode._id];
      setUser({ ...user, likedEpisodes: updated });
    }
    setLiked(!liked);
  };

  const handleOnClick = () => {
    router.push(`/PodcastDetail/${episode?.podcast._id}`);
  };

  const handleRating = (newAvg: number) => {
    fetchEpisode();
  };

  return (
    <div className="scrollable-container scrollbar-hide h-screen text-white rounded-lg">
      <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-lg shadow-xl w-full flex flex-col">
        {episode ? (
          <>
            {/* ── Header Section ── */}
            <div className="grid grid-cols-6 gap-8 items-center mb-10">
              <div className="col-span-1">
                <img
                  className="rounded-xl shadow-lg w-full"
                  src={`http://localhost:3000/uploads/podcasts/${episode.podcast.podcastImage}`}
                  alt={episode.podcast.podcastName}
                />
              </div>
              <div className="col-span-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-extrabold mt-2 mb-6">
                      {episode.episodeTitle}
                    </h1>
                    <div className="space-y-1">
                      <Link
                        href={`/PodcastDetail/${episode.podcast._id}`}
                        className="text-xl text-purple-500 hover:underline"
                      >
                        {episode.podcast.podcastName}
                      </Link>
                      <p className="text-md text-gray-400">
                        Created by{" "}
                        {episode.podcast.creator.firstName}{" "}
                        {episode.podcast.creator.lastName}
                      </p>
                    </div>
                  </div>
                  {/* Rating */}
                  <div className="mt-4">
                    <StarRating
                      value={userRating}
                      maxStars={5}
                      onRate={handleRating}
                      isEditable={!!user}
                      episodeId={episode._id}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="my-6 border-t border-gray-700" />

            {/* ── Action Section ── */}
            <div className="flex items-center justify-between gap-4 mt-4">
              {/* Duration */}
              <div className="flex items-center gap-2 text-gray-300">
                <MdOutlineAccessTime size={20} />
                <span className="text-md">
                  {episode?.duration ? `${episode.duration} min` : "Unknown duration"}
                </span>
              </div>

              {/* ActionButtons now handles the menu */}
              <ActionButtons
                episode={episode}
                podcast={episode.podcast}
                isLiked={liked}
                onLikeClick={handleLikeClick}
                size="lg"
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                onEdit={() => setShowEditPopup(true)}
                onDelete={() => setShowDeleteConfirm(true)}
              />
            </div>

            {/* ── Description ── */}
            <div className="mt-10 bg-[#121212] p-6 rounded-xl shadow-inner">
              <p className="text-2xl font-semibold mb-4">Episode Description</p>
              <p className="text-md text-gray-300 leading-relaxed whitespace-pre-line">
                {episode.episodeDescription}
              </p>
            </div>

            {/* ── Bottom Button ── */}
            <div className="mt-12 flex justify-end">
              <button
                className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
                onClick={handleOnClick}
              >
                See Episodes
              </button>
            </div>
          </>
        ) : (
          <p className="text-xl text-gray-400">Episode not found.</p>
        )}

        {/* ── Edit Episode Popup ── */}
        {showEditPopup && (
          <EditEpisodePopUp
            isOpen={showEditPopup}
            onClose={() => setShowEditPopup(false)}
            episode={episode}
            podcastId={episode.podcast._id}
            creatorId={episode.podcast.creator._id}
          />
        )}

        {/* ── Delete Confirmation Popup ── */}
        {showDeleteConfirm && (
          <DeleteEpisodePopUp
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            episodeId={episode._id}
            onDeleted={() => {
              setShowDeleteConfirm(false);
              router.push(`/PodcastDetail/${id}`);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EpisodeDetail;
