"use client"
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  ChevronLeft,
  Video,
  Phone,
  MoreVertical,
} from "lucide-react";
import { io } from "socket.io-client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { chatAtom, userAtom } from "../states/GlobalStates";
import axios from "axios";
import authHeader from "../utils/authHeader";
import toast from "react-hot-toast";
import { timeAgo } from "../utils/dateFormat";

// Socket reference to be maintained throughout component lifecycle
let socket = null;

/**
 * ChatUI Component
 * A full-featured chat interface with contacts list and message area
 * Optimized for mobile with improved UI
 */
const ChatUI = () => {
  // ------------ STATE MANAGEMENT ------------
  // Router and navigation state
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [chatUser, setChatUser] = useAtom(chatAtom);
  // Use useRef for contactId to prevent recursive renders
  const contactIdRef = useRef(chatUser._id || null);
  const [contactId, setContactId] = useState(contactIdRef.current);
  
  // User state
  const [user] = useAtom(userAtom);
  const [users, setUsers] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  
  // UI state
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Track mounted state to prevent updates on unmounted component
  const isMountedRef = useRef(true);
  
  // Message state
  const [message, setMessage] = useState(chatUser.message || "");
  const [messages, setMessages] = useState([]);
  const [wribate, setWribate] = useState(chatUser.title && {title:chatUser.title});
  
  // Socket state
  const [socketConnected, setSocketConnected] = useState(false);
  const socketInitialized = useRef(false);
  
  // Refs
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);

  // ------------ FILTERED DATA ------------
  const filteredUsers = users?.length > 0 
    ? users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // ------------ AUTHENTICATION & ROUTING ------------
  // Check if user is logged in
  // Added cleanup for component unmount
  useEffect(() => {
    // Set mounted ref
    isMountedRef.current = true;
    
    if (!user?._id) {
      router.push('/login');
    }
    
    // Cleanup function for component unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [user, router]);

  // Handle URL params and set contact - Optimized to reduce unnecessary API calls
  useEffect(() => { 
    if (!contactId) return;
    
    // First check if user is already in local state to avoid unnecessary API calls
    const existingUser = users.find(u => u._id === contactId);
    
    if (existingUser) {
      setSelectedContact(existingUser);
      if (isMobile) setShowChat(true);
      return;
    }
    
    // Only fetch if we don't have the user data locally
    let isMounted = true; // For handling unmount during async operation
    
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getUser/${contactId}`, 
          { headers: authHeader() }
        );
        
        if (!isMounted) return; // Prevent state updates if component unmounted
        
        const data = res.data;
        
        if (data.res) {
          // Add user to local collection if not exists
          setUsers(prevUsers => {
            // Check if user already exists before adding
            const userExists = prevUsers.some(u => u._id === data.user._id);
            return userExists ? prevUsers : [...prevUsers, data.user];
          });
          
          setSelectedContact(data.user);
          if (isMobile) setShowChat(true);
        } else {
          toast.error("Error fetching user");
        }
      } catch (err) {
        console.log(err);
        if (isMounted) toast.error("Failed to fetch user");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUser();
    
    // Cleanup function to handle component unmount
    return () => {
      isMounted = false;
    };
  }, [contactId, users]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getUsers`, 
          { headers: authHeader() }
        );

        // Prevent state updates if component unmounted
        if (!isMounted) return;
        
        const data = res.data;

        if (data.res) {
          // Set users and track that we've loaded them
          setUsers(data.users);
        } else {
          toast.error("Error fetching users");
        }
      } catch (err) {
        console.log(err);
        if (isMounted) {
          toast.error("Failed to fetch users");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // ------------ SOCKET CONNECTION ------------
  // Initialize socket connection
  useEffect(() => {
    // Only initialize socket once
    if (!socketInitialized.current) {
      const token = localStorage.getItem("token");
      console.log("Initializing socket connection");

      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://api.wribate.com/", {
        query: { token },
        autoConnect: false,
      });

      // Set up event listeners
      socket.on("connect", () => {
        console.log("Socket connected");
        setSocketConnected(true);

        // If a contact is already selected, get messages
        if (selectedContact) {
          socket.emit("getMessages", { receiver: selectedContact._id });
        }
      });

      socket.on("receiveMessage", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on("chatHistory", (data) => {
        setMessages(data);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        setSocketConnected(false);
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      // ✅ LISTEN FOR CHAT NOTIFICATIONS
      socket.on("newMessageNotification", (notificationData) => {
        console.log("New message notification received:", notificationData);
        
        // Update bell notification count in navbar
        if (window.refreshNotificationCount) {
          window.refreshNotificationCount();
        }
        
        // Optional: Show toast notification if not in chat with sender
        if (notificationData.sender !== selectedContact?._id) {
          toast.success(`New message from ${notificationData.senderName}`);
        }
      });


      // Connect the socket
      socket.connect();
      socketInitialized.current = true;
    }

    // Clean up socket connection when component unmounts
    return () => {
      if (socket) {
        console.log("Cleaning up socket connection");
        socket.disconnect();
        socket = null;
        socketInitialized.current = false;
      }
    };
  }, []); 

  // Fetch messages when contact changes
  useEffect(() => {
    if (selectedContact?._id && socket && socket.connected) {
      console.log("Getting messages for contact:", selectedContact.name);
      socket.emit("getMessages", { receiver: selectedContact._id });
    }
  }, [selectedContact]);

  // Socket reconnection logic
  useEffect(() => {
    if (!socketConnected && socketInitialized.current && socket) {
      const reconnectTimer = setTimeout(() => {
        console.log("Attempting to reconnect socket");
        socket.connect();
      }, 3000);

      return () => clearTimeout(reconnectTimer);
    }
  }, [socketConnected]);

  // ------------ UI EFFECTS ------------
  // Sync selected contact with URL parameter - optimized to prevent multiple executions
  useEffect(() => {
    // Only run this effect when contactId or users change
    if (contactId && users?.length > 0) {
      const foundUser = users.find((u) => u._id === contactId);
      if (foundUser) {
        setSelectedContact(foundUser);
        // Only set showChat when mobile AND contact changes
        if (isMobile) setShowChat(true);
      }
    } else if (contactId === null) {
      // Only reset selected contact when contactId is explicitly null
      setSelectedContact(null);
    }
    // Removed unnecessary dependencies to prevent excessive re-renders
  }, [contactId, users]);

  // Responsive screen check
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }

    // Focus input field when chat opens
    if (showChat && isMobile && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [messages, showChat, isMobile]);

  // Handle state from router
  useEffect(() => {
    const handleRouteChange = () => {
      const state = window.history.state;
      if (state && state.wribate) {
        setWribate(state.wribate);
        // Clear state
        window.history.replaceState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    handleRouteChange(); // Check initial state

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // ------------ EVENT HANDLERS ------------
  // Handle contact selection - Improved to avoid state conflicts
  const handleContactClick = (user) => {
    if (user?._id) {
      // Set contact ID first
      setContactId(user._id);
      // Then set selected contact
      setSelectedContact(user);
      // Finally handle mobile UI
      if (isMobile) setShowChat(true);
    }
  };

  // Handle back button click in mobile view - Improved to prevent route issues
  const handleBackClick = () => {
    // First update UI state
    setShowChat(false);
    // Then update URL if needed, without triggering unnecessary navigation
    if (contactId) {
      // Use replace to avoid adding to history stack
      router.replace(pathname, { shallow: true });
      // Clear contact ID after UI is updated
      setTimeout(() => setContactId(null), 0);
    }
  };

  // Handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedContact?._id || !socket || !socket.connected)
      return;

    const messageData = {
      receiver: selectedContact._id,
      message: message.trim(),
    };

    if (wribate) {
      messageData.wribateTitle = wribate.title;
      messageData.wribateId = wribate.wribateId;
    }

    socket.emit("sendMessage", messageData);
    setMessages((prev) => [
      ...prev,
      {
        ...messageData,
        sender: user?._id,
        timestamp: Date.now(),
      },
    ]);
    setMessage("");
    setWribate(null);
  };

  // Handle wribate click
  const handleWribate = (id) => {
    router.push(`/app/wribate/${id}`);
  };

  // ------------ CONDITIONAL RENDERING ------------
  if (!user?._id) {
    return null;
  }

  // ------------ COMPONENT RENDER ------------
  return (
    <div className="h-[90vh] flex flex-col bg-gray-100">
      {isLoading && <div className="p-4 text-center bg-white shadow-sm">Loading users...</div>}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Contacts List */}
        <div
          className={`bg-white md:w-[40%] lg:w-[30%] border-r border-gray-200 flex flex-col ${
            isMobile && showChat ? "hidden" : "flex-1"
          }`}
        >
          <div className="p-3 sticky top-0 bg-white z-10 shadow-sm">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 scrollbar-hide">
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedContact?._id === user._id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleContactClick(user)}
                >
                  <div className="relative">
                    <img
                      src="/user.png"
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 ${
                        socketConnected && selectedContact?._id === user._id 
                          ? "bg-green-500" 
                          : "bg-gray-400"
                      } rounded-full border-2 border-white`}
                    ></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <span className="text-xs text-gray-500">
                        {/* Time placeholder */}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 flex flex-col items-center">
                <Search size={40} className="text-gray-300 mb-2" />
                <p>No users found matching your search</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex flex-col flex-1 ${
            isMobile && !showChat ? "hidden" : "flex-1"
          }`}
        >
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
                <div className="flex items-center">
                  {isMobile && (
                    <button 
                      onClick={handleBackClick} 
                      className="mr-2 p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft size={24} className="text-blue-900" />
                    </button>
                  )}
                  <div className="relative">
                    <img
                      src="/user.png"
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${
                        socketConnected ? "bg-green-500" : "bg-gray-400"
                      } rounded-full border-2 border-white`}
                    ></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{selectedContact.name}</h3>
                    <p className="text-xs text-gray-500">
                      {socketConnected ? "Connected" : "Connecting..."}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreVertical
                      size={18}
                      className="text-blue-900"
                    />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 p-3 overflow-y-auto bg-gray-50 scrollbar-hide"
                ref={scrollContainerRef}
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                      <Send size={24} className="text-blue-300" />
                    </div>
                    <p className="text-lg font-medium text-gray-600">No messages yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start a conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-3 flex ${
                        msg.sender === user?._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-md p-3 ${
                          msg.sender === user?._id
                            ? "bg-blue-900 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                            : "bg-white text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-sm"
                        }`}
                      >
                        {msg?.wribateTitle && (
                          <div
                            className={`${
                              msg.sender === user?._id 
                                ? "bg-blue-800" 
                                : "bg-blue-50 text-blue-900"
                            } p-2 rounded mb-2 text-sm cursor-pointer hover:opacity-90 transition-opacity`}
                            onClick={() => handleWribate(msg.wribateId)}
                          >
                            {msg.wribateTitle}
                          </div>
                        )}
                        <p className="break-words">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === user?._id 
                            ? "text-blue-100" 
                            : "text-gray-500"
                        }`}>
                          {timeAgo(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-gray-200 p-3 bg-white sticky bottom-0 w-full"
              >
                {wribate && (
                  <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg mb-2 border border-blue-100">
                    <span className="text-sm text-blue-900 truncate flex-1">
                      {wribate?.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setWribate(null)}
                      className="text-blue-900 hover:text-blue-700 ml-2 p-1"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border-none bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={!socketConnected}
                  />
                  <button
                    type="submit"
                    className={`${
                      socketConnected && message.trim()
                        ? "bg-blue-900 hover:bg-blue-800"
                        : "bg-gray-400"
                    } text-white p-3 rounded-lg transition-colors`}
                    disabled={!socketConnected || !message.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Send size={32} className="text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-600">No conversation selected</p>
              <p className="text-sm text-gray-500 mt-1">
                {isMobile ? "Tap a contact to start chatting" : "Select a conversation to start chatting"}
              </p>
            </div>
          )}
        </div>
      </div>

      {users.length === 0 && !isLoading && (
        <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <p className="text-lg font-medium text-gray-600">No users available</p>
          <p className="text-sm text-gray-500 mt-1">Please try again later</p>
        </div>
      )}
    </div>
  );
};

export default ChatUI;