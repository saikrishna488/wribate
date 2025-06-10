import React, { useEffect, useState } from 'react'
import httpRequest from '../../../utils/httpRequest'
import axios from 'axios'
import { useAtom } from 'jotai';
import { userAtom } from '@/app/states/GlobalStates';
import { useRouter } from 'next/navigation';

const Comments = ({id}) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user] = useAtom(userAtom);
    const router = useRouter();

    const fetchComments = async() => {
        try {
            const data = await httpRequest(axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'/blog/comments/'+id))
            setComments(data.comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    const handleSubmitComment = async(e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        if(!user?._id){
            toast.error("Login to comment!")
            return
        }
        
        setIsSubmitting(true);
        try {
            // Replace with your actual API endpoint for posting comments
            await httpRequest(axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+'/blog/comments', {
                blog_id: id,
                user_id: user?._id,
                text: newComment
            }));
            
            setNewComment('');
            fetchComments(); // Refresh comments after posting
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const getInitials = (username) => {
        return username ? username.charAt(0).toUpperCase() : '?';
    }

    const getTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        
        const now = new Date();
        const commentTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - commentTime) / 1000);
        
        if (diffInSeconds < 60) {
            return `${diffInSeconds}s ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months}mo ago`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `${years}y ago`;
        }
    }

    useEffect(() => {
        fetchComments();
    }, [])

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Comments ({comments.length})
            </h3>
            
            {/* New Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-8 bg-gray-50 p-6 rounded-lg border">
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Add a comment
                    </label>
                    <textarea
                        id="comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
            </form>

            {/* Comments List */}
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                {comments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-lg">No comments yet</p>
                        <p className="text-sm">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id || comment._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-start space-x-4">
                                {/* Profile Photo or Initial */}
                                <div onClick={()=>router.push('/profile/'+comment?.user_id?.userName)} className="flex-shrink-0">
                                    {comment.user_id?.profilePhoto ? (
                                        <img
                                            src={comment.user_id.profilePhoto}
                                            alt={`${comment.user_id.username}'s profile`}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                            {getInitials(comment.user_id?.username)}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Comment Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h4 className="font-semibold text-gray-900 text-sm">
                                            {comment.user_id?.username || 'Anonymous'}
                                        </h4>
                                        <span className="text-xs text-gray-500">
                                            {getTimeAgo(comment.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {comment.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Comments