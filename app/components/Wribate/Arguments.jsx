"use client";
import React, { useEffect, useState } from 'react';
import he from "he";
import dynamic from 'next/dynamic';
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import { StaticAdvertisement } from '../Advertisements/Advertisement';
import ArgumentRound from './ArgumentRound'; // Import the new component
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

        console.log(wribate);
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

    // Determine if round should be shown based on current round
    const shouldShowRound = (roundNumber) => {
        if (!round) {
            const date = new Date();
            const startDate = new Date(wribate.startDate);

            if (date < startDate) {
                return false;
            }
            else{
                return true
            }
        }
        return roundNumber < round;
    };

    // Determine if we should show "something is cooking" for future rounds
    const shouldShowCookingMessage = (roundNumber) => {
        // Show cooking message for rounds that are greater than current round
        console.log(roundNumber)
        if (!round) {
            const date = new Date();
            const startDate = new Date(wribate.startDate);

            if (date < startDate) {
                console.log(true)
                return true;
            }
        }
        return roundNumber == round;
    };

    const getArgumentForRound = (roundNumber, side) => {
        if (!wribate || !wribate.arguments) return null;

        const argument = wribate.arguments.find(
            arg => arg.roundNumber == roundNumber && arg.panelSide === side
        );

        return argument?.text || null;
    };

    // Helper function for showing login alert
    const showLoginAlert = () => {
        console.error("Login required!");
        // You can add more sophisticated alert logic here
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!user) {
            showLoginAlert();
            return;
        }

        const dataToSend = { text: value, roundNumber: round };

        const data = await httpRequest(axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/arguments/' + wribate?._id, dataToSend, {
            headers: authHeader()
        }), null, "Will be Saved after Round " + round)
    };

    // useEffect(() => {
    //     console.log(user?._id, data?.againstId, data?.forId, round, value);
    // }, [round, value]);

    // Get premium status
    const userIsPremium = isPremiumUser();
    const wribateIsFeatured = isFeaturedWribate();

    // Check if user is a participant (for or against)
    const isUserParticipant = user && (user?._id === data?.forId || user?._id === data?.againstId);

    // Component for "Something is cooking" message
    const CookingMessage = ({ roundNumber }) => {
        const getCookingContent = (round) => {
            switch (round) {
                case 1:
                    return {
                        title: "Round 1: The Stage Is Set — Opening Salvos Are Brewing",
                        description: "The silence is thick with anticipation. As the first words prepare to break through, perspectives sharpen and the storm begins to stir. Let's see what truths will emerge?",
                        emoji: "🎭",
                        bgGradient: "from-purple-50 to-indigo-50",
                        borderColor: "border-purple-200",
                        titleColor: "text-purple-800",
                        descColor: "text-purple-600",
                        accentColor: "bg-purple-400"
                    };
                case 2:
                    return {
                        title: "Round 2: Rebuttal Round — Opening Arguments Under Fire",
                        description: "The heat intensifies. No idea stands unchallenged as rebuttals begin to take form. Will they hold the line—or crumble under pressure? The clash of convictions has begun. Let's see what's being challenged!",
                        emoji: "⚔️",
                        bgGradient: "from-red-50 to-orange-50",
                        borderColor: "border-red-200",
                        titleColor: "text-red-800",
                        descColor: "text-red-600",
                        accentColor: "bg-red-400"
                    };
                case 3:
                    return {
                        title: "Round 3: Closing Statements — The Final Words Being Cast",
                        description: "The dust begins to settle. With everything on the line, Wribaters summon their final words. Not just to convince, but to leave a mark. Watch closely—this is where legacies are forged.",
                        emoji: "👑",
                        bgGradient: "from-gold-50 to-yellow-50",
                        borderColor: "border-yellow-200",
                        titleColor: "text-yellow-800",
                        descColor: "text-yellow-700",
                        accentColor: "bg-yellow-400"
                    };
                default:
                    return {
                        title: `Round ${round}: Something is cooking...`,
                        description: "Arguments are being prepared... Stay tuned!",
                        emoji: "🔥",
                        bgGradient: "from-orange-50 to-yellow-50",
                        borderColor: "border-orange-200",
                        titleColor: "text-orange-800",
                        descColor: "text-orange-600",
                        accentColor: "bg-orange-400"
                    };
            }
        };

        const content = getCookingContent(roundNumber);

        return (
            <div className={`bg-gradient-to-r ${content.bgGradient} border-2 border-dashed ${content.borderColor} rounded-lg p-6 text-center`}>
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-pulse">
                        <div className={`w-12 h-12 ${content.accentColor} rounded-full flex items-center justify-center text-2xl`}>
                            {content.emoji}
                        </div>
                    </div>
                    <div className="max-w-2xl">
                        <h3 className={`text-xl font-bold ${content.titleColor} mb-3`}>
                            {content.title}
                        </h3>
                        <p className={`text-sm ${content.descColor} leading-relaxed`}>
                            {content.description}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <div className="animate-pulse">
                            <div className={`w-3 h-3 ${content.accentColor} rounded-full`}></div>
                        </div>
                        <div className="animate-pulse animation-delay-150">
                            <div className={`w-3 h-3 ${content.accentColor} rounded-full`}></div>
                        </div>
                        <div className="animate-pulse animation-delay-300">
                            <div className={`w-3 h-3 ${content.accentColor} rounded-full`}></div>
                        </div>
                    </div>
                </div>
            </div>
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

            <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
                {wribate?.rounds && wribate.rounds.map((roundData, index) => {
                    const roundNumber = roundData.roundNumber;
                    const forArgument = getArgumentForRound(roundNumber, "For");
                    const againstArgument = getArgumentForRound(roundNumber, "Against");
                    const isRoundMasked = shouldMaskRound(roundNumber);
                    const showRound = shouldShowRound(roundNumber);
                    const showCooking = shouldShowCookingMessage(roundNumber);

                    return (
                        <React.Fragment key={roundNumber}>
                            {showRound && (
                                <ArgumentRound
                                    roundData={roundData}
                                    index={index}
                                    wribate={wribate}
                                    forArgument={forArgument}
                                    againstArgument={againstArgument}
                                    isRoundMasked={isRoundMasked}
                                    userIsPremium={userIsPremium}
                                    wribateIsFeatured={wribateIsFeatured}
                                    visibility={visibility}
                                    totalRounds={wribate.rounds.length}
                                />
                            )}
                            {showCooking && (
                                <CookingMessage roundNumber={roundNumber} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Argument input section for participants - only show if round is active and user is participant */}
            {isUserParticipant && round && (
                <div className="border-t border-gray-200 p-3 sm:p-6 bg-gray-50">
                    <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Enter Your Arguments - Round {round}</h3>
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

            {/* Final advertisement for non-premium users */}
            {!userIsPremium && visibility && (
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

                .animation-delay-150 {
                    animation-delay: 150ms;
                }
                
                .animation-delay-300 {
                    animation-delay: 300ms;
                }
            `}</style>
        </div>
    );
};

export default Arguments;