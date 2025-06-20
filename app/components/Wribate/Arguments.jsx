"use client";
import React, { useEffect, useState } from 'react';
import he from "he";
import dynamic from 'next/dynamic';
import "react-quill-new/dist/quill.snow.css";
import {
    useAddArgumentMutation,
} from "../../../app/services/authApi";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import { AdSpaceContent, StaticAdvertisement } from '../Advertisements/Advertisement';
import axios from "axios";
import authHeader from "../../utils/authHeader";
import { useRouter } from "next/navigation";
import httpRequest from '@/app/utils/httpRequest';
import { useAtom } from 'jotai';
import { adsAtom } from '@/app/states/GlobalStates';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false, // Disable server-side rendering for this component
    loading: () => <p>Loading editor...</p>
});

const Arguments = ({ wribate, user, id, round, value, setValue, refetch, data }) => {
    const [plans, setPlans] = useState([]);
    const router = useRouter();
    const [visibility, setVisibility] = useAtom(adsAtom);

    // get argument
    const getValue = () => {
        if (user?._id === data.forId) {
            setValue(he.decode(wribate?.draft?.forDraft?.argument || ""));
        } else {
            setValue(he.decode(wribate?.draft?.againstDraft?.argument || ""));
        }
    };

    useEffect(() => {
        getValue()
    }, [])

    // Fetch subscription plans
    useEffect(() => {
        const fetchSubscriptionPlans = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getSubscriptionPlans`
                );

                if (response.data.res && response.data.plans) {
                    setPlans(response.data.plans);
                }
            } catch (error) {
                console.error("Error fetching subscription plans:", error);
            }
        };

        fetchSubscriptionPlans();
    }, []);

    // Check if user is premium
    const isPremiumUser = () => {
        if (!user?.subscription?.isActive || !plans.length) return false;

        const currentPlan = plans.find(plan =>
            String(plan._id) === String(user.subscription.id)
        );

        return currentPlan && currentPlan.price > 0;
    };

    // Check if wribate is featured/sponsored
    const isFeaturedWribate = () => {
        return wribate?.type === "Sponsored";
    };

    // Determine if round should be masked
    const shouldMaskRound = (roundNumber) => {
        const isUserPremium = isPremiumUser();
        const isWribateFeatured = isFeaturedWribate();

        return isWribateFeatured && !isUserPremium && roundNumber > 1;
    };

    const getArgumentForRound = (roundNumber, side) => {
        if (!wribate || !wribate.arguments) return null;

        const argument = wribate.arguments.find(
            arg => arg.roundNumber == roundNumber && arg.panelSide === side
        );

        return argument?.text || null;
    };

    // Helper function to check if a round has started
    const hasRoundStarted = (roundNumber) => {
        if (!wribate?.rounds) return false;

        const roundData = wribate.rounds.find(r => r.roundNumber === roundNumber);
        if (!roundData) return false;

        const currentDate = new Date();
        const startDate = new Date(roundData.startDate);

        return currentDate >= startDate;
    };

    // Helper function to check if a round has ended
    const hasRoundEnded = (roundNumber) => {
        if (!wribate?.rounds) return false;

        const roundData = wribate.rounds.find(r => r.roundNumber === roundNumber);
        if (!roundData || !roundData.endDate) return false;

        const currentDate = new Date();
        const endDate = new Date(roundData.endDate);

        return currentDate > endDate;
    };

    // Helper function to get current active round
    const getCurrentActiveRound = () => {
        if (!wribate?.rounds) return null;

        const currentDate = new Date();
        
        for (const roundData of wribate.rounds) {
            const startDate = new Date(roundData.startDate);
            const endDate = roundData.endDate ? new Date(roundData.endDate) : null;
            
            if (currentDate >= startDate && (!endDate || currentDate <= endDate)) {
                return roundData.roundNumber;
            }
        }
        
        return null;
    };

    // Helper function to check if user has submitted argument for a round
    const hasUserSubmittedArgument = (roundNumber) => {
        if (!user || !wribate?.arguments) return false;

        const userSide = user._id === data.forId ? "For" : "Against";
        
        return wribate.arguments.some(
            arg => arg.roundNumber == roundNumber && 
                   arg.panelSide === userSide &&
                   arg.text && arg.text.trim() !== ""
        );
    };

    // Helper function to check if all rounds are completed
    const areAllRoundsCompleted = () => {
        if (!wribate?.rounds) return false;

        const currentDate = new Date();

        // Check if all rounds have passed their end date
        return wribate.rounds.every(roundData => {
            if (!roundData.endDate) return false;
            const endDate = new Date(roundData.endDate);
            return currentDate > endDate;
        });
    };

    // Helper function to check if first round has started
    const hasFirstRoundStarted = () => {
        return hasRoundStarted(1);
    };

    // Helper function to get round title
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

    // Helper function for showing login alert
    const showLoginAlert = () => {
        console.error("Login required!");
        // You can add more sophisticated alert logic here
    };

    // New function to determine what to show
    const shouldShowCookingAnimation = () => {
        // If first round hasn't started, show cooking animation
        if (!hasFirstRoundStarted()) {
            return { show: true, message: "Wribate is starting soon..." };
        }

        // If user is a participant
        if (user && (user._id === data?.forId || user._id === data?.againstId)) {
            const activeRound = getCurrentActiveRound();
            
            // If there's an active round and user hasn't submitted argument
            if (activeRound && !hasUserSubmittedArgument(activeRound)) {
                return { 
                    show: true, 
                    message: `Round ${activeRound} is in progress...`,
                    hideOtherRounds: true,
                    showInput: true
                };
            }
        }

        return { show: false };
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!user) {
            showLoginAlert();
            return;
        }

        const dataToSend = { text: value, roundNumber: round };
        // try {
        //     const response = await addArgument({ id, data: dataToSend });
        //     if (response?.data?.status === "success") {
        //         toast.success("Added");
        //         refetch();
        //     }
        // } catch (err) {
        //     console.error(err);
        // }

        const data = await httpRequest(axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/arguments/' + id, dataToSend, {
            headers: authHeader()
        }), null, "Will be Saved after Round " + round)
    };

    useEffect(() => {
        console.log(user?._id, data?.againstId, data?.forId, round, value);
    }, [round, value]);

    // PREMIUM MASK: Only first two lines blurred, rest hidden
    const PremiumMask = ({ roundNumber, forArgument, againstArgument }) => {
        // Helper to split argument into lines
        const splitLines = (text) => {
            if (!text) return [];
            // Split on <br> or newlines
            return text.split(/\n|<br\s*\/?>/i).filter(line => line.trim() !== '');
        };

        const forLines = splitLines(he.decode(forArgument || ""));
        const againstLines = splitLines(he.decode(againstArgument || ""));

        const renderBlurredLines = (lines) => {
            const firstTwo = lines.slice(0, 2).join('<br/>');
            return <div className="blurred-lines" dangerouslySetInnerHTML={{ __html: firstTwo }} />;
        };

        return (
            <div className="relative">
                {/* Only first two lines blurred/opaqued */}
                <div className="premium-content-preview">
                    <div className="border-l-4 border-red-300 bg-red-50 rounded-r-sm p-3 mb-4">
                        <div className="flex items-center mb-3">
                            <img src="/user.png" alt="" className="rounded-full w-6 h-6 mr-2" />
                            <span className="font-medium text-red-600">{wribate.leadFor}</span>
                        </div>
                        {forLines.length > 0 ? renderBlurredLines(forLines) : <p className="text-gray-500">No argument submitted.</p>}
                    </div>
                    <div className="border-r-4 border-blue-300 bg-blue-50 p-3">
                        <div className="flex items-center justify-end mb-3">
                            <span className="font-medium text-blue-600">{wribate.leadAgainst}</span>
                            <img src="/user.png" alt="" className="rounded-full w-6 h-6 ml-2" />
                        </div>
                        {againstLines.length > 0 ? renderBlurredLines(againstLines) : <p className="text-gray-500">No argument submitted.</p>}
                    </div>
                </div>
                {/* Blocked rest of the content */}
                <div className="blocked-content flex justify-between mt-2">
                    <div className="blocked-for w-1/2 border-l-4 border-red-300 bg-red-100 rounded-r-sm p-3 ml-0 mr-auto">
                        {forLines.length > 2 ? <p>Content hidden. Subscribe to view full argument.</p> : null}
                    </div>
                    <div className="blocked-against w-1/2 border-r-4 border-blue-300 bg-blue-100 rounded-l-sm p-3 ml-auto mr-0">
                        {againstLines.length > 2 ? <p className="text-right">Content hidden. Subscribe to view full argument.</p> : null}
                    </div>
                </div>
                {/* Subscription prompt */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50/90 border border-blue-200 rounded-md px-5 py-3 mt-3 gap-2 sm:gap-0 backdrop-blur-sm">
                    <div className="flex items-center text-blue-900 text-base font-medium">
                        <svg className="w-5 h-5 mr-2 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>
                            To access the full content of <b>{getRoundTitle(roundNumber)}</b>, subscribe to <span className="text-blue-700 font-semibold">Premium</span>.
                        </span>
                    </div>
                    <button
                        onClick={() => router.push('/subscription')}
                        className="mt-2 sm:mt-0 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded transition-all duration-200 text-base shadow"
                    >
                        Upgrade Now
                    </button>
                </div>
                <style jsx>{`
                    .premium-content-preview {
                        position: relative;
                        opacity: 0.4;
                        filter: blur(1px);
                        pointer-events: none;
                        -webkit-mask-image: linear-gradient(to bottom, 
                            rgba(0,0,0,1) 0%, 
                            rgba(0,0,0,0.8) 60%, 
                            rgba(0,0,0,0.3) 85%, 
                            rgba(0,0,0,0) 100%);
                        mask-image: linear-gradient(to bottom, 
                            rgba(0,0,0,1) 0%, 
                            rgba(0,0,0,0.8) 60%, 
                            rgba(0,0,0,0.3) 85%, 
                            rgba(0,0,0,0) 100%);
                    }
                    .blocked-content p {
                        font-style: italic;
                        color: #3b82f6; /* blue-500 */
                        font-weight: 600;
                        margin: 0;
                    }
                `}</style>
            </div>
        );
    };

    // Cooking Animation Component
    const CookingAnimation = ({ message, showInput = false }) => {
        return (
            <div className="p-6 sm:p-12">
                <div className="text-center">
                    {/* Pulsing cooking pot animation */}
                    <div className="relative mb-6">
                        <div className="cooking-pot mx-auto">
                            {/* Cooking pot icon */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 relative">
                                <svg 
                                    className="w-full h-full text-orange-500" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                                </svg>
                                
                                {/* Steam animation */}
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                    <div className="steam-line steam-1"></div>
                                    <div className="steam-line steam-2"></div>
                                    <div className="steam-line steam-3"></div>
                                </div>
                                
                                {/* Pulsing ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-orange-300 pulse-ring"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-orange-400 pulse-ring pulse-ring-delayed"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Message */}
                    <div className="mb-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                            Something's Cooking! 🔥
                        </h3>
                        <p className="text-gray-600 text-base sm:text-lg">
                            {message}
                        </p>
                    </div>
                    
                    {/* Loading dots */}
                    <div className="flex justify-center space-x-1">
                        <div className="loading-dot loading-dot-1"></div>
                        <div className="loading-dot loading-dot-2"></div>
                        <div className="loading-dot loading-dot-3"></div>
                    </div>
                </div>
                
                <style jsx>{`
                    .pulse-ring {
                        animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
                    }
                    
                    .pulse-ring-delayed {
                        animation-delay: 0.5s;
                    }
                    
                    @keyframes pulse-ring {
                        0% {
                            transform: scale(0.8);
                            opacity: 1;
                        }
                        100% {
                            transform: scale(1.4);
                            opacity: 0;
                        }
                    }
                    
                    .steam-line {
                        width: 2px;
                        height: 15px;
                        background: linear-gradient(to top, rgba(255,255,255,0.8), transparent);
                        margin: 0 2px;
                        display: inline-block;
                        border-radius: 1px;
                        animation: steam 2s ease-in-out infinite;
                    }
                    
                    .steam-1 {
                        animation-delay: 0s;
                    }
                    
                    .steam-2 {
                        animation-delay: 0.3s;
                    }
                    
                    .steam-3 {
                        animation-delay: 0.6s;
                    }
                    
                    @keyframes steam {
                        0%, 100% {
                            opacity: 0;
                            transform: translateY(0) scaleX(1);
                        }
                        50% {
                            opacity: 1;
                            transform: translateY(-10px) scaleX(1.2);
                        }
                    }
                    
                    .loading-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background-color: #f97316;
                        animation: loading-dots 1.4s ease-in-out infinite;
                    }
                    
                    .loading-dot-1 {
                        animation-delay: 0s;
                    }
                    
                    .loading-dot-2 {
                        animation-delay: 0.2s;
                    }
                    
                    .loading-dot-3 {
                        animation-delay: 0.4s;
                    }
                    
                    @keyframes loading-dots {
                        0%, 80%, 100% {
                            transform: scale(0.8);
                            opacity: 0.5;
                        }
                        40% {
                            transform: scale(1.2);
                            opacity: 1;
                        }
                    }
                `}</style>
            </div>
        );
    };

    // Get premium status
    const userIsPremium = isPremiumUser();
    const wribateIsFeatured = isFeaturedWribate();
    const cookingState = shouldShowCookingAnimation();

    // Check conditions for showing argument input
    const shouldShowArgumentInput = () => {
        const activeRound = getCurrentActiveRound();
        return (
            user &&
            (user?._id === data?.forId || user?._id === data?.againstId) &&
            activeRound &&
            hasRoundStarted(activeRound) &&
            !areAllRoundsCompleted() &&
            hasFirstRoundStarted()
        );
    };

    return (
        <div className="bg-white border border-gray-200 shadow-sm mb-4 sm:mb-6 rounded-sm">
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg sm:text-xl font-bold">Arguments</h2>
                {wribateIsFeatured && (
                    <div className="mt-2 flex items-center flex-wrap gap-2">
                        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                            ⭐ Featured Wribate
                        </span>
                        {!userIsPremium && (
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                🔒 Premium subscription required for Round 2+
                            </span>
                        )}
                        {userIsPremium && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                🎉 Premium access unlocked
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Show cooking animation if needed */}
            {cookingState.show ? (
                <>
                    <CookingAnimation 
                        message={cookingState.message} 
                        showInput={cookingState.showInput} 
                    />
                    
                    {/* Show argument input if user needs to submit for current round */}
                    {cookingState.showInput && shouldShowArgumentInput() && (
                        <div className="border-t border-gray-200 p-3 sm:p-6 bg-gray-50">
                            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                                Enter Your Arguments - Round {getCurrentActiveRound()}
                            </h3>
                            <div className="bg-white border border-gray-200">
                                <ReactQuill
                                    theme="snow"
                                    value={value && value}
                                    onChange={setValue}
                                    style={{
                                        minHeight: '400px'
                                    }}
                                    className="min-h-[400px]"
                                />
                            </div>
                            <div className="mt-3 sm:mt-4">
                                <Button
                                    onClick={handleSendMessage}
                                    className="bg-blue-900 rounded-none hover:bg-blue-700 w-full sm:w-auto"
                                >
                                    Save Argument
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* Show normal rounds view */
                <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
                    {wribate?.rounds && wribate.rounds.map((roundData, index) => {
                        const roundNumber = roundData.roundNumber;
                        const forArgument = getArgumentForRound(roundNumber, "For");
                        const againstArgument = getArgumentForRound(roundNumber, "Against");
                        const isRoundMasked = shouldMaskRound(roundNumber);

                        return (
                            <React.Fragment key={roundNumber}>
                                <div className={`${index !== 0 ? 'border-t border-gray-200 pt-6 sm:pt-8' : ''}`}>
                                    <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-100 flex items-center flex-wrap gap-2">
                                        <span>Round {roundNumber}: {getRoundTitle(roundNumber)}</span>
                                        {isRoundMasked && (
                                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                                🔒 Premium Only
                                            </span>
                                        )}
                                        {wribateIsFeatured && !isRoundMasked && roundNumber === 1 && (
                                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                                                ✓ Free Preview
                                            </span>
                                        )}
                                    </h3>

                                    {isRoundMasked ? (
                                        <PremiumMask
                                            roundNumber={roundNumber}
                                            forArgument={forArgument}
                                            againstArgument={againstArgument}
                                        />
                                    ) : (
                                        <div className="space-y-4 sm:space-y-6">
                                            <div className="argument border-l-4 border-red-500 bg-red-50 rounded-r-sm p-2 sm:p-3 ml-0 mr-auto w-full sm:w-[90%]">
                                                <div className="flex items-center mb-2 sm:mb-3">
                                                    <img src="/user.png" alt="" className="rounded-full w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                                                    <span className="font-medium text-red-800 text-sm sm:text-base">{wribate.leadFor}</span>
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
                                            <div className="argument border-r-4 border-blue-500 bg-blue-50 p-2 sm:p-3 ml-auto mr-0 w-full sm:w-[90%]">
                                                <div className="flex items-center justify-end mb-2 sm:mb-3">
                                                    <span className="font-medium text-blue-800 text-sm sm:text-base">{wribate.leadAgainst}</span>
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
                                    )}

                                    {/* Show advertisements between rounds for non-premium users */}
                                    {index < wribate.rounds.length - 1 && !userIsPremium && !isRoundMasked && visibility && (
                                        <div className="mt-8">
                                            <div className="text-center mb-2">
                                                <span className="text-xs font-semibold text-gray-600 tracking-wider uppercase">Advertisement</span>
                                            </div>
                                            <div className="transform  transition-transform duration-300">
                                                <StaticAdvertisement type={`sponsor${index + 1}`} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            )}

            {/* Show message if all rounds are completed */}
            {user &&
                (user?._id === data?.forId || user?._id === data?.againstId) &&
                areAllRoundsCompleted() && (
                    <div className="border-t border-gray-200 p-3 sm:p-6 bg-gray-50">
                        <div className="text-center py-8">
                            <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                <div className="flex items-center justify-center mb-2">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <h4 className="text-lg font-medium text-green-800">All Rounds Completed</h4>
                                </div>
                                <p className="text-green-700">
                                    All wribate rounds have been completed. Thank you for your participation!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            {/* Final advertisement for non-premium users */}
            {!userIsPremium && visibility && !cookingState.show && (
                <div className="mt-8 p-2">
                    <div className="text-center mb-2">
                        <span className="text-xs font-semibold text-gray-600 tracking-wider uppercase">Advertisement</span>
                    </div>
                    <div className="duration-300 shadow-lg">
                        <StaticAdvertisement type="sponsor3" />
                    </div>
                </div>
            )}

            <style jsx global>{`
                .ql-editor {
                    min-height: 350px !important;
                    font-family: inherit;
                }
                
                .ql-container {
                    font-family: inherit;
                }
                
                .ql-toolbar {
                    border-top: none !important;
                    border-left: none !important;
                    border-right: none !important;
                    border-bottom: 1px solid #e5e7eb !important;
                }
                
                .ql-container {
                    border-left: none !important;
                    border-right: none !important;
                    border-bottom: none !important;
                }
            `}</style>
        </div>
    );
};

export default Arguments;