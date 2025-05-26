// 'use client';

import { useState, useEffect } from "react";

const ProgressBar = ({ rounds }) => {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get event status function
  const getEventStatus = (startDate, endDate) => {
    const now = Date.now();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < start) {
      return "Upcoming Event";
    } else if (now >= start && now <= end) {
      return "Event Live";
    } else {
      return "Event Concluded";
    }
  };

  // Get status color based on event status
  const getStatusColor = () => {
    const status = getEventStatus(rounds[0]?.startDate, rounds[2]?.endDate);
    switch (status) {
      case "Upcoming Event":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "Event Live":
        return "text-green-600 bg-green-50 border-green-200";
      case "Event Concluded":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  useEffect(() => {
    const updateProgress = () => {
      const now = Date.now();
      const startTime = new Date(rounds[0].startDate).getTime();
      const endTime = new Date(rounds[2].endDate).getTime();

      if (isNaN(startTime) || isNaN(endTime)) {
        console.error("Invalid timestamps detected!");
        return;
      }

      const totalDuration = endTime - startTime;

      if (now < startTime) {
        setProgress(0);
      } else if (now > endTime) {
        setProgress(100);
      } else {
        const elapsed = now - startTime;
        const progressPercentage = (elapsed / totalDuration) * 100;
        setProgress(Math.min(100, Math.max(0, progressPercentage)));
      }
    };

    updateProgress();
    const intervalId = setInterval(updateProgress, 60000);
    return () => clearInterval(intervalId);
  }, [rounds]);

  // Calculate marker positions
  const startTime = new Date(rounds[0].startDate).getTime();
  const endTime = new Date(rounds[2].endDate).getTime();
  const totalDuration = endTime - startTime;
  
  const roundPositions = rounds.map((round) => {
    const roundTime = new Date(round.startDate).getTime();
    const elapsed = roundTime - startTime;
    const position = (elapsed / totalDuration) * 100;
    return Math.min(100, Math.max(0, position));
  });

  // Calculate midpoints for round labels
  const midPoints = [
    roundPositions[0] / 2,
    (roundPositions[0] + roundPositions[1]) / 2,
    (roundPositions[1] + roundPositions[2]) / 2,
    (roundPositions[2] + 100) / 2
  ];

  // Format date and time for local timezone
  const formatDateAndTime = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    };
    
    return {
      datePart: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timePart: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      fullDate: date.toLocaleString('en-US', options)
    };
  };

  const roundLabels = ["Opening", "Rebuttals", "Closing"];
  const roundFullLabels = ["Opening Remarks", "Rebuttals", "Closing Remarks"];

  if (isMobile) {
    return (
      <div className="w-full bg-white border border-gray-200 shadow-sm">
        {/* Mobile Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Event Timeline</h2>
            <div className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor()}`}>
              {getEventStatus(rounds[0]?.startDate, rounds[2]?.endDate)}
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="px-4 py-4">
          {/* Progress Bar */}
          <div className="relative w-full bg-gray-200 h-2 mb-4 rounded-full">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
            
            {/* Round Markers */}
            {roundPositions.map((pos, index) => (
              <div
                key={`marker-${index}`}
                className="absolute w-0.5 h-4 bg-blue-900 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${pos}%` }}
              />
            ))}
          </div>

          {/* Round Cards */}
          <div className="space-y-3">
            {rounds.map((round, index) => {
              const isActive = progress >= roundPositions[index] && (index === rounds.length - 1 || progress < roundPositions[index + 1]);
              const isCompleted = progress > roundPositions[index];
              
              return (
                <div
                  key={`round-${index}`}
                  className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                    isActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : isCompleted 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    R{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {roundFullLabels[index]}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDateAndTime(round.startDate).fullDate}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Event Duration */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <div className="text-xs text-gray-500">
              Event Duration: {formatDateAndTime(rounds[0].startDate).fullDate} - {formatDateAndTime(rounds[2].endDate).fullDate}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Event Timeline</h2>
          <div className={`px-3 py-1 text-sm font-medium rounded border ${getStatusColor()}`}>
            {getEventStatus(rounds[0]?.startDate, rounds[2]?.endDate)}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="px-6 py-6">
        {/* START/END Labels */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-blue-900">START</span>
          <span className="text-sm font-semibold text-blue-900">END</span>
        </div>

        {/* Round Labels */}
        <div className="relative mb-4 h-6">
          {roundFullLabels.map((label, index) => (
            <div
              key={`label-${index}`}
              className="absolute text-xs font-medium text-gray-600 transform -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${midPoints[index + 1]}%` }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 h-3 mb-6 rounded-full">
          {/* Progress Fill */}
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />

          {/* Round Markers */}
          {roundPositions.map((pos, index) => (
            <div
              key={`marker-${index}`}
              className="absolute w-1 h-6 bg-blue-900 top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded"
              style={{ left: `${pos}%` }}
            >
              {/* Round Number */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-6 bg-blue-900 text-white text-xs font-bold flex items-center justify-center rounded">
                  R{index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Date/Time Labels */}
        <div className="relative h-12">
          {/* Start Date */}
          <div className="absolute left-0 flex flex-col items-start">
            <div className="text-sm font-medium text-gray-700">
              {formatDateAndTime(rounds[0].startDate).datePart}
            </div>
            <div className="text-xs text-gray-500">
              {formatDateAndTime(rounds[0].startDate).timePart}
            </div>
          </div>

          {/* Round 2 Date (Center) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className="text-sm font-medium text-gray-700">
              {formatDateAndTime(rounds[1].startDate).datePart}
            </div>
            <div className="text-xs text-gray-500">
              {formatDateAndTime(rounds[1].startDate).timePart}
            </div>
          </div>

          {/* End Date */}
          <div className="absolute right-0 flex flex-col items-end">
            <div className="text-sm font-medium text-gray-700">
              {formatDateAndTime(rounds[2].endDate).datePart}
            </div>
            <div className="text-xs text-gray-500">
              {formatDateAndTime(rounds[2].endDate).timePart}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo with sample data
const App = ({rounds}) => {
  const sampleRounds = [
    {
      startDate: "2025-05-26T14:00:00.000Z",
      endDate: "2025-05-26T14:30:00.000Z"
    },
    {
      startDate: "2025-05-26T15:00:00.000Z",
      endDate: "2025-05-26T15:30:00.000Z"
    },
    {
      startDate: "2025-05-26T16:00:00.000Z",
      endDate: "2025-05-26T16:30:00.000Z"
    }
  ];

  return (
    <div className=" bg-gray-100">
      <div className="w-full">
        <ProgressBar rounds={rounds} />
      </div>
    </div>
  );
};

export default App;