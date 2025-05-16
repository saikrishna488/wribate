"use client"
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "../../states/GlobalStates";
import toast from "react-hot-toast";
import axios from "axios";

// Imported components
import ProfileHeader from "../../components/profile/username/Header";
import ProfileSidebar from "../../components/profile/username/ProfileSidebar";
import ActivitySummary from "../../components/profile/username/ActivitySummary";
import FavoriteCategories from "../../components/profile/username/FavoriteCategories";

const ProfilePage = () => {
    const router = useRouter();
    const { username } = useParams();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile/${username}`);
                const data = res.data;
                
                if (data.res) {
                    setUser(data.user);
                } else {
                    setError("User not found");
                    toast.error("User not found");
                }
            } catch (err) {
                console.log(err);
                setError("Failed to load profile");
                toast.error("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };
        
        if (username) {
            fetchUser();
        }
    }, [username]);

    if (isLoading) {
        return (
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="text-center p-8 bg-white shadow-md border-t-4 border-blue-900  w-full">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                    </div>
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading profile information...</p>
                    <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the user data</p>
                </div>
            </div>
        );
    }

    if (error || !user._id) {
        return (
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="text-center p-8 bg-white shadow-md border-t-4 border-red-500  w-full">
                    <div className="flex justify-center mb-4">
                        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Profile not found</h2>
                    <p className="mt-2 text-gray-600">The requested profile could not be loaded or doesn't exist.</p>
                    <button 
                        className="mt-6 px-6 py-3 bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors "
                        onClick={() => router.push('/')}
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <ProfileHeader router={router} />
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left sidebar */}
                    <div className="lg:w-[30%]">
                        <ProfileSidebar
                            user={user}
                            isPublicView={true}
                        />
                    </div>
                    
                    {/* Main content */}
                    <div className="lg:w-[65%]">
                        <ActivitySummary userId={user._id} user={user} isPublicView={true} />
                        <FavoriteCategories user={user} isPublicView={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;