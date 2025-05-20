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

  // Calculate midpoints between markers for round labels
  const midPoints = [
    (0 + roundPositions[0]) / 2, // Between START and R1
    (roundPositions[0] + roundPositions[1]) / 2, // Between R1 and R2
    (roundPositions[1] + roundPositions[2]) / 2, // Between R2 and R3
    (roundPositions[2] + 100) / 2  // Between R3 and END
  ];

  // Format date and time separately
  const formatDateAndTime = (dateString) => {
    const date = new Date(dateString);
    
    // Format date part (May 14)
    const datePart = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    // Format time part (12:00 AM)
    const timePart = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return { datePart, timePart };
  };

  return (
    <>
      <div className="w-full p-6 rounded-lg shadow-md border border-gray-300 bg-white">
        {/* Status indicator (removed duplicate heading) */}
        <div className="mb-6">
          <span className="text-base font-medium text-gray-700">
            {getEventStatus(rounds[0]?.startDate, rounds[2]?.endDate)}
          </span>
        </div>
        
        {/* START/END labels above timeline */}
        <div className="flex justify-between mb-2">
          <span className="font-bold text-lg text-blue-700">START</span>
          <span className="font-bold text-lg text-blue-700">END</span>
        </div>
        
        {/* Progress bar */}
        <div className="relative w-full bg-gray-200 h-4 rounded-full mb-8">
          {/* Progress fill */}
          <div
            className="h-4 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
          
          {/* Round markers */}
          {roundPositions.map((pos, index) => (
            <div
              key={`marker-${index}`}
              className="absolute h-8 w-2 bg-blue-800 top-1/2 transform -translate-y-1/2"
              style={{ left: `${pos}%` }}
            ></div>
          ))}
        </div>
        
        {/* Labels section with better spacing */}
        <div className="relative w-full" style={{ height: "110px" }}>
          {/* R1, R2, R3 labels */}
          <div className="absolute text-blue-800 font-semibold transform -translate-x-1/2" style={{ left: `${roundPositions[0]}%`, top: '0px' }}>R1</div>
          <div className="absolute text-blue-800 font-semibold transform -translate-x-1/2" style={{ left: `${roundPositions[1]}%`, top: '0px' }}>R2</div>
          <div className="absolute text-blue-800 font-semibold transform -translate-x-1/2" style={{ left: `${roundPositions[2]}%`, top: '0px' }}>R3</div>
          
          {/* Round 1, Round 2, Round 3 labels */}
          <div className="absolute text-gray-700 font-medium transform -translate-x-1/2" style={{ left: `${midPoints[1]}%`, top: '25px' }}>Round 1</div>
          <div className="absolute text-gray-700 font-medium transform -translate-x-1/2" style={{ left: `${midPoints[2]}%`, top: '25px' }}>Round 2</div>
          <div className="absolute text-gray-700 font-medium transform -translate-x-1/2" style={{ left: `${midPoints[3]}%`, top: '25px' }}>Round 3</div>
          
          {/* Date and time labels - moved up closer to R labels */}
          {/* First date label shifted right by adding 2% to its position */}
          <div className="absolute flex flex-col items-center transform -translate-x-1/2" 
               style={{ left: `${roundPositions[0] + 2}%`, top: '50px' }}>
            <div className="text-sm font-medium text-gray-600">{formatDateAndTime(rounds[0].startDate).datePart}</div>
            <div className="text-xs text-gray-500">{formatDateAndTime(rounds[0].startDate).timePart}</div>
          </div>
          
          <div className="absolute flex flex-col items-center transform -translate-x-1/2" style={{ left: `${roundPositions[1]}%`, top: '50px' }}>
            <div className="text-sm font-medium text-gray-600">{formatDateAndTime(rounds[1].startDate).datePart}</div>
            <div className="text-xs text-gray-500">{formatDateAndTime(rounds[1].startDate).timePart}</div>
          </div>
          
          <div className="absolute flex flex-col items-center transform -translate-x-1/2" style={{ left: `${roundPositions[2]}%`, top: '50px' }}>
            <div className="text-sm font-medium text-gray-600">{formatDateAndTime(rounds[2].startDate).datePart}</div>
            <div className="text-xs text-gray-500">{formatDateAndTime(rounds[2].startDate).timePart}</div>
          </div>
          
          {/* End date (far right) */}
          <div className="absolute flex flex-col items-center text-right" style={{ right: '0px', top: '50px' }}>
            <div className="text-sm font-medium text-gray-600">{formatDateAndTime(rounds[2].endDate).datePart}</div>
            <div className="text-xs text-gray-500">{formatDateAndTime(rounds[2].endDate).timePart}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
