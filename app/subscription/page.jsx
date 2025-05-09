"use client"
import React, { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";
import toast from "react-hot-toast";
import axios from "axios";
import formatDate from "../utils/dateFormat";
import { useRouter } from "next/navigation";
import Script from "next/script";
import authHeader from "../utils/authHeader";

const plans = [
    {
        id: "free",
        title: "Always Free Plan",
        price: "$0/year",
        features: [
            "Full access to Free Wribates",
            "Start 2 Wribates per month",
            "Lead 2 Wribates per month",
            "Limited participation in Sponsored Wribates",
            "Comment on articles",
        ],
        buttonText: "Get Started for Free",
        buttonStyle: "bg-primary text-white hover:bg-blue-600",
    },
    {
        id: "premium",
        title: "Premium Plan",
        price: "$20/year",
        subtitle: "(50% off for the first year!)",
        features: [
            "Unlimited access to all Wribates",
            "Start 5 Wribates per month",
            "Unlimited Wribate leadership",
            "Full access to Sponsored Wribates",
            "Listen to sponsored audio versions",
            "Propose your own Wribates",
            "Start Wribates as an institution",
            "Ad-free experience",
            "Full participation and invites",
        ],
        buttonText: "Go Premium",
        buttonStyle: "bg-primary text-white hover:bg-purple-600",
    },
];

const SubscriptionPage = () => {
    const [user] = useAtom(userAtom);
    const [orderId, setOrderId] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const handleOrder = async () => {
        if (!user?._id) {
            toast.error("Please login first");
            router.push("/login");
            return;
        }

        try {
            setIsProcessing(true);

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/createOrder`,
                { amount: 1700 },
                { withCredentials: true,
                    headers: authHeader()
                 }
            );

            const data = res.data;

            if (data.res) {
                const razorpayOrderId = data.razorpayOrderId;
                setOrderId(razorpayOrderId);

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                    amount: data.amount * 100, // in paise
                    currency: "INR",
                    name: "Wribate",
                    description: "Premium Subscription",
                    order_id: orderId,
                    handler: function (response) {
                        console.log("Payment Success:", response);
                        toast.success("Payment successful! Updating your subscription...");
                        // You would typically verify the payment here and update the user's subscription
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
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
                            setIsProcessing(false);
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                toast.error("Failed to create payment order");
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error(error?.response?.data?.message || "Error occurred while creating order");
            setIsProcessing(false);
        }
    };

    // Check if user is subscribed (premium)
    const isSubscribed = user?.subscription?.isActive || false;
    console.log(isSubscribed, user)

    // Determine subscription status for UI display
    const getUserPlanStatus = (planId) => {
        if (!user?._id) {
            return {
                isCurrentPlan: false,
                message: planId === "free" ? "Get Started for Free" : "Go Premium",
                showDates: false,
            };
        }

        if (planId === "free") {
            if (isSubscribed) {
                return {
                    isCurrentPlan: false,
                    message: "Free Plan (Upgraded)",
                    showDates: false,
                };
            } else {
                return {
                    isCurrentPlan: true,
                    message: "You are using this plan",
                    showDates: false,
                };
            }
        } else if (planId === "premium") {
            if (isSubscribed) {
                return {
                    isCurrentPlan: true,
                    message: "You are using this plan",
                    showDates: true,
                    startDate: user.subscription.startDate,
                    expiryDate: user.subscription.expiryDate,
                };
            } else {
                return {
                    isCurrentPlan: false,
                    message: "Go Premium",
                    showDates: false,
                };
            }
        }
    };

    const handlePlanAction = (planId) => {
        if (!user?._id) {
            if (planId === "free") {
                toast.info("Please login or signup to use the free plan");
                router.push("/login");
            } else {
                toast.info("Please login first to subscribe");
                router.push("/login");
            }
            return;
        }

        if (planId === "premium" && !isSubscribed) {
            handleOrder();
        }
    };

    return (
        <div className="bg-gray-50 py-12 px-4 md:px-10 lg:px-20">
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
            />
            {/* Header Section */}
            <div className="text-center mb-12 max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                    🎉 Limited-Time Offer: Get 50% Off Your First Year!
                </h1>
                <p className="text-lg text-gray-600 mt-4">
                    Subscribe today for just <span className="font-bold">$20/year</span>{" "}
                    instead of <span className="line-through">$40/year</span>!
                </p>
                <p className="text-md text-gray-500 mt-2">
                    That's just $1.67 per month for premium features!
                </p>
            </div>

            {/* Pricing Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {plans.map((plan, index) => {
                    const planStatus = getUserPlanStatus(plan.id);

                    return (
                        <div
                            key={index}
                            className={`bg-white shadow-lg rounded-lg overflow-hidden 
                                ${planStatus.isCurrentPlan
                                    ? "border-2 border-primary ring-2 ring-primary"
                                    : "border border-gray-200"
                                } flex flex-col h-full transition-all hover:shadow-xl`}
                        >
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold text-primary">
                                        {plan.title}
                                    </h2>
                                    {planStatus.isCurrentPlan && (
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                            Current Plan
                                        </span>
                                    )}
                                </div>
                                <p className="text-2xl font-semibold text-gray-800 mb-1">
                                    {plan.price}
                                </p>
                                {plan.subtitle && (
                                    <p className="text-sm text-gray-500 mb-4">{plan.subtitle}</p>
                                )}

                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center">
                                            <span className="w-5 h-5 mr-2 bg-green-500 text-white flex items-center justify-center rounded-full text-xs">
                                                ✓
                                            </span>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {planStatus.showDates && (
                                <div className="bg-blue-50 p-4 mx-6 rounded-md mb-4">
                                    <p className="text-sm text-blue-800">
                                        <span className="font-medium">Start Date:</span>{" "}
                                        {user?.subscription?.startDate
                                            ? formatDate(user?.subscription?.startDate)
                                            : "N/A"}
                                    </p>
                                    <p className="text-sm text-blue-800">
                                        <span className="font-medium">Expiry Date:</span>{" "}
                                        {user?.subscription?.expiryDate
                                            ? formatDate(user?.subscription?.expiryDate)
                                            : "N/A"}
                                    </p>
                                    <p className="text-sm text-blue-800">
                                        <span className="font-medium">Duration:</span>{" "}
                                        {user?.subscription?.durationInDays
                                            ? `${user.subscription.durationInDays} days`
                                            : "N/A"}
                                    </p>
                                </div>
                            )}

                            <div className="p-6 pt-2">
                                <button
                                    onClick={() => handlePlanAction(plan.id)}
                                    disabled={planStatus.isCurrentPlan || isProcessing}
                                    className={`w-full py-3 rounded-lg text-lg font-semibold 
                                        ${planStatus.isCurrentPlan
                                            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                                            : isProcessing
                                                ? "bg-gray-400 text-white cursor-wait"
                                                : plan.buttonStyle
                                        } transition-colors`}
                                >
                                    {isProcessing
                                        ? "Processing..."
                                        : planStatus.isCurrentPlan
                                            ? "Current Plan"
                                            : planStatus.message}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Why Go Premium Section */}
            <div className="mt-16 bg-white border border-primary shadow-lg p-8 rounded-lg max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-primary mb-4">Why Go Premium?</h2>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                        <span className="text-xl mr-2">🎉</span>
                        <span>Upgrade now and enjoy 50% OFF your first year!</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-xl mr-2">✨</span>
                        <span>Premium unlocks full access, audio versions, and an enjoyable reading experience.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-xl mr-2">📚</span>
                        <span>Stay ahead with in-depth analysis of hot topics, curated arguments & exclusive Wribates.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-xl mr-2">🙌</span>
                        <span>Get an ad-free, distraction-free reading experience.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-xl mr-2">🌟</span>
                        <span>Be part of a community that shapes conversations.</span>
                    </li>
                </ul>

                <div className="mt-8 flex justify-center">
                    {!user || (user && !isSubscribed) ? (
                        <button
                            className={`px-8 py-4 bg-primary text-white text-lg font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors ${isProcessing ? "opacity-70 cursor-wait" : ""}`}
                            onClick={handleOrder}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing..." : "Subscribe Now"}
                        </button>
                    ) : (
                        <div className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg text-center">
                            You're already enjoying Premium benefits!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;