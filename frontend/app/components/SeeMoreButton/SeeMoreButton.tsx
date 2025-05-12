import { SeeMoreButtonProps } from "@/app/Types";

const SeeMoreButton: React.FC<SeeMoreButtonProps> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="mt-1 text-sm text-purple-600 hover:text-blue-500 transition duration-200 cursor-pointer pr-6"
  >
    {label}
    <svg
      className="inline-block w-3.5 h-3.5 ml-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

export default SeeMoreButton;
