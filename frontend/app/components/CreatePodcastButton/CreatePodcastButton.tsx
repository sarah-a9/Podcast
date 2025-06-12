// app/components/CreatePodcastButton.tsx
'use client';

import { useState } from "react";
import { PlusCircle } from "lucide-react"; // or use a similar icon
import CreatePodcastPopup from "../PopUps/CreatePodcastPopUp";
import CreatePodcastPopUp from "../PopUps/CreatePodcastPopUp";

export default function CreatePodcastButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center my-10">
      <button
        onClick={() => setOpen(true)}
        className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-xl font-bold px-8 py-4 rounded-full  shadow-xl hover:scale-105 transition-transform duration-300"
      >
        <PlusCircle className="mr-2 inline-block" size={24} />
        Create Your Own Podcast
      </button>

      <CreatePodcastPopUp isOpen={open} onClose={() => setOpen(false)} isAdmin={false} />
    </div>
  );
}
