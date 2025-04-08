const ProgressBar = ({
  currentTime,
  duration,
  onProgressChange
}: {
  currentTime: number;
  duration: number;
  onProgressChange: (time: number) => void;

  
}) => {
   console.log("current time progress bar ",currentTime );
   console.log("duration progress bar ",duration );
  return (
    <div className="w-full  mx-4">
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={(e) => onProgressChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
};

export default ProgressBar;
