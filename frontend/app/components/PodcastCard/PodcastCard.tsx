

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface PodcastProps {
  id: string;
  podcastName: string;
  podcastImage: string;
  podcastDescription: string;
  creator: {
    firstName: string;
    lastName: string;
  };
}

const PodcastCard: React.FC<PodcastProps> = ({
  podcastName,
  creator,
  podcastImage,
  id,
  podcastDescription,
}: PodcastProps) => {
  const router = useRouter();
  const handleViews = () => {
    //increase views
    console.log("Received podcast ID:", id);

    router.push(`/PodcastDetail/${id}`);
  };

  return (
    // flex-shrink-0 flex-flex-col w-1/7
    <div
      className="w-40 flex-shrink-0 flex flex-col shadow-sm cursor-pointer hover:scale-95 transform-origin transition-all duration-200 "
      onClick={handleViews}
    >
      <div className="flex flex-col">
        <img
          className="rounded-lg w-full h-40 object-cover bg-gray-300"
          src={podcastImage}
          alt={podcastName}
        />
        <p className="truncate text-l">{podcastName}</p>
        <div>
          <p className="w-full truncate mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">
            {podcastDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;
