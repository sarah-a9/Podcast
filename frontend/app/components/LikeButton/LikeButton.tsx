import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const LikeButton = ({ isLiked, onLikeClick, buttonSize, iconSize }: { isLiked: boolean, onLikeClick: (e: React.MouseEvent) => void , buttonSize: string, iconSize: number }) => {
  return (
    <button className={`text-gray-400 hover:text-red-500 ${isLiked ? "text-red-500" : ""} ${buttonSize}`} onClick={onLikeClick}>
      {isLiked ? <IoMdHeart size={iconSize}/> : <IoMdHeartEmpty size={iconSize}/>}
    </button>
  );
};

export default LikeButton;
