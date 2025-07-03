// 'use client';

import React, { useEffect, useState, useCallback } from 'react'
import formatDate, { timeAgo } from "../../utils/dateFormat";
import { FaThumbsUp, FaComments } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
    useAddCommentMutation,
} from "../../../app/services/authApi";
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { chatAtom } from '@/app/states/GlobalStates';
import { useRouter } from 'next/navigation';
import httpRequest from '@/app/utils/httpRequest';
import axios from 'axios';

const Comments = ({ wribate, scrollContainerRef, user, id, refetch }) => {
    const [message, setMessage] = useState("");
    const [voteSelection, setVoteSelection] = useState(null);
    const [addComment, { isLoading: addingComment }] = useAddCommentMutation();
    const [chatUser, setChatUser] = useAtom(chatAtom);
    const router = useRouter();
    const [comments, setComments] = useState([]);
    const [lastId, setLastId] = useState("");
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [loadingOlderComments, setLoadingOlderComments] = useState(false);

    // Fetch comments
    const fetchComments = async (isLoadingMore = false) => {
        try {
            const currentLastId = isLoadingMore ? lastId : "";
            const data = await httpRequest(
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getcomments/${wribate._id}?last_id=${currentLastId}`)
            );
            
            if (data.comments && data.comments.length > 0) {
                if (isLoadingMore) {
                    // Append older comments to the end of the array
                    setComments(prevComments => [...prevComments, ...data.comments]);
                } else {
                    setComments(data.comments);
                }
                
                // Set the last_id from the last comment in the response (oldest)
                const newLastId = data.comments[data.comments.length - 1]._id;
                setLastId(newLastId);
                
                // Check if there are more comments to load
                setHasMoreComments(data.comments.length >= 10); // Assuming 10 is your page size
            } else {
                if (!isLoadingMore) {
                    setComments([]);
                }
                setHasMoreComments(false);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to load comments');
        }
    };

    const loadOlderComments = useCallback(async () => {
        if (!hasMoreComments || loadingOlderComments) return;
        
        setLoadingOlderComments(true);
        await fetchComments(true);
        setLoadingOlderComments(false);
    }, [hasMoreComments, loadingOlderComments, lastId]);

    // Handle scroll to bottom
    const handleScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10;
        
        if (isScrolledToBottom && hasMoreComments && !loadingOlderComments) {
            loadOlderComments();
        }
    }, [hasMoreComments, loadingOlderComments, loadOlderComments]);

    useEffect(() => {
        fetchComments();
    }, []);

    // Add scroll listener
    useEffect(() => {
        const scrollContainer = scrollContainerRef?.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    const handleVote = (vote) => {
        setVoteSelection(vote);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user?._id) {
            showLoginAlert();
            return;
        }

        const data = { text: message, type: voteSelection };
        try {
            const response = await addComment({ id:wribate._id, data });
            if (response?.data?.status === "success") {
                setMessage("");
                setVoteSelection(null); // Reset vote selection
                // Reset pagination and fetch fresh comments
                setLastId("");
                setHasMoreComments(true);
                await fetchComments();
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to post comment');
        }
    };

    const handleChat = (userId) => {
        console.log(userId);
        if (user?._id == userId) {
            return;
        }
        setChatUser({
            _id: userId,
            title: wribate?.title
        });
        router.push(`/messages`);
    };

    // Functions
    const showLoginAlert = () => {
        toast.error("Login to continue!");
        router.push('/login');
    };

    return (
        <div className="bg-white border border-gray-200 shadow-sm mb-4 sm:mb-6 rounded-sm">
            {/* SECTION HEADER WITH SCROLL INDICATOR */}
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold">Comments</h2>
                    <div className="text-sm text-gray-500">
                        <span className="hidden sm:inline">
                            #{typeof window !== 'undefined' && window.location.hash === '#comments' ? 'You are here' : 'comments'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Comment List */}
            <div
                className="max-h-80 sm:max-h-96 overflow-y-auto w-full p-3 sm:p-4 space-y-3 sm:space-y-4"
                ref={scrollContainerRef}
            >
                {comments && comments?.length > 0 ? (
                    <>
                        {comments.map((comment, index) => (
                            <div 
                                key={comment._id || index} 
                                className={`flex w-full ${comment.type === "For" ? "justify-start" : "justify-end"}`}
                            >
                                <div className="max-w-full sm:max-w-md">
                                    <div className={`flex items-center mb-1 ${comment.type === "For" ? "justify-start" : "justify-end"}`}>
                                        <div className={`text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold ${comment.type === "For" ? "bg-red-500" : "bg-blue-500"}`}>
                                            {comment?.userId?.name?.slice(0, 2)}
                                        </div>
                                        <span className="ml-2 font-semibold text-xs sm:text-sm">
                                            {comment?.userId?.name}
                                        </span>
                                        <span className="ml-2 text-xs text-gray-500">
                                            {timeAgo(comment.createdAt)}
                                        </span>
                                    </div>

                                    <div className={`rounded-sm border p-2 sm:p-3 ${comment.type === "For"
                                        ? "bg-red-50 border-red-100"
                                        : "bg-blue-50 border-blue-100"
                                    }`}>
                                        <p className="text-xs sm:text-sm">{comment.text}</p>
                                    </div>

                                    <div className={`flex mt-1 sm:mt-2 gap-3 sm:gap-4 text-xs ${comment.type === "For" ? "justify-start" : "justify-end"}`}>
                                        {user?._id !== comment?.userId?._id && (
                                            <button
                                                className="flex items-center text-gray-500 hover:text-gray-700"
                                                onClick={() => handleChat(comment?.userId?._id)}
                                            >
                                                <FaComments size={10} className="mr-1" /> Reply
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Loading indicator */}
                        {loadingOlderComments && (
                            <div className="flex justify-center py-4">
                                <div className="text-sm text-gray-500">Loading older comments...</div>
                            </div>
                        )}
                        
                        {/* No more comments message */}
                        {!hasMoreComments && comments.length > 0 && (
                            <div className="flex justify-center py-4 border-t border-gray-100">
                                <div className="text-sm text-gray-500">No more comments to load</div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-3 sm:p-4 text-center text-gray-500 text-sm sm:text-base">
                        No comments yet. Be the first to comment!
                    </div>
                )}
            </div>

            {/* Comment Input */}
            <div className="border-t border-gray-200 p-3 sm:p-4">
                <div className="flex flex-col space-y-3">
                    <input
                        type="text"
                        placeholder="Type your comment..."
                        className="w-full p-2 sm:p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex gap-2">
                            <button
                                className={`px-3 sm:px-4 py-2 border text-xs sm:text-sm flex-1 sm:flex-none ${voteSelection === "For"
                                    ? "bg-red-100 border-red-500 text-red-700"
                                    : "bg-gray-50 border-gray-300"
                                }`}
                                onClick={() => handleVote("For")}
                            >
                                For
                            </button>

                            <button
                                className={`px-3 sm:px-4 py-2 border text-xs sm:text-sm flex-1 sm:flex-none ${voteSelection === "Against"
                                    ? "bg-blue-100 border-blue-500 text-blue-700"
                                    : "bg-gray-50 border-gray-300"
                                }`}
                                onClick={() => handleVote("Against")}
                            >
                                Against
                            </button>
                        </div>

                        <Button
                            onClick={handleAddComment}
                            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm"
                            disabled={!message || !voteSelection || addingComment}
                        >
                            {addingComment ? 'Posting...' : 'Post Comment'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comments;