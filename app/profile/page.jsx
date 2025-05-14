"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";
import toast from "react-hot-toast";

// Imported components
import ProfileHeader from "./Header";
import ProfileSidebar from "./ProfileSidebar";
import ActivitySummary from "./ActivitySummary";
import FavoriteCategories from "./FavoriteCategories";
import EditProfileModal from "./EditProfileModal";

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useAtom(userAtom);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        if (!user._id) {
            console.log("navigating to login");
            router.push("/login");
        }
    }, [user]);

    const handleLogout = async () => {
        setUser({})
        localStorage.removeItem("token")
        toast.success("Logged out")
    };

    // Open edit profile modal
    const openProfileModal = () => {
        setIsProfileModalOpen(true);
    };

    // Close edit profile modal
    const closeProfileModal = () => {
        setIsProfileModalOpen(false);
    };

    if (!user._id) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {user?._id && (
                <div>
                    <ProfileHeader router={router} />

                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left sidebar */}
                            <div className="lg:w-[30%]">
                                <ProfileSidebar 
                                    user={user} 
                                    openProfileModal={openProfileModal} 
                                    handleLogout={handleLogout} 
                                />
                            </div>

                            {/* Main content */}
                            <div className="lg:w-[65%]">
                                <ActivitySummary />
                                <FavoriteCategories user={user} setUser={setUser} />
                            </div>
                        </div>
                    </div>

                    {/* Render Edit Profile Modal component */}
                    <EditProfileModal
                        isOpen={isProfileModalOpen}
                        onClose={closeProfileModal}
                        userInfo={user}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfilePage;