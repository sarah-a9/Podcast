import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";

const NextPreviousButton = ({ onPrevClick, onNextClick }: { onPrevClick: () => void, onNextClick: () => void }) => {
  return (
    <div className="flex space-x-4">
      <button onClick={onPrevClick}  className="text-white hover:text-gray-400">
        <RxTrackPrevious size={22} />
      </button>
      <button onClick={onNextClick} className="text-white hover:text-gray-400">
        <RxTrackNext size={22}/>
      </button>
    </div>
  );
};

export default NextPreviousButton;
