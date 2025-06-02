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

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

const Arguments = ({ data, user, id, round, value, setValue, refetch }) => {
    const [addArgument] = useAddArgumentMutation();
    const [plans, setPlans] = useState([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);
    const router = useRouter();

    // Fetch subscription plans
    useEffect(() => {
        const fetchSubscriptionPlans = async () => {
            try {
                setIsLoadingPlans(true);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getSubscriptionPlans`
                );
                
                if (response.data.res && response.data.plans) {
                    setPlans(response.data.plans);
                }
            } catch (error) {
                console.error("Error fetching subscription plans:", error);
            } finally {
                setIsLoadingPlans(false);
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

    // ✅ CHECK IF WRIBATE IS FEATURED/SPONSORED
    const isFeaturedWribate = () => {
        return data?.data?.type === "Sponsored";
    };

    // ✅ DETERMINE IF ROUND SHOULD BE MASKED
    const shouldMaskRound = (roundNumber) => {
        const isUserPremium = isPremiumUser();
        const isWribateFeatured = isFeaturedWribate();
        
        return isWribateFeatured && !isUserPremium && roundNumber > 1;
    };

    const getArgumentForRound = (roundNumber, side) => {
        if (!data || !data.data || !data.data.arguments) return null;

        const argument = data.data.arguments.find(
            arg => arg.roundNumber == roundNumber && arg.panelSide === side
        );

        return argument?.text || null;
    };

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

    const showLoginAlert = () => {
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

    // ✅ CLEAN PREMIUM MASK - NO CONTENT PREVIEW
    const PremiumMask = ({ roundNumber }) => (
        <div className="min-h-[400px] bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                {/* Lock Icon */}
                <div className="mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                </div>

                {/* Premium Content Message */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Content</h3>
                <p className="text-gray-600 text-lg mb-2">
                    Subscribe to read <strong>{getRoundTitle(roundNumber)}</strong>
                </p>
                <p className="text-gray-500 text-base mb-8">
                    and unlock full access to featured Wribate arguments
                </p>

                {/* Upgrade Button */}
                <button
                    onClick={() => router.push('/subscription')}
                    className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg mb-6"
                >
                    Upgrade to Premium
                </button>

                {/* Features List */}
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex flex-col items-center">
                        <span className="text-lg mb-1">🚫</span>
                        <span>Ad-free</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg mb-1">🔓</span>
                        <span>Full access</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg mb-1">⭐</span>
                        <span>Premium</span>
                    </div>
                </div>
            </div>
        </div>
    );

    // Get premium status
    const userIsPremium = isPremiumUser();
    const wribateIsFeatured = isFeaturedWribate();
    
    return (
        <div className="bg-white border border-gray-200 shadow-sm mb-4 sm:mb-6 rounded-sm">
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg sm:text-xl font-bold">Arguments</h2>
                
                {/* ✅ FEATURED WRIBATE INDICATOR */}
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
                {data?.data?.rounds && data.data.rounds.map((roundData, index) => {
                    const roundNumber = roundData.roundNumber;
                    const forArgument = getArgumentForRound(roundNumber, "For");
                    const againstArgument = getArgumentForRound(roundNumber, "Against");
                    const isRoundMasked = shouldMaskRound(roundNumber);

                    return (
                        <React.Fragment key={roundNumber}>
                            <div className={`${index !== 0 ? 'border-t border-gray-200 pt-6 sm:pt-8' : ''}`}>
                                {/* ✅ ROUND HEADER - ALWAYS VISIBLE */}
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

                                {/* ✅ CONDITIONAL CONTENT RENDERING */}
                                {isRoundMasked ? (
                                    /* ✅ CLEAN PREMIUM MASK - NO CONTENT VISIBLE */
                                    <PremiumMask roundNumber={roundNumber} />
                                ) : (
                                    /* Show normal content for accessible rounds */
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
                                )}

                                {/* ✅ AD RENDERING - Only show for non-premium users on accessible content */}
                                {index < data.data.rounds.length - 1 && !userIsPremium && !isRoundMasked && (
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

            {/* Argument Editor for Participants */}
            {user &&
                (user?._id === data?.forId ||
                    user?._id === data?.againstId) && round && (
                    <div className="border-t border-gray-200 p-3 sm:p-6 bg-gray-50">
                        <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Enter Your Arguments - Round {round}</h3>
                        <div className="bg-white border border-gray-200">
                            <ReactQuill
                                theme="snow"
                                value={value ? he.decode(value) : ""}
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

            {/* ✅ CONDITIONAL FINAL AD - Only show for non-premium users */}
            {!userIsPremium && (
                <div className="mt-8">
                    <div className="text-center mb-2">
                        <span className="text-xs font-semibold text-gray-600 tracking-wider uppercase">Advertisement</span>
                    </div>
                    <div className="transform hover:scale-105 transition-transform duration-300 shadow-lg">
                        <StaticAdvertisement type="sponsor3" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Arguments
