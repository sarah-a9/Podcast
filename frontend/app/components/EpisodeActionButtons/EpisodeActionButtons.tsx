// import { IoPlayOutline, IoPauseOutline } from "react-icons/io5";
// import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
// import { MdMoreHoriz } from "react-icons/md";
// import { useState } from "react";
// import { useAudio } from "../Providers/AudioProvider";


// const ActionButtons = ({
//   episode,
//   isLiked,
//   onLikeClick,
//   size = "md",
// }: {
//   episode: {
//     _id: string;
//     episodeTitle: string;
//     audioUrl: string;
//     episodeDescription:string; 
//     createdAt:string;
//   };
//   isLiked: boolean;
//   onLikeClick: (e: React.MouseEvent) => void;
//   size?: "md" | "lg";
// }) => {
//   const [showMenu, setShowMenu] = useState(false);
//   const { currentEpisode, isPlaying, playEpisode, togglePlayPause } = useAudio();

//   const handleMenuClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setShowMenu(!showMenu);
//   };

//   const handleLikeClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     onLikeClick(e);
//   };

//   const handlePlayClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (currentEpisode?._id === episode._id) {
//       togglePlayPause();
//     } else {
//       playEpisode(episode);
//     }
//   };



//   // Define size variations
//   const buttonSize = size === "lg" ? "text-4xl p-4" : "text-xl p-2";
//   const iconSize = size === "lg" ? 40 : 24;

//   return (
//     <div className="flex items-center space-x-10">
//       {/* Play Button */}
//       <button
//         className={`text-white cursor-pointer rounded-full hover:bg-gray-500 ${buttonSize}`}
//         onClick={handlePlayClick}
//       >
//         {currentEpisode?._id === episode._id && isPlaying ? (
//           <IoPauseOutline size={iconSize} />
//         ) : (
//           <IoPlayOutline size={iconSize} />
//         )}
//       </button>

//       {/* Like Button */}
//       <button
//         className={`text-gray-400 hover:text-red-500 ${isLiked ? "text-red-500" : ""} ${buttonSize}`}
//         onClick={handleLikeClick}
//       >
//         {isLiked ? <IoMdHeart size={iconSize} /> : <IoMdHeartEmpty size={iconSize} />}
//       </button>

//       {/* Menu Button */}
//       <button
//         className={`text-gray-400 hover:text-white relative ${buttonSize}`}
//         onClick={handleMenuClick}
//       >
//         <MdMoreHoriz size={iconSize} />
//       </button>

//       {/* Menu Options */}
//       {showMenu && (
//         <div className="absolute bg-gray-800 text-white rounded-lg shadow-md p-2 mt-2 w-36">
//           <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">Add to Playlist</p>
//           <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">Download</p>
//           <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">Share</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ActionButtons;



import { useState } from "react";
import PlayPauseButton from "../PlayPauseButton/PlayPauseButton";
import LikeButton from "../LikeButton/LikeButton";
import MenuButton from "../MenuButton/MenuButton";
import { Episode , Podcast } from "@/app/Types";

const ActionButtons = ({
  episode,
  podcast, // ✅ Ensure podcast is passed to PlayPauseButton
  isLiked,
  onLikeClick,
  size = "md",
}: {
  episode:Episode;
  // episode: {
  //   _id: string;
  //   episodeTitle: string;
  //   audioUrl: string;
  //   episodeDescription: string;
  //   createdAt: string;
  //   podcast: Podcast;
  // };
  podcast:Podcast;
  //  {
  //   _id: string;
  //   podcastName: string;
  //   podcastImage: string;
  //   episodes: Episode[]; // Define the podcast structure
  // };
  isLiked: boolean;
  onLikeClick: (e: React.MouseEvent) => void;
  size?: "md" | "lg";
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const buttonSize = size === "lg" ? "text-4xl p-4" : "text-xl p-2";
  const iconSize = size === "lg" ? 40 : 24;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeClick(e);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div className="flex items-center space-x-10">
      {/* Play/Pause Button */}
      <PlayPauseButton 
        episode={episode} 
        podcast={podcast} // ✅ Pass podcast to PlayPauseButton
        buttonSize={buttonSize} 
        iconSize={iconSize} 
      />

      {/* Like Button */}
      <LikeButton 
        isLiked={isLiked} 
        onLikeClick={handleLikeClick} 
        buttonSize={buttonSize} 
        iconSize={iconSize} 
      />

      {/* Menu Button */}
      <MenuButton 
        showMenu={showMenu} 
        setShowMenu={handleMenuClick} 
        buttonSize={buttonSize} 
        iconSize={iconSize} 
      />

      {/* Menu Options */}
      {showMenu && (
        <div className="absolute bg-gray-800 text-white rounded-lg shadow-md p-2 mt-2 w-36">
          <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">Add to Playlist</p>
          <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">Download</p>
          <p className="cursor-pointer p-2 hover:bg-gray-700 rounded-md">Share</p>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
