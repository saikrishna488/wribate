"use client"
import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import formatDate from "../utils/dateFormat";
import { useRouter } from "next/navigation";
import authHeader from "../utils/authHeader";

const SubscriptionPage = () => {
    const [user, setUser] = useAtom(userAtom);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingPlanId, setProcessingPlanId] = useState(null);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const router = useRouter();

    // Function to decode HTML entities
    const decodeHtmlEntities = (html) => {
        if (!html) return '';
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    // Load Razorpay script
    useEffect(() => {
        const loadRazorpay = () => {
            if (typeof window.Razorpay !== 'undefined') {
                setRazorpayLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => setRazorpayLoaded(true);
            script.onerror = () => console.error('Failed to load Razorpay script');
            document.body.appendChild(script);
        };
        loadRazorpay();
    }, []);

    // Fetch fresh user data function
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getProfile`,
                { 
                    withCredentials: true,
                    headers: authHeader()
                }
            );
            
            if (response.data.res && response.data.user) {
                setUser(response.data.user);
                return response.data.user;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    // Fetch subscription plans
    useEffect(() => {
        const fetchSubscriptionPlans = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getSubscriptionPlans`
                );
                
                if (response.data.res && response.data.plans) {
                    setPlans(response.data.plans);
                }
            } catch (error) {
                console.error("Error fetching subscription plans:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptionPlans();
    }, []);

    // Fetch user profile on mount
    useEffect(() => {
        if (user?._id) {
            fetchUserProfile();
        }
    }, [user?._id]);

    // Universal plan switching function
    const handlePlanSwitch = async (selectedPlan) => {
        if (!user?._id) {
            toast.error("Please login first");
            router.push("/login");
            return;
        }

        try {
            setProcessingPlanId(selectedPlan._id);

            let amountInRupees = selectedPlan.price;
            if (selectedPlan.currency === '$') {
                amountInRupees = selectedPlan.price * 83;
            }

            const orderAmount = amountInRupees === 0 ? 1 : Math.round(amountInRupees);

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/createOrder`,
                { 
                    amount: orderAmount,
                    planId: selectedPlan._id
                },
                { 
                    withCredentials: true,
                    headers: authHeader()
                }
            );

            if (res.data.res) {
                if (selectedPlan.price === 0) {
                    const updatedUser = {
                        ...user,
                        subscription: {
                            ...user.subscription,
                            id: selectedPlan._id,
                            isActive: true,
                            startDate: new Date().toISOString(),
                            expiryDate: new Date(Date.now() + (selectedPlan.duration * 24 * 60 * 60 * 1000)).toISOString(),
                            durationInDays: selectedPlan.duration
                        }
                    };
                    setUser(updatedUser);
                    setProcessingPlanId(null);
                    toast.success(`Successfully switched to ${selectedPlan.name} plan!`);
                    fetchUserProfile();
                    return;
                }

                if (!razorpayLoaded) {
                    toast.error("Payment system is loading. Please try again.");
                    setProcessingPlanId(null);
                    return;
                }

                const razorpayOrderId = res.data.razorpayOrderId;

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                    amount: Math.round(amountInRupees * 100),
                    currency: "INR",
                    name: "Wribate",
                    description: `${selectedPlan.name} Subscription`,
                    order_id: razorpayOrderId,
                    handler: async function (response) {
                        const updatedUser = {
                            ...user,
                            subscription: {
                                ...user.subscription,
                                id: selectedPlan._id,
                                isActive: true,
                                startDate: new Date().toISOString(),
                                expiryDate: new Date(Date.now() + (selectedPlan.duration * 24 * 60 * 60 * 1000)).toISOString(),
                                durationInDays: selectedPlan.duration
                            }
                        };
                        setUser(updatedUser);
                        setProcessingPlanId(null);
                        toast.success("Payment successful!");
                        toast.success("Subscription updated successfully!");
                        fetchUserProfile();
                    },
                    prefill: {
                        name: user?.name || "",
                        email: user?.email || "",
                    },
                    theme: {
                        color: "#6B46C1",
                    },
                    modal: {
                        ondismiss: function () {
                            setProcessingPlanId(null);
                        }
                    }
                };

                if (typeof window.Razorpay !== 'undefined') {
                    const rzp = new window.Razorpay(options);
                    rzp.on('payment.failed', function (response) {
                        console.error("Payment failed:", response.error);
                        toast.error("Payment failed. Please try again.");
                        setProcessingPlanId(null);
                    });
                    rzp.open();
                } else {
                    toast.error("Payment system not available.");
                    setProcessingPlanId(null);
                }
            } else {
                throw new Error(res.data.message || "Failed to create order");
            }
        } catch (error) {
            console.error("Error switching plan:", error);
            toast.error(error?.response?.data?.message || "Failed to switch plan. Please try again.");
            setProcessingPlanId(null);
        }
    };

    // Enhanced current plan detection
    const getCurrentPlan = () => {
        if (!user?.subscription) return null;
        
        const subscription = user.subscription;
        
        if (subscription.id) {
            const planById = plans.find(plan => String(plan._id) === String(subscription.id));
            if (planById) {
                return planById;
            }
        }
        
        if (subscription.isActive) {
            const paidPlan = plans.find(plan => plan.price > 0);
            if (paidPlan) {
                return paidPlan;
            }
        }
        
        const freePlan = plans.find(plan => plan.price === 0);
        return freePlan;
    };

    const currentPlan = getCurrentPlan();
    const isSubscribed = user?.subscription?.isActive || false;
    const isOnPremiumPlan = currentPlan && currentPlan.price > 0;

    const getUserPlanStatus = (plan) => {
        if (!user?._id) {
            return {
                isCurrentPlan: false,
                message: plan.price === 0 ? "Get Started for Free" : plan.name.toLowerCase().includes('test') ? "Try Test Plan" : "Go Premium",
                showDates: false,
                buttonStyle: "bg-slate-600 text-white hover:bg-slate-700"
            };
        }

        const isCurrentPlan = currentPlan && String(currentPlan._id) === String(plan._id);
        
        if (isCurrentPlan) {
            return {
                isCurrentPlan: true,
                message: "✓ Current Plan",
                showDates: true,
                buttonStyle: "bg-blue-900 text-white cursor-not-allowed"  // Changed to blue-900
            };
        } else {
            if (plan.price === 0) {
                return {
                    isCurrentPlan: false,
                    message: plan.name.toLowerCase().includes('test') ? "Go Test" : "Go Free",
                    showDates: false,
                    buttonStyle: "bg-slate-600 text-white hover:bg-slate-700"
                };
            } else {
                return {
                    isCurrentPlan: false,
                    message: "Go Premium",
                    showDates: false,
                    buttonStyle: "bg-slate-600 text-white hover:bg-slate-700"
                };
            }
        }
    };

    const handlePlanAction = (plan) => {
        if (!user?._id) {
            toast("Please login first");
            router.push("/login");
            return;
        }

        const planStatus = getUserPlanStatus(plan);
        
        if (planStatus.isCurrentPlan) {
            return;
        }

        handlePlanSwitch(plan);
    };

    if (loading) {
        return (
            <div className="bg-gray-50 py-12 px-4 md:px-10 lg:px-20">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-900 mb-4">Loading Subscription Plans...</h1>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4">
            <Toaster position="top-right" />
            
            <div className="text-center mb-16 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Choose Your Perfect Plan
                </h1>
                <p className="text-xl text-gray-600">
                    Select the subscription that works best for you
                </p>
            </div>

            {/* EQUAL HEIGHT CARDS WITH ALIGNED BUTTONS */}
            <div className="max-w-7xl mx-auto">
                <div className={`grid gap-8 ${
                    plans.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 
                    plans.length === 2 ? 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto' :
                    'grid-cols-1 md:grid-cols-3'
                }`}>
                    {plans.map((plan) => {
                        const planStatus = getUserPlanStatus(plan);
                        const isProcessingThisPlan = processingPlanId === plan._id;
                        const decodedDescription = decodeHtmlEntities(plan.description);

                        return (
                            <div key={plan._id} className="relative h-full">
                                {/* CURRENT PLAN BADGE - BLUE-900 */}
                                {planStatus.isCurrentPlan && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                                        <span className="bg-blue-900 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                                            ✓ Current Plan
                                        </span>
                                    </div>
                                )}
                                
                                {/* FLEX CARD FOR EQUAL HEIGHT AND BUTTON ALIGNMENT */}
                                <div 
                                    className={`bg-white rounded-2xl overflow-hidden shadow-lg h-full flex flex-col
                                        ${planStatus.isCurrentPlan
                                            ? "outline outline-2 outline-blue-900 shadow-xl transform scale-105"  // Changed to blue-900
                                            : ""
                                        } transition-all duration-300 hover:shadow-xl`}
                                >
                                    {/* CARD CONTENT - FLEXIBLE GROW */}
                                    <div className="p-6 flex-grow" style={{ 
                                        '--card-border': 'none', 
                                        '--card-shadow': 'none',
                                        '--box-shadow': 'none',
                                        'border': 'none'
                                    }}>
                                        <div
                                            className="modified-plan-content h-full"
                                            dangerouslySetInnerHTML={{ __html: decodedDescription }}
                                            style={{
                                                '--card-border': 'none',
                                                '--box-shadow': 'none',
                                                'boxShadow': 'none',
                                                'border': 'none',
                                                'borderRadius': '0'
                                            }}
                                        />
                                    </div>

                                    {/* SUBSCRIPTION DATES - BLUE-900 THEME */}
                                    {planStatus.showDates && (
                                        <div className="px-6 pb-4">
                                            <div className="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-md">
                                                {user?.subscription?.startDate && (
                                                    <p className="text-sm text-blue-900 mb-2">
                                                        <span className="font-semibold">Subscription started on:</span>{" "}
                                                        {formatDate(user.subscription.startDate)}
                                                    </p>
                                                )}
                                                <p className="text-sm text-blue-900 font-medium">
                                                    <span className="font-semibold">Subscription ends on:</span>{" "}
                                                    {user?.subscription?.expiryDate
                                                        ? formatDate(user?.subscription?.expiryDate)
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* BUTTON - FIXED AT BOTTOM */}
                                    <div className="p-6 pt-0 mt-auto">
                                        <button
                                            onClick={() => handlePlanAction(plan)}
                                            disabled={planStatus.isCurrentPlan || isProcessingThisPlan}
                                            className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                                                planStatus.isCurrentPlan
                                                    ? "bg-blue-900 text-white cursor-not-allowed"  // Changed to blue-900
                                                    : isProcessingThisPlan
                                                        ? "bg-gray-400 text-white cursor-wait"
                                                        : planStatus.buttonStyle
                                            }`}
                                        >
                                            {isProcessingThisPlan
                                                ? "Processing..."
                                                : planStatus.message}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Enhanced Why Choose Premium Section - BLUE-900 */}
            <div className="mt-20 bg-white border border-gray-200 shadow-lg p-8 rounded-2xl max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Choose Premium?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">✨</span>
                        <span className="text-gray-700">Premium unlocks full access, audio versions, and an enjoyable reading experience.</span>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">📚</span>
                        <span className="text-gray-700">Stay ahead with in-depth analysis of hot topics and curated arguments.</span>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">🙌</span>
                        <span className="text-gray-700">Get an ad-free, distraction-free reading experience.</span>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">🌟</span>
                        <span className="text-gray-700">Be part of a community that shapes conversations.</span>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    {!user?._id ? (
                        <button
                            onClick={() => router.push("/login")}
                            className="px-8 py-4 bg-blue-900 text-white text-lg font-bold rounded-xl shadow-md hover:bg-blue-800 transition-colors"
                        >
                            Login to Subscribe
                        </button>
                    ) : isOnPremiumPlan ? (
                        <div className="text-center">
                            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white text-lg font-bold rounded-xl shadow-lg">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                🎉 You're Premium!
                            </div>
                            <p className="text-gray-600 mt-3 text-sm">
                                Enjoying all premium benefits until{" "}
                                {user?.subscription?.expiryDate
                                    ? formatDate(user?.subscription?.expiryDate)
                                    : "N/A"}
                            </p>
                        </div>
                    ) : (
                        <button
                            className={`px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white text-lg font-bold rounded-xl shadow-md hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 ${
                                processingPlanId || !razorpayLoaded ? "opacity-70 cursor-wait" : ""
                            }`}
                            onClick={() => {
                                const premiumPlan = plans.find(p => p.price > 0);
                                if (premiumPlan) handlePlanSwitch(premiumPlan);
                            }}
                            disabled={processingPlanId || !razorpayLoaded || !plans.some(p => p.price > 0)}
                        >
                            {!razorpayLoaded ? (
                                "Loading..."
                            ) : processingPlanId ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                    Upgrade to Premium
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Add CSS to prevent nested card appearance
const styleElement = typeof document !== 'undefined' ? document.createElement('style') : null;
if (styleElement) {
    styleElement.textContent = `
        .modified-plan-content > div,
        .modified-plan-content > div > div {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
        }
        .modified-plan-content ul {
            list-style: none;
            padding-left: 0;
        }
        .modified-plan-content ul li {
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
        }
    `;
    document.head.appendChild(styleElement);
}

export default SubscriptionPage;
