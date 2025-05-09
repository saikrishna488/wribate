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
 */
const ChatUI = () => {
  // ------------ STATE MANAGEMENT ------------
  // Router and navigation state
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [chatUser, setChatUser] = useAtom(chatAtom);
  const [contactId, setContactId] = useState(chatUser._id || null);
  
  // User state
  const [user] = useAtom(userAtom);
  const [users, setUsers] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  
  // UI state
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Message state
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [wribate, setWribate] = useState(chatUser.title && {title:chatUser.title});
  
  // Socket state
  const [socketConnected, setSocketConnected] = useState(false);
  const socketInitialized = useRef(false);
  
  // Refs
  const scrollContainerRef = useRef(null);

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
  useEffect(() => {
    if (!user?._id) {
      router.push('/login');
    }
  }, [user, router]);

  // Handle URL params and set contact
  useEffect(() => { 

    if (contactId) {

      const user = users.find(u => u._id == contactId);

      if(user){
        setSelectedContact(user)
        return 
      }

      const fetchUser = async () => {
        try {
          setIsLoading(true);
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getUser/${contactId}`, 
            { headers: authHeader() }
          );
          
          const data = res.data;
          
          if (data.res) {
            // Check if user already exists in the users array
            const userExists = users.some(u => u._id === data.user._id);
            
            if (!userExists) {
              setUsers(prevUsers => [...prevUsers, data.user]);
            }
            
            setSelectedContact(data.user);
            setIsLoading(false);
          } else {
            toast.error("Error fetching user");
            setIsLoading(false);
          }
        } catch (err) {
          console.log(err);
          toast.error("Failed to fetch user");
          setIsLoading(false);
        }
      };

      fetchUser();
    }
  }, [contactId]);

  // ------------ DATA FETCHING ------------
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getUsers`, 
          { headers: authHeader() }
        );

        const data = res.data;

        if (data.res) {
          setUsers(data.users);
          setIsLoading(false);
        } else {
          toast.error("Error fetching users");
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch users");
        setIsLoading(false);
      }
    };

    fetchUsers();
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
  // Sync selected contact with URL parameter
  useEffect(() => {
    if (contactId && users?.length > 0) {
      const foundUser = users.find((u) => u._id === contactId);
      if (foundUser) {
        setSelectedContact(foundUser);
        if (isMobile) setShowChat(true);
      } else {
        // Handle invalid contact ID
        // const params = new URLSearchParams(searchParams.toString());
        // params.delete("contact");
        // router.push(`${pathname}?${params.toString()}`);
      }
    } else {
      setSelectedContact(null);
    }
  }, [contactId, users, isMobile, pathname, router, searchParams]);

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
  }, [messages]);

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
  // Handle contact selection
  const handleContactClick = (user) => {
    setSelectedContact(user)
    if (isMobile) setShowChat(true);
  };

  // Handle back button click in mobile view
  const handleBackClick = () => {
    setShowChat(false);
    router.push(pathname);
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
    <div>
      {isLoading && <p className="p-4 text-center">Loading users...</p>}
      
      <div className="flex h-[90vh] bg-gray-100 box-border">
        {/* Contacts List */}
        <div
          className={`bg-white w-full md:w-[40%] lg:w-[40%] border-r ${
            isMobile && showChat ? "hidden" : "block"
          }`}
        >
          <div className="p-0 md:p-4 border-box">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-70px)] scrollbar-hide">
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    selectedContact?._id === user._id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => handleContactClick(user)}
                >
                  <div className="relative">
                    <img
                      src="/user.png"
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{user.name}</h3>
                      <span className="text-xs text-gray-500">
                        {/* Time placeholder */}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No users found matching your search
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex flex-col flex-1 ${
            isMobile && !showChat ? "hidden" : "block"
          }`}
        >
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-0 md:p-4 py-2 border-b bg-white">
                <div className="flex items-center">
                  {isMobile && (
                    <button onClick={handleBackClick} className="mr-2">
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  <div className="relative">
                    <img
                      src="/user.png"
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 ${
                        socketConnected ? "bg-green-500" : "bg-gray-400"
                      } rounded-full border-2 border-white`}
                    ></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <p className="text-xs text-gray-500">
                      {socketConnected ? "Connected" : "Connecting..."}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Video
                    size={20}
                    className="text-gray-600 hover:text-gray-800"
                  />
                  <Phone
                    size={20}
                    className="text-gray-600 hover:text-gray-800"
                  />
                  <MoreVertical
                    size={20}
                    className="text-gray-600 hover:text-gray-800"
                  />
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 p-1 md:p-4 overflow-y-auto bg-gray-50 scrollbar-hide"
                ref={scrollContainerRef}
              >
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 flex ${
                        msg.sender === user?._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                          msg.sender === user?._id
                            ? "bg-purple-100"
                            : "bg-white"
                        }`}
                      >
                        {msg?.wribateTitle && (
                          <div
                            className="bg-purple-100 p-2 rounded mb-2 text-sm text-purple-800 cursor-pointer hover:bg-purple-200"
                            onClick={() => handleWribate(msg.wribateId)}
                          >
                            {msg.wribateTitle}
                          </div>
                        )}
                        <p>{msg.message}</p>
                        <p className="text-xs mt-1 text-gray-500">
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
                className="border-t p-0 md:p-4 bg-white w-[100%]"
              >
                {wribate && (
                  <div className="flex items-center justify-between bg-purple-100 p-2 rounded-t-lg mb-2">
                    <span className="text-sm text-purple-800">
                      {wribate?.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setWribate(null)}
                      className="text-purple-800 hover:text-purple-900 text-lg"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="md:flex-1 flex-0 border-none bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={!socketConnected}
                  />
                  <button
                    type="submit"
                    className={`ml-2 ${
                      socketConnected
                        ? "bg-purple-800 hover:bg-purple-900"
                        : "bg-gray-400"
                    } text-white p-2 rounded-full`}
                    disabled={!socketConnected}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>

      {users.length === 0 && !isLoading && (
        <div className="p-4 text-center text-gray-500">
          No users available. Please try again later.
        </div>
      )}
    </div>
  );
};

export default ChatUI;