"use client"
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Send,
  ChevronLeft,
  Video,
  Phone,
  MoreVertical,
} from "lucide-react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { useGetUsersQuery } from "../services/authApi";
import { timeAgo } from "../utils/dateFormat";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";


// Socket reference to be maintained throughout component lifecycle
let socket = null;

const ChatUI = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const contactId = searchParams.get("contact");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [wribate, setWribate] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  // const { user? } = useSelector((state) => state.auth);
  const [user] = useAtom(userAtom);
  const scrollContainerRef = useRef(null);
  const socketInitialized = useRef(false);

  const {
    data: users,
    isLoading: usersLoading,
    error: userError,
  } = useGetUsersQuery();


  //check user
  useEffect(()=>{
    if(!user?._id){
      router.push('/login')
    }
  },[])

  // Initialize socket connection only once when component mounts
  useEffect(() => {
    // Only initialize socket once
    if (!socketInitialized.current) {
      const token = localStorage.getItem("token");
      console.log("Initializing socket connection");

      socket = io("https://admin.wribate.com/", {
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
  }, []); // Empty dependency array means this runs once on mount

  // When contact changes, fetch messages but don't reinitialize socket
  useEffect(() => {
    if (selectedContact && socket && socket.connected) {
      console.log("Getting messages for contact:", selectedContact.name);
      socket.emit("getMessages", { receiver: selectedContact._id });
    }
  }, [selectedContact]);

  // If socket disconnects, try to reconnect
  useEffect(() => {
    if (!socketConnected && socketInitialized.current && socket) {
      const reconnectTimer = setTimeout(() => {
        console.log("Attempting to reconnect socket");
        socket.connect();
      }, 3000);

      return () => clearTimeout(reconnectTimer);
    }
  }, [socketConnected]);

  // Sync selected contact with URL parameter
  useEffect(() => {
    if (contactId && users?.users) {
      const user = users.users.find((u) => u._id === contactId);
      if (user) {
        setSelectedContact(user);
        if (isMobile) setShowChat(true);
      } else {
        // Handle invalid contact ID - in Next.js, we use router.push
        const params = new URLSearchParams(searchParams.toString());
        params.delete("contact");
        router.push(`${pathname}?${params.toString()}`);
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

  // Auto-scroll to bottom
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

  const handleContactClick = (user) => {
    // In Next.js, we use the router to update the URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("contact", user._id);
    router.push(`${pathname}?${params.toString()}`);
    if (isMobile) setShowChat(true);
  };

  const handleBackClick = () => {
    setShowChat(false);
    // In Next.js, we use the router to update the URL
    router.push(pathname);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedContact || !socket || !socket.connected)
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

  const handleWribate = (id) => {
    // In Next.js, we use the router to navigate
    router.push(`/app/wribate/${id}`);
  };

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = users?.users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if(!user?._id){
    return null
  }

  return (
      <div>
      {usersLoading && <p>Loading users...</p>}
      {users && (
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
              {filteredUsers?.map((user) => (
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
                    {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> */}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{user.name}</h3>
                      <span className="text-xs text-gray-500">2:00</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
              {filteredUsers?.length === 0 && (
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
      )}
    </div>
    
  );
};

export default ChatUI;