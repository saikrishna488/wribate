"use client"
import React from "react";

const ActivitySummary = ({user}) => {
    const focusAreas = [
        { id: 1, icon: "🏆", title: "Wins", count: user?.wins ||  0 },
        { id: 2, icon: "👑", title: "LeaderShips", count: 0 },
        { id: 3, icon: "💬", title: "Comments", count: user?.comments?.length || 0 },
        // { id: 4, icon: "💰", title: "Pecuniary", count: 4 },
        { id: 5, icon: "🚀", title: "Launches", count: user?.wribates?.length || 0 },
        { id: 6, icon: "⭐", title: "Reviews", count: user?.reviews?.length || 0 },
    ];

    return (
        <div className="bg-white shadow-md p-6 mb-6 border-t-4 border-blue-900">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Activity Summary</h2>
            <div className="flex flex-wrap">
                {focusAreas.map((area) => (
                    <div
                        key={area.id}
                        className="p-4 border border-gray-200 flex items-center m-1  flex-1 w-fit"
                    >
                        <span className="text-2xl mr-4">{area.icon}</span>
                        <div>
                            <p className="text-lg font-semibold">{area.count}</p>
                            <p className="text-gray-500">{area.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivitySummary;