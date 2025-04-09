import { RxTrackNext } from "react-icons/rx";

const NextButton = ({ onNextClick, disabled = false }: { onNextClick: () => void; disabled?:boolean}) => {
  return (
    <button onClick={onNextClick} disabled={disabled} className="text-white cursor-pointer  hover:text-gray-400">
      <RxTrackNext size={22} />
    </button>
  );
};
 export default NextButton;