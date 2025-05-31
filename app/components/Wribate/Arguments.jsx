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

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

const Arguments = ({ data, user, id, round, value, setValue, refetch }) => {
    const [addArgument] = useAddArgumentMutation();
    const [plans, setPlans] = useState([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);

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

    useEffect(()=>{
         console.log(user?._id, data?.againstId, data?.forId, round)
    },[])

    // Get premium status
    const userIsPremium = isPremiumUser();
    
    console.log("Premium user check:", {
        isLoggedIn: !!user,
        hasActiveSubscription: user?.subscription?.isActive,
        subscriptionId: user?.subscription?.id,
        plansLoaded: !isLoadingPlans,
        isPremium: userIsPremium
    });

    return (
        <div className="bg-white border border-gray-200 shadow-sm mb-4 sm:mb-6 rounded-sm">
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg sm:text-xl font-bold">Arguments</h2>
                {/* Debug info - remove in production */}
                {user && (
                    <div className="text-xs text-gray-500 mt-1">
                        {userIsPremium ? "🎉 Premium User - Ad-free experience" : "Free User - Ads enabled"}
                    </div>
                )}
            </div>

            <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
                {data?.data?.rounds && data.data.rounds.map((roundData, index) => {
                    const roundNumber = roundData.roundNumber;
                    const forArgument = getArgumentForRound(roundNumber, "For");
                    const againstArgument = getArgumentForRound(roundNumber, "Against");

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

                            {/* ✅ CONDITIONAL AD RENDERING - Hide for premium users */}
                            {index < data.data.rounds.length - 1 && !userIsPremium && (
                                <div className="mt-8">
                                    <div className="text-center mb-2">
                                        <span className="text-xs font-semibold text-gray-600 tracking-wider uppercase">Advertisement</span>
                                    </div>
                                    <div className="transform hover:scale-105 transition-transform duration-300 shadow-lg">
                                        <StaticAdvertisement type={`sponsor${index + 1}`} />
                                    </div>
                                </div>
                            )}

                            {/* ✅ PREMIUM USER MESSAGE (Optional) */}
                            {index < data.data.rounds.length - 1 && userIsPremium && (
                                <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                                    <div className="flex items-center">
                                        <span className="text-blue-600 mr-2">🎉</span>
                                        <p className="text-blue-800 font-medium text-sm">
                                            Ad-free experience - Thank you for being a premium user!
                                        </p>
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

            {/* ✅ CONDITIONAL FINAL AD - Hide for premium users */}
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

            {/* ✅ PREMIUM USER FINAL MESSAGE (Optional) */}
            {userIsPremium && (
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                    <div className="text-center">
                        <span className="text-2xl mb-2 block">🎉</span>
                        <p className="text-blue-800 font-medium">
                            Enjoying your premium ad-free experience!
                        </p>
                        <p className="text-blue-600 text-sm mt-1">
                            Thank you for supporting Wribate
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Arguments
