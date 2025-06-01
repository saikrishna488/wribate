"use client"; // Add this directive at the top
import React, { useEffect } from 'react';
import he from "he";
import dynamic from 'next/dynamic'; // Add dynamic import
import "react-quill-new/dist/quill.snow.css";
import {
    useAddArgumentMutation,
} from "../../../app/services/authApi";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import { AdSpaceContent, StaticAdvertisement } from '../Advertisements/Advertisement';

// Replace direct import with dynamic import
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false, // Disable server-side rendering for this component
    loading: () => <p>Loading editor...</p>
});

const Arguments = ({ data, user, id, round, value, setValue, refetch }) => {
    const [addArgument] = useAddArgumentMutation();

    const getArgumentForRound = (roundNumber, side) => {
        if (!data || !data.data || !data.data.arguments) return null;

        const argument = data.data.arguments.find(
            arg => arg.roundNumber == roundNumber && arg.panelSide === side
        );

        return argument?.text || null;
    };

    // Helper function to check if a round has started
    const hasRoundStarted = (roundNumber) => {
        if (!data?.data?.rounds) return false;

        const roundData = data.data.rounds.find(r => r.roundNumber === roundNumber);
        if (!roundData) return false;

        const currentDate = new Date();
        const startDate = new Date(roundData.startDate);

        return currentDate >= startDate;
    };

    // Helper functions
    const getRoundTitle = (roundNumber) => {
        switch (roundNumber) {
            case 1:
                return "Opening Arguments";
            case 2:
                return "Rebuttals";
            case 3:
                return "Closing Arguments";
            default:
                return `Round ${roundNumber}`;
        }
    };

    // Helper function for showing login alert (added based on usage in code)
    const showLoginAlert = () => {
        // Placeholder implementation
        console.error("Login required!");
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!user) {
            showLoginAlert();
            return;
        }

        const data = { text: value, roundNumber: round };
        try {
            const response = await addArgument({ id, data });
            if (response?.data?.status === "success") {
                toast.success("Added")
                refetch()
            }
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        console.log(user?._id, data?.againstId, data?.forId, round, value)
    }, [round,value])


    return (
        <div className="bg-white border border-gray-200 shadow-sm mb-4 sm:mb-6 rounded-sm">
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg sm:text-xl font-bold">Arguments</h2>
            </div>

            <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
                {data?.data?.rounds && data.data.rounds.map((roundData, index) => {
                    const roundNumber = roundData.roundNumber;
                    const forArgument = getArgumentForRound(roundNumber, "For");
                    const againstArgument = getArgumentForRound(roundNumber, "Against");
                    // if(user?._id == data?.forId){
                    //     setValue(forArgument)
                    // }

                    return (
                        <React.Fragment key={roundNumber}>
                            <div className={`${index !== 0 ? 'border-t border-gray-200 pt-6 sm:pt-8' : ''}`}>
                                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                                    Round {roundNumber}: {getRoundTitle(roundNumber)}
                                </h3>

                                <div className="space-y-4 sm:space-y-6">
                                    {/* For Argument - Left Side */}
                                    <div className="border-l-4 border-red-500 bg-red-50 rounded-r-sm p-2 sm:p-3 ml-0 mr-auto w-full sm:w-4/5 md:w-3/4">
                                        <div className="flex items-center mb-2 sm:mb-3">
                                            <img src="/user.png" alt="" className="rounded-full w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                                            <span className="font-medium text-red-800 text-sm sm:text-base">{data.data.leadFor}</span>
                                        </div>

                                        {forArgument ? (
                                            <div
                                                className="prose max-w-none text-md sm:text-md"
                                                dangerouslySetInnerHTML={{ __html: he.decode(forArgument) }}
                                            />
                                        ) : (
                                            <p className="text-gray-500 text-md sm:text-base">No argument submitted.</p>
                                        )}
                                    </div>

                                    {/* Against Argument - Right Side */}
                                    <div className="border-r-4 border-blue-500 bg-blue-50 p-2 sm:p-3 ml-auto mr-0 w-full sm:w-4/5 md:w-3/4">
                                        <div className="flex items-center justify-end mb-2 sm:mb-3">
                                            <span className="font-medium text-blue-800 text-sm sm:text-base">{data.data.leadAgainst}</span>
                                            <img src="/user.png" alt="" className="rounded-full w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                                        </div>

                                        {againstArgument ? (
                                            <div
                                                className="prose max-w-none text-md sm:text-md"
                                                dangerouslySetInnerHTML={{ __html: he.decode(againstArgument) }}
                                            />
                                        ) : (
                                            <p className="text-gray-500 text-right text-md sm:text-base">No argument submitted.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Add static advertisement before the border line */}
                                {index < data.data.rounds.length - 1 && (
                                    <div className="mt-8">
                                        <div className="text-center mb-2">
                                            <span className="text-xs font-semibold text-gray-600 tracking-wider uppercase">Advertisement</span>
                                        </div>
                                        <div className="transform hover:scale-105 transition-transform duration-300 shadow-lg">
                                            <StaticAdvertisement type={`sponsor${index + 1}`} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Argument Editor for Participants - Only show if round has started */}
            {user &&
                (user?._id === data?.forId ||
                    user?._id === data?.againstId) &&
                round &&
                hasRoundStarted(round) && (
                    <div className="border-t border-gray-200 p-3 sm:p-6 bg-gray-50">
                        <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Enter Your Arguments - Round {round}</h3>
                        <div className="bg-white border border-gray-200">
                            <ReactQuill
                                theme="snow"
                                value={value && he.decode(value)}
                                onChange={setValue}
                                style={{
                                    height: '250px',
                                    backgroundColor: "white",
                                    overflowY: "auto"
                                }}
                            />
                        </div>
                        <div className="mt-3 sm:mt-4">
                            <Button
                                onClick={handleSendMessage}
                                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                            >
                                Save Argument
                            </Button>
                        </div>
                    </div>
                )}

            {/* Show message if user is participant but round hasn't started */}
            {user &&
                (user?._id === data?.forId ||
                    user?._id === data?.againstId) &&
                round &&
                !hasRoundStarted(round) && (
                    <div className="border-t border-gray-200 p-3 sm:p-6 bg-gray-50">
                        <div className="text-center py-8">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                <div className="flex items-center justify-center mb-2">
                                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <h4 className="text-lg font-medium text-yellow-800">Round {round} Not Started</h4>
                                </div>
                                <p className="text-yellow-700">
                                    This round hasn't started yet. Please wait for the round to begin before submitting your arguments.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            {/* Final advertisement before comments section */}
            <div className="mt-8">
                <div className="text-center mb-2">
                    <span className="text-xs font-semibfont-semibold text-gray-600 tracking-wider uppercase">Advertisement</span>
                </div>
                <div className="transform hover:scale-105 transition-transform duration-300 shadow-lg">
                    <StaticAdvertisement type="sponsor3" />
                </div>
            </div>
        </div>
    )
}

export default Arguments