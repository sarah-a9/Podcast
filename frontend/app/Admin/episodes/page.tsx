// src/app/admin/episodes/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/Providers/AuthContext/AuthContext";
import DeleteEpisodePopUp from "@/app/components/PopUps/DeleteEpisodePopUp";

interface Episode {
  _id: string;
  episodeTitle: string;
  episodeDescription: string;
  status: string;
  podcast: {
    _id: string;
    podcastName: string;
    podcastImage: string;
    creator: {
      _id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export default function EpisodeListPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "reported" | "archived">("all");

  // NEW: track which episode is pending deletion
  const [deleteEpisodeId, setDeleteEpisodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 0) {
      setEpisodes([]);
      setLoading(false);
      return;
    }
    fetchEpisodes();
  }, [user]);

  const fetchEpisodes = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/episode", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setEpisodes(data);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (episodeId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:3000/episode/${episodeId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "archived" }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt);
      }
      fetchEpisodes();
    } catch (err) {
      console.error(err);
      alert("Could not archive episode.");
    }
  };

  if (loading) {
    return <p className="text-white p-6">Loading episodes…</p>;
  }

  if (!user || user.role !== 0) {
    return (
      <p className="text-red-400 p-6">
        You must be an admin to view this page.
      </p>
    );
  }

  // Filter according to current “filter” state
  const filtered = episodes.filter((ep) => {
    if (filter === "all") return true;
    return ep.status === filter;
  });

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-6">
      
      <h1 className="text-3xl font-bold mb-6">All Episodes</h1>

      {/* ── Status Filter Buttons ── */}
      <div className="flex gap-2 mb-6">
        {(["all", "published", "reported", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 rounded-lg transition
              ${filter === f
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"}
            `}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p>No episodes match “{filter}.”</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((episode) => (
            <div
              key={episode._id}
              onClick={() =>
                router.push(
                  `/PodcastDetail/${episode.podcast._id}/EpisodeDetail/${episode._id}`
                )
              }
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-200 flex justify-between items-start cursor-pointer"
            >
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-semibold">
                  {episode.episodeTitle}{" "}
                  {episode.status === "reported" && (
                    <span
                      className="
                        ml-2 inline-block text-xs font-semibold text-white 
                        bg-gradient-to-r from-red-800 to-red-500 
                        px-2 py-0.5 rounded-lg
                      "
                    >
                      Reported
                    </span>
                  )}
                  {episode.status === "archived" && (
                    <span
                      className="
                        ml-2 inline-block text-xs font-semibold text-white 
                        bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400 
                        px-2 py-0.5 rounded-lg
                      "
                    >
                      Archived
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-400">
                  Podcast:{" "}
                  {episode.podcast
                    ? episode.podcast.podcastName
                    : "Unknown Podcast"}
                </p>
                <p className="text-sm text-gray-400">
                  Creator:{" "}
                  {episode.podcast
                    ? `${episode.podcast.creator.firstName} ${episode.podcast.creator.lastName}`
                    : "Unknown Creator"}
                </p>
                <p className="text-sm text-gray-300 line-clamp-2 mt-1">
                  {episode.episodeDescription}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {/* ── Archive Button (only for “reported”) ── */}
                {episode.status === "reported" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(episode._id);
                    }}
                    className="text-sm bg-red-950 hover:bg-red-700 px-4 py-4 rounded-lg shadow"
                  >
                    Archive
                  </button>
                )}

                {/* ── NEW: Delete button (only for “archived”) ── */}
                {episode.status === "archived" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteEpisodeId(episode._id);
                    }}
                    className="text-sm bg-red-800 hover:bg-red-900 px-4 py-4 rounded-lg shadow"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DeleteEpisodePopUp (only rendered if deleteEpisodeId is non‐null) ── */}
      {deleteEpisodeId && (
        <DeleteEpisodePopUp
          isOpen={Boolean(deleteEpisodeId)}
          onClose={() => setDeleteEpisodeId(null)}
          episodeId={deleteEpisodeId}
          onDeleted={() => {
            setDeleteEpisodeId(null);
            fetchEpisodes();
          }}
        />
      )}
    </div>
  );
}
