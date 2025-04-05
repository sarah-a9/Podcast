import { RxTrackNext } from "react-icons/rx";

const NextButton = ({ onNextClick }: { onNextClick: () => void }) => {
  return (
    <button onClick={onNextClick} className="text-white hover:text-gray-400">
      <RxTrackNext size={22} />
    </button>
  );
};
 export default NextButton;