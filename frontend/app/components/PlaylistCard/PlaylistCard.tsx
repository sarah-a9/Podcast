"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Playlist } from "@/app/Types";


const PlaylistCard: React.FC<Playlist> = ({
  _id,
  playlistName,
  playlistImg,
  episodes,
}) => {
  const router = useRouter();

  return (
    <div
      className="bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer p-3"
      onClick={() => router.push(`../PlaylistDetailPage/${_id}`)}
    >
      <div className="w-full h-40 rounded-xl overflow-hidden mb-2">
  <Image
    src={`http://localhost:3000/uploads/playlists/${playlistImg}`}
    alt="playlist image"
    width={400} // you can adjust this
    height={160} // matches h-40 (40 * 4 = 160px)
    className="object-cover w-full h-full rounded-xl"
  />
</div>

      <h3 className="font-semibold text-lg truncate text-gray-400">{playlistName}</h3>
      <p className="text-sm text-gray-500">{episodes.length} Episodes</p>
    </div>
  );
};

export default PlaylistCard;
