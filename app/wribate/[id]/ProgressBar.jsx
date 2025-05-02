import { useState, useEffect } from "react";
import { formatUTCDate } from "../../utils/dateFormat";
import { getEventStatus } from "../../utils/dateFormat";

const ProgressBar = ({ rounds }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes

      // Get the current IST time
      const now = new Date().getTime() + IST_OFFSET;

      // Convert round start and end times to IST
      const startTime = new Date(
        new Date(rounds[0].startDate).getTime()
      ).getTime();
      const endTime = new Date(new Date(rounds[2].endDate).getTime()).getTime();

      // Check if dates are valid
      if (isNaN(startTime) || isNaN(endTime)) {
        console.error("Invalid timestamps detected!", { startTime, endTime });
        return;
      }

      const totalDuration = endTime - startTime;

      if (now < startTime) {
        setProgress(0); // Before Round 1 starts
      } else if (now > endTime) {
        setProgress(100); // After Round 3 ends
      } else {
        const progressPercentage = ((now - startTime) / totalDuration) * 100;
        setProgress(progressPercentage);
      }
    };

    updateProgress(); // Initial calculation
  }, [rounds]);

  // Calculate marker positions
  const startTime = new Date(rounds[0].startDate).getTime();
  const endTime = new Date(rounds[2].endDate).getTime();
  const roundPositions = rounds.map((round) => {
    return (
      ((new Date(round.startDate).getTime() - startTime) /
        (endTime - startTime)) *
      100
    );
  });

  return (
    <div className="w-full px-4 md:mt-4 mt-2 py-4 rounded-lg border border-gray-200 mx-auto bg-white">
      <p className="mb-2 text-gray-700 text-lg md:text-xl  font-bold">
        Progress
      </p>
      <p>{getEventStatus(rounds[0]?.startDate, rounds[2]?.endDate)}</p>
      <div className="relative w-full bg-gray-300 h-4 rounded-full">
        {/* Progress Bar */}
        <div
          className="h-4 bg-indigo-800 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>

        {/* Markers for round transitions */}
        {roundPositions.slice(1).map((pos, index) => (
          <div
            key={index}
            className="absolute h-6 w-[2px] bg-black top-[-2px]"
            style={{ left: `${pos}%` }}
          ></div>
        ))}
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-2 text-gray-600 text-xs">
        {rounds.map((round, index) => (
          <span key={index}>{formatUTCDate(round.startDate)}</span>
        ))}
        <span>{formatUTCDate(rounds[2].endDate)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
