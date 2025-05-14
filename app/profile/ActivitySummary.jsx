"use client"
import React from "react";

const ActivitySummary = () => {
    const focusAreas = [
        { id: 1, icon: "🏆", title: "Wins", count: 4 },
        { id: 2, icon: "👑", title: "LeaderShips", count: 4 },
        { id: 3, icon: "💬", title: "Comments", count: 4 },
        { id: 4, icon: "💰", title: "Pecuniary", count: 4 },
        { id: 5, icon: "🚀", title: "Launches", count: 4 },
        { id: 6, icon: "⭐", title: "Reviews", count: 4 },
    ];

    return (
        <div className="bg-white shadow-md p-6 mb-6 border-t-4 border-blue-900">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Activity Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {focusAreas.map((area) => (
                    <div
                        key={area.id}
                        className="p-4 border border-gray-200 flex items-center"
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