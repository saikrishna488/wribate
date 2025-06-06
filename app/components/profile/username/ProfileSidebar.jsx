"use client"
import React from "react";
import Link from "next/link";
import formatDate from "../../../utils/dateFormat";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaComment, FaUniversity } from "react-icons/fa";
import { useAtom } from "jotai";
import { chatAtom } from "@/app/states/GlobalStates";
import { useRouter } from "next/navigation";

const ProfileSidebar = ({ user }) => {
    
    const router = useRouter();
    
    const [,setChatUser] = useAtom(chatAtom);
    
    const handleMessage = ()=>{
        setChatUser({_id:user._id})
        router.push('/messages');
    }
    
    return (
        <div className="bg-white shadow-md p-6 border-t-4 border-blue-900">
            <div className="flex items-center mb-6">
                <div className="overflow-hidden w-24 h-24 relative border-4 rounded-full border-blue-900">
                    <div className="w-full h-full">
                        <img
                            src={user?.profilePhoto || "/user.png"}
                            alt={user?.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </div>
                <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                    <p className="text-blue-600 font-medium">@{user?.userName}</p>
                </div>
            </div>

            <div className="border-b border-gray-200 pb-4 mb-4">
                {/* Bio */}
                <p className="text-gray-700 mb-4">{user?.bio || "No bio available"}</p>
                
                {/* User Info with Icons - Aligned */}
                <div className="space-y-2">
                    <div className="flex items-center">
                        <FaUser className="text-blue-900 w-5 h-5 mr-3" />
                        <p className="text-gray-700">{user?.name}</p>
                    </div>
                    
                    {user?.country && (
                        <div className="flex items-center">
                            <FaMapMarkerAlt className="text-blue-900 w-5 h-5 mr-3" />
                            <p className="text-gray-700">{user?.country}</p>
                        </div>
                    )}
                    
                    {user?.institution && (
                        <div className="flex items-center">
                            <FaUniversity className="text-blue-900 w-5 h-5 mr-3" />
                            <p className="text-gray-700">{user?.institution}</p>
                        </div>
                    )}
                    
                    {user?.dob && (
                        <div className="flex items-center">
                            <FaCalendarAlt className="text-blue-900 w-5 h-5 mr-3" />
                            <p className="text-gray-700">{formatDate(user?.dob)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Message button for public profiles */}
            <nav className="mt-8 border-t border-gray-200 pt-6">
                <ul className="space-y-4">
                    <li>
                        <button
                            onClick={handleMessage}
                            className="w-full p-3 flex justify-center bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors"
                        >
                            <FaComment className="w-5 h-5 mr-2" />
                            Message
                        </button>
                    </li>
                    <li>
                        <Link
                            href={`/wribates?user=${user?._id}`}
                            className="w-full p-3 flex justify-center bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                        >
                            View Wribates
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ProfileSidebar;