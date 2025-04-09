import { FiVolume, FiVolume1, FiVolume2, FiVolumeX } from "react-icons/fi";

const VolumeControl = ({
  volume,
  onVolumeChange,
}: {
  volume: number;
  onVolumeChange: (volume: number) => void;
}) => {
  return (
    <div className="flex items-center space-x-2 w-full justify-end">
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

      {/* Thin volume slider */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-24 h-1 appearance-none rounded-lg cursor-pointer  bg-gray-300 focus:outline-none"
        style={{
          background: `linear-gradient(to right, #FFFFFF ${volume * 100}%, #535353 0%)`,
        }}
      />
    </div>
  );
};

export default VolumeControl;
