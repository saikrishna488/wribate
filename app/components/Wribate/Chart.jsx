import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

export default function VotesChart({ data, title }) {
  // Define round colors - consistent across both components
  const roundColors = {
    round1: "#3B82F6", // Blue 500 for rounds 1-4
    round2: "#10B981", // Green 500 for rounds 5-8
    round3: "#8B5CF6", // Purple 500 for rounds 9-12
    after: "#F97316"   // Orange 500 for round 13
  };
  
  // Custom tick component for colored x-axis numbers
  const CustomAxisTick = (props) => {
    const { x, y, payload } = props;
    
    // Determine color based on tick value
    let tickColor;
    if (payload.value <= 4) {
      tickColor = roundColors.round1;
    } else if (payload.value <= 8) {
      tickColor = roundColors.round2;
    } else if (payload.value <= 12) {
      tickColor = roundColors.round3;
    } else {
      tickColor = roundColors.after;
    }
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill={tickColor}
          fontWeight="500"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Custom dot component to color dots based on round
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    
    // Determine color based on x value (roundNumber)
    let dotColor;
    const roundNumber = payload.roundNumber;
    
    if (roundNumber <= 4) {
      dotColor = roundColors.round1;
    } else if (roundNumber <= 8) {
      dotColor = roundColors.round2;
    } else if (roundNumber <= 12) {
      dotColor = roundColors.round3;
    } else {
      dotColor = roundColors.after;
    }
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        stroke={dotColor} 
        strokeWidth={2} 
        fill="white" 
      />
    );
  };

  return (
    <div className="w-full bg-white shadow-lg mb-4 rounded-lg flex flex-col justify-center items-center p-3 md:p-4">
      <h2 className="text-center text-base md:text-lg font-bold mb-2 md:mb-4">
        {title}
      </h2>
      <div className="w-full h-64 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 35 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="roundNumber"
              tick={<CustomAxisTick />}
              label={{
                value: "Round",
                position: "insideBottomRight",
                offset: -5,
                fontSize: 12,
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              width={30}
              label={{
                value: "Votes",
                angle: -90,
                position: "insideLeft",
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{ fontSize: 12 }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconSize={10}
              wrapperStyle={{ fontSize: 12 }}
            />

            {/* Round background areas */}
            <ReferenceArea x1={1} x2={4.5} fill={roundColors.round1} fillOpacity={0.05} />
            <ReferenceArea x1={4.5} x2={8.5} fill={roundColors.round2} fillOpacity={0.05} />
            <ReferenceArea x1={8.5} x2={12.5} fill={roundColors.round3} fillOpacity={0.05} />
            <ReferenceArea x1={12.5} x2={13.5} fill={roundColors.after} fillOpacity={0.05} />

            {/* Divider lines */}
            <ReferenceLine x={4.5} stroke={roundColors.round1} strokeWidth={2} />
            <ReferenceLine x={8.5} stroke={roundColors.round2} strokeWidth={2} />
            <ReferenceLine x={12.5} stroke={roundColors.round3} strokeWidth={2} />

            {/* Group labels */}
            <text x="12%" y="98%" textAnchor="middle" fill={roundColors.round1} fontSize={12} fontWeight="bold">
              R1 (1-4)
            </text>
            <text x="42%" y="98%" textAnchor="middle" fill={roundColors.round2} fontSize={12} fontWeight="bold">
              R2 (5-8)
            </text>
            <text x="72%" y="98%" textAnchor="middle" fill={roundColors.round3} fontSize={12} fontWeight="bold">
              R3 (9-12)
            </text>
            <text x="92%" y="98%" textAnchor="middle" fill={roundColors.after} fontSize={12} fontWeight="bold">
              After (12)
            </text>

            {/* Chart lines with custom dots */}
            <Line
              type="linear"
              dataKey="forVotes"
              name="For"
              stroke="#1D4ED8"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6, fill: "#1D4ED8" }}
            />
            <Line
              type="linear"
              dataKey="againstVotes"
              name="Against"
              stroke="#DC2626"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6, fill: "#DC2626" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
