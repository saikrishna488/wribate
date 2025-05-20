import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    User,
    MessageSquare,
    Trophy,
    ThumbsUp,
    ThumbsDown,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import axios from "axios";
import { useAtom } from "jotai";
import { chatAtom, debateAtom } from "../../states/GlobalStates";

export default function LaunchDialog({ isOpen, onClose, debate }) {
    const [isInviting, setIsInviting] = useState({});
    const router = useRouter();
    const [lastId, setLastId] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [chatUser, setChatUser] = useAtom(chatAtom);

    const fetchUsers = async (isInitial = false) => {
        if (isLoading) return;
        
        try {
            setIsLoading(true);
            const currentLastId = isInitial ? null : lastId;
            
            const res = await axios.get(
                process.env.NEXT_PUBLIC_BACKEND_URL + 
                '/getusers?wribateId=' + encodeURIComponent(debate._id) + 
                '&lastId=' + encodeURIComponent(currentLastId || '')
            );

            const data = res.data;

            if (data.res) {
                const newUsers = data.users || [];
                
                if (isInitial) {
                    setUsers(newUsers);
                } else {
                    setUsers(prevUsers => [...prevUsers, ...newUsers]);
                }
                
                const newLastId = newUsers?.[newUsers.length - 1]?._id;
                setLastId(newLastId || null);
                
                // Check if there are more users to load
                setHasMore(newUsers.length > 0 && newLastId);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to load users");
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && debate?._id) {
            // Reset state when dialog opens
            setUsers([]);
            setLastId(null);
            setHasMore(true);
            fetchUsers(true);
        }
    }, [isOpen, debate?._id]);

    const handleInviteUser = async (userId,title,message) => {
        setChatUser({
            _id:userId,
            title,
            message
        })
        router.push('/messages')
    };

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            fetchUsers(false);
        }
    };

    // Handle backdrop click to close dialog
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(false);
        }
    };

    // Prevent dialog from closing when clicking inside
    const handleDialogClick = (e) => {
        e.stopPropagation();
    };

    const UserCard = ({ user }) => {
        const sideColor = user.side === "for" ? "text-red-600" : "text-blue-600";
        const sideBg = user.side === "for" ? "bg-red-50" : "bg-blue-50";

        return (
            <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                    {/* User avatar */}
                    {user.profilePhoto ? (
                        <div 
                            onClick={() => router.push('/profile/' + user.username)} 
                            className="w-12 h-12 overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                        >
                            <Image
                                src={user.profilePhoto}
                                alt={user.name || "User"}
                                width={48}
                                height={48}
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div 
                            onClick={() => router.push('/profile/' + user.username)} 
                            className="w-12 h-12 flex justify-center items-center bg-gray-100 border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                        >
                            <User size={24} className="text-gray-600" />
                        </div>
                    )}

                    {/* User details */}
                    <div className="flex-1">
                        <div className="font-bold text-base text-gray-900">{user.name || "Anonymous"}</div>
                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                                {/* <Trophy size={14} className="text-yellow-600" /> */}
                                {/* <span className="text-sm font-medium text-gray-600">{user.wins || 0} Participated</span> */}
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded ${sideBg}`}>
                                {user.side === "for" ? (
                                    <ThumbsUp size={12} className={sideColor} />
                                ) : (
                                    <ThumbsDown size={12} className={sideColor} />
                                )}
                                <span className={`text-xs font-medium ${sideColor}`}>
                                    {user.side === "for" ? "Supporting" : "Opposing"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message button */}
                <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors"
                    onClick={() => handleInviteUser(user._id, debate.title, "Let's Debate on this topic")}
                    disabled={isInviting[user._id]}
                >
                    <MessageSquare size={16} />
                    {isInviting[user._id] ? "Sending..." : "Message"}
                </Button>
            </div>
        );
    };

    if (!debate || !isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white max-h-full h-4/5 sm:max-w-2xl lg:max-w-4xl w-full flex flex-col overflow-hidden"
                onClick={handleDialogClick}
            >
                {/* Scrollable content container */}
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Wribate Overview
                        </h2>
                        <button
                            onClick={() => onClose(false)}
                            className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 rounded"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Debate details card */}
                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-start gap-4 mb-4">
                            {debate.profilePhoto ? (
                                <div className="w-14 h-14 overflow-hidden border-2 border-gray-300">
                                    <Image
                                        src={debate.profilePhoto}
                                        alt={debate.username || "User"}
                                        width={56}
                                        height={56}
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-14 h-14 flex justify-center items-center bg-white border-2 border-gray-300">
                                    <User size={28} className="text-gray-600" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="font-bold text-lg text-gray-900">{debate.username || "Anonymous"}</div>
                                <div className="text-sm text-gray-600 mb-2">{debate.country || "Global"}</div>

                                <div className="flex flex-wrap gap-2">
                                    {debate.category && (
                                        <Badge className="bg-blue-900 text-white border-0 font-medium">
                                            {debate.category}
                                        </Badge>
                                    )}
                                    {debate.tags && Array.isArray(debate.tags) && debate.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="border-gray-300 text-gray-700 bg-white">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <h3 className="font-bold text-xl mb-3 text-gray-900 leading-tight">
                            {debate.title || "Untitled Debate"}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {debate.context || "No context provided"}
                        </p>
                    </div>

                    {/* Users section header */}
                    <div className="px-6 py-4 bg-white border-b border-gray-200">
                        <h4 className="font-bold text-lg text-gray-900">
                            Voters
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                            Users who have taken a stance on this wribate
                        </p>
                    </div>

                    {/* Users list */}
                    <div className="flex-1 bg-white">
                        <div className="divide-y divide-gray-200">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <UserCard key={user._id} user={user} />
                                ))
                            ) : !isLoading ? (
                                <div className="flex justify-center items-center h-32 text-gray-500">
                                    <div className="text-center">
                                        <User size={32} className="mx-auto mb-2 text-gray-400" />
                                        <p>No participants yet</p>
                                    </div>
                                </div>
                            ) : null}
                            
                            {/* Loading state */}
                            {isLoading && (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 size={24} className="animate-spin text-blue-600" />
                                    <span className="ml-2 text-gray-600">Loading users...</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Load More Button */}
                        {!isLoading && hasMore && users.length > 0 && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <Button
                                    onClick={handleLoadMore}
                                    variant="outline"
                                    className="w-full border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors"
                                    disabled={isLoading}
                                >
                                    Load More Users
                                </Button>
                            </div>
                        )}
                        
                        {/* No more users message */}
                        {!isLoading && !hasMore && users.length > 0 && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <p className="text-center text-gray-500 text-sm">
                                    No more users to load
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}