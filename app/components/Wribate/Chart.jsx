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
} from "recharts";

export default function VotesChart({ data, title }) {
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
              tick={{ fontSize: 12 }}
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

            {/* Vertical divider lines */}
            <ReferenceLine x={4.5} stroke="#ccc" strokeDasharray="3 3" />
            <ReferenceLine x={8.5} stroke="#ccc" strokeDasharray="3 3" />
            <ReferenceLine x={12.5} stroke="#ccc" strokeDasharray="3 3" />

            {/* Test group labels with brackets */}
            <text
              x="12%"
              y="98%"
              textAnchor="middle"
              fill="#666"
              fontSize={12}
              fontWeight="bold"
            >
              R1 (1-4)
            </text>
            <text
              x="42%"
              y="98%"
              textAnchor="middle"
              fill="#666"
              fontSize={12}
              fontWeight="bold"
            >
              R2 (5-8)
            </text>
            <text
              x="72%"
              y="98%"
              textAnchor="middle"
              fill="#666"
              fontSize={12}
              fontWeight="bold"
            >
              R3 (9-12)
            </text>
            <text
              x="92%"
              y="98%"
              textAnchor="middle"
              fill="#666"
              fontSize={12}
              fontWeight="bold"
            >
              After (12)
            </text>

            {/* Chart lines */}
            <Line
              type="linear"
              dataKey="forVotes"
              name="For"
              stroke="#1D4ED8"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="linear"
              dataKey="againstVotes"
              name="Against"
              stroke="#DC2626"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
