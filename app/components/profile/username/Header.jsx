"use client"
import React from "react";

const ProfileHeader = ({ router }) => {
    return (
        <header className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center">
                <button
                    className="p-2 hover:bg-blue-800 transition-colors"
                    onClick={() => router.back()}
                    aria-label="Back"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                </button>
                <h1 className="text-xl font-bold ml-4">Profile</h1>
            </div>
        </header>
    );
};

export default ProfileHeader;