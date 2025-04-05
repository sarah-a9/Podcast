import { FiVolume, FiVolume1, FiVolume2, FiVolumeX } from "react-icons/fi";

const VolumeControl = ({ volume, onVolumeChange }: { volume: number, onVolumeChange: (volume: number) => void }) => {
  return (
    <div className="flex items-center space-x-2">
      <button>
        {volume >= 0.75 ? (
          <FiVolume2 size={24} className="text-white" />
        ) : volume >= 0.5 ? (
          <FiVolume1 size={24} className="text-white" />
        ) : volume > 0 ? (
          <FiVolume size={24} className="text-white" />
        ) : (
          <FiVolumeX size={24} className="text-white" />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-24"
      />
    </div>
  );
};

export default VolumeControl;
