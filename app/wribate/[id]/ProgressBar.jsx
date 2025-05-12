import { useState, useEffect } from "react";
import { formatUTCDate, getEventStatus } from "../../utils/dateFormat";

const ProgressBar = ({ rounds }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes
      
      // Get the current IST time
      const now = new Date().getTime() + IST_OFFSET;
      
      // Convert round start and end times to IST
      const startTime = new Date(rounds[0].startDate).getTime();
      const endTime = new Date(rounds[2].endDate).getTime();
      
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
    
    // Update progress every minute
    const intervalId = setInterval(updateProgress, 60000);
    return () => clearInterval(intervalId);
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

  // Format date to 12-hour format
  const format12HourTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      <div className="w-full p-4 rounded-lg shadow-sm border border-gray-200 bg-white">
        {/* Status indicator */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-700">
            {getEventStatus(rounds[0]?.startDate, rounds[2]?.endDate)}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="relative w-full bg-gray-200 h-2 rounded-full mb-6">
          {/* Progress fill */}
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
          
          {/* Round markers */}
          {roundPositions.map((pos, index) => (
            <div
              key={`marker-${index}`}
              className="absolute h-4 w-0.5 bg-gray-400 top-1/2 transform -translate-y-1/2"
              style={{ left: `${pos}%` }}
            ></div>
          ))}
          
          {/* Round labels */}
          {rounds.map((_, index) => (
            <div 
              key={`label-${index}`}
              className="absolute text-xs font-medium text-gray-600 mt-3 transform -translate-x-1/2"
              style={{ 
                left: `${roundPositions[index]}%`,
                top: '100%'
              }}
            >
              R{index + 1}
            </div>
          ))}
        </div>
        
        {/* Time labels - Using flex layout to keep everything in container */}
        <div className="w-full px-1">
          <div className="flex justify-between mt-6">
            {/* First time label - aligned left */}
            <div className="text-xs text-gray-600 text-left" style={{ width: '25%' }}>
              {format12HourTime(rounds[0].startDate)}
            </div>
            
            {/* Middle time labels - centered */}
            <div className="text-xs text-gray-600 text-center" style={{ width: '25%' }}>
              {format12HourTime(rounds[1].startDate)}
            </div>
            
            <div className="text-xs text-gray-600 text-center" style={{ width: '25%' }}>
              {format12HourTime(rounds[2].startDate)}
            </div>
            
            {/* End time label - aligned right */}
            <div className="text-xs text-gray-600 text-right" style={{ width: '25%' }}>
              {format12HourTime(rounds[2].endDate)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;