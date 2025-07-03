'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userAtom } from '@/app/states/GlobalStates';
import { initializeSocket } from '../../../lib/socket'

export default function NotificationsDropdown() {
    const [user] = useAtom(userAtom);
    const router = useRouter();

    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationLoading, setNotificationLoading] = useState(false);
    const notificationRef = useRef(null);




    useEffect(() => {
        if (!user?._id || typeof window === 'undefined') return;

        try {
            const socket = initializeSocket();
            socket.connect();

            socket.on("notificationCount", (count) => {
                setNotificationCount(count || 0);
            });

            socket.on("notification", (data) => {
                console.log("New notification received:", data);
                setNotifications((prev) => [...prev, data]);
            });

            return () => {
                socket.off("notificationCount");
                socket.disconnect();
            };
        } catch (error) {
            console.error("Failed to connect socket:", error);
        }
    }, [user?._id]);




    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch notification count on mount and set up polling
    useEffect(() => {
        if (user?._id) {
            fetchNotificationCount();
            const interval = setInterval(fetchNotificationCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user?._id]);

    // Make refresh function globally accessible for chat notifications
    useEffect(() => {
        window.refreshNotificationCount = fetchNotificationCount;
        return () => {
            delete window.refreshNotificationCount;
        };
    }, []);

    const fetchNotificationCount = async () => {
        if (!user?._id) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/count/${user._id}`);
            const data = await response.json();
            setNotificationCount(data.count || 0);
        } catch (error) {
            console.error('Failed to fetch notification count:', error);
        }
    };

    const fetchNotifications = async () => {
        if (!user?._id) return;
        setNotificationLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/${user._id}`);
            const data = await response.json();
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setNotificationLoading(false);
        }
    };

    const toggleNotifications = async () => {
        if (!showNotifications) {
            await fetchNotifications();

            // Mark all as read when opening (optional - you can remove this if you want manual marking)
            if (notificationCount > 0) {
                await markAllAsRead();
            }
        }
        setShowNotifications(!showNotifications);
    };

    const markAllAsRead = async () => {
        if (!user?._id) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/read-all/${user._id}`, {
                method: 'PUT'
            });

            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setNotificationCount(0);

        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const formatNotificationTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return `${Math.floor(diff / 86400000)}d ago`;
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Mark notification as read if unread
            if (!notification.isRead) {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/read/${notification._id}`, {
                    method: 'PUT'
                });

                // Update local state
                setNotifications(prev =>
                    prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
                );

                // Update count
                setNotificationCount(prev => Math.max(0, prev - 1));
            }

            // Redirect based on notification type and relatedId
            if (notification.relatedId) {
                if (notification.type === 'wribate_creation' || notification.type === 'wribate_reminder') {
                    router.push(`/wribate/${notification.relatedId}`);
                } else if (notification.type === 'propose_wribate') {
                    router.push('/propose-wribate');
                } else if (notification.type === 'chat_message') {
                    // Navigate to chat with the sender
                    router.push(`/messages?contact=${notification.relatedId}`);
                }
            }

            // Close notification dropdown
            setShowNotifications(false);

        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    // Don't render if user is not logged in
    if (!user?._id) {
        return null;
    }

    return (
        <div className="" ref={notificationRef}>
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleNotifications}
                className="hover:bg-gray-100 text-gray-700 relative"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                )}
            </Button>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notificationLoading ? (
                            <div className="p-4 text-center">
                                <div className="inline-block animate-spin h-5 w-5 border-t-2 border-blue-500 border-r-2 rounded-full"></div>
                                <span className="ml-2 text-gray-600">Loading...</span>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800 text-sm">{notification.title}</h4>
                                            <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                                            <p className="text-gray-400 text-xs mt-2">{formatNotificationTime(notification.createdAt)}</p>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>No notifications yet</p>
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                            <div className="flex space-x-2">
                                <button
                                    onClick={markAllAsRead}
                                    className="flex-1 text-center text-green-600 hover:text-green-800 font-medium text-sm py-1"
                                >
                                    Mark All Read
                                </button>
                                <button
                                    onClick={() => {
                                        router.push('/notifications');
                                        setShowNotifications(false);
                                    }}
                                    className="flex-1 text-center text-blue-600 hover:text-blue-800 font-medium text-sm py-1"
                                >
                                    View All
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}