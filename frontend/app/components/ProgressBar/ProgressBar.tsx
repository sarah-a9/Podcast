const ProgressBar = ({
  currentTime,
  duration,
  onProgressChange,
}: {
  currentTime: number;
  duration: number;
  onProgressChange: (time: number) => void;
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const timeLeft = duration - currentTime;

  return (
    <div className="w-full flex items-center space-x-2">
      {/* Current time on the left */}
      <span className="text-sm text-white w-10 text-right">
        {formatTime(currentTime)}
      </span>

      {/* Progress Bar */}
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={(e) => onProgressChange(parseFloat(e.target.value))}
        className="w-full h-1 appearance-none rounded-lg cursor-pointer  bg-gray-300 focus:outline-none"
        style={{
          background: `linear-gradient(to right, #FFFFFF ${
            (currentTime / duration) * 100
          }%, #535353 0%)`,
        }}
      />

      {/* Time left on the right */}
      <span className="text-sm text-white w-10 text-left">
        -{formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default ProgressBar;
