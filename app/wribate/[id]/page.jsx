"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAtom } from "jotai";
import he from "he";
import Swal from "sweetalert2";

// Components
import Categories from "../../components/Home/Categories";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Icons
import { FaThumbsUp, FaShareAlt, FaDownload, FaComments } from "react-icons/fa";
import { LiaFileAudioSolid } from "react-icons/lia";

// Utilities
import formatDate, { timeAgo } from "../../utils/dateFormat";
import processArguments from "../../utils/processedArguments";

// API
import {
  useGetMyWribateByIdQuery,
  useAddArgumentMutation,
  useAddCommentMutation,
  useGetProfileQuery,
  useAddVoteMutation,
  useGetVotesQuery,
} from "../../../app/services/authApi";

// State
import { chatAtom, userAtom } from "@/app/states/GlobalStates";

// Custom Components
import SharePopup from "../../components/SharePopup";
import VotesChart from "./Chart";
import ProgressBar from "./ProgressBar";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

const WribateView = () => {
  // State
  const [user] = useAtom(userAtom);
  const [selectedVote, setSelectedVote] = useState(null);
  const [message, setMessage] = useState("");
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [filteredArguments, setFilteredArguments] = useState(null);
  const [round, setRound] = useState(null);
  const [voteSelection, setVoteSelection] = useState(null);
  const [value, setValue] = useState("");
  const [chatUser, setChatUser] = useAtom(chatAtom);

  // Refs
  const scrollContainerRef = useRef(null);

  // Hooks
  const router = useRouter();
  const { id } = useParams();

  // API Hooks
  const [addArgument, { isLoading: addingArgument }] = useAddArgumentMutation();
  const [addComment, { isLoading: addingComment }] = useAddCommentMutation();
  const [addVote, { isLoading: addingVote }] = useAddVoteMutation();
  const { data, isLoading, refetch } = useGetMyWribateByIdQuery(id);
  const { data: votes, isLoading: votesLoading } = useGetVotesQuery(id);

  // Functions
  const showLoginAlert = () => {
    toast.error("Login to continue!")
    router.push('/login')
  };

  const handleVote = (vote) => {
    setVoteSelection(vote);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user) {
      showLoginAlert();
      return;
    }

    const data = { text: value, roundNumber: round };
    try {
      const response = await addArgument({ id, data });
      if (response?.data?.status === "success") {
        refetch();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      showLoginAlert();
      return;
    }

    const data = { text: message, type: voteSelection };
    try {
      const response = await addComment({ id, data });
      if (response?.data?.status === "success") {
        setMessage("");
        refetch();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitVote = async (string) => {
    if (!user?._id) {
      showLoginAlert();
      return;
    }

    setSelectedVote(string);
    const data = { vote: string };
    try {
      const response = await addVote({ id, data }).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChat = (userId) => {
    setChatUser({
      _id: userId,
      title: data?.data?.title
    });
    router.push(`/messages`);
  };

  // Helper functions
  const getRoundTitle = (roundNumber) => {
    switch (roundNumber) {
      case 1:
        return "Opening Arguments";
      case 2:
        return "Rebuttals";
      case 3:
        return "Closing Arguments";
      default:
        return `Round ${roundNumber}`;
    }
  };

  const getArgumentForRound = (roundNumber, side) => {
    if (!data || !data.data || !data.data.arguments) return null;

    const argument = data.data.arguments.find(
      arg => arg.roundNumber == roundNumber && arg.panelSide === side
    );

    return argument?.text || null;
  };

  // Effects
  useEffect(() => {

    console.log(user?._id, data?.againstId)
    const newTimeStamp = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const currentTime = new Date(
      newTimeStamp.getTime() + istOffset
    ).toISOString();

    if (data && user) {
      const currentRound = data.data.rounds.find((round) => {
        return currentTime >= round.startDate && currentTime <= round.endDate;
      });

      if (currentRound) {
        setRound(currentRound.roundNumber);
      }
    }

    if (data) {
      const response = processArguments(
        data.data.arguments,
        data.data.rounds,
        user
      );
      setFilteredArguments(response);
    }
  }, [user, data]);

  useEffect(() => {
    if (round) {
      const email = user?.email;
      let type = null;
      if (data.data.leadFor.includes(email)) {
        type = "For";
      }
      if (data.data.leadAgainst.includes(email)) {
        type = "Against";
      }

      if (type) {
        const requiredRound = data.data.arguments.find(
          (argument) =>
            argument.panelSide.includes(type) && argument?.roundNumber == round
        );
        const updatedValue = requiredRound?.text;
        setValue(updatedValue);
      }
    }
  }, [round]);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      requestAnimationFrame(() => {
        const container = scrollContainerRef.current;
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [data?.data?.comments]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Categories />

      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Main Content - Full width on mobile, 70% on desktop */}
          <div className="w-full lg:w-[70%]">
            {isLoading ? (
              <div className="bg-white p-4 sm:p-6 shadow-md rounded-sm">Loading Wribate details...</div>
            ) : data ? (
              <>
                {/* Header Section */}
                <div className="bg-white border border-gray-200 shadow-sm mb-4 sm:mb-6 rounded-sm overflow-hidden">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                    {data?.data?.title}
                  </h1>

                  <div className="grid grid-cols-2 border-b border-gray-200 text-sm sm:text-lg font-semibold">
                    <div className="p-2 sm:p-3 text-center bg-red-100 border-r border-gray-200 break-words truncate sm:truncate-0">
                      {data?.data?.leadFor || "@Test 1"}
                    </div>
                    <div className="p-2 sm:p-3 text-center bg-blue-100 break-words truncate sm:truncate-0">
                      {data?.data?.leadAgainst}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="relative h-80 w-full">
                      <img
                        src={data?.data?.coverImage}
                        alt="Debate Cover Image"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between items-start sm:items-center border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm mb-3 sm:mb-2 md:mb-0 w-full sm:w-auto">
                      <Badge className="font-semibold mb-1 sm:mb-0">{data?.data?.category}</Badge>
                      {data?.data?.institution && (
                        <Badge className="font-semibold">{data.data.institution}</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                        <Eye size={14} className="mr-1" />
                        <span>{Math.ceil(Math.random() * 1000)}</span>
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                        <FaComments size={14} className="mr-1" />
                        <span>{data?.data?.comments?.length}</span>
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                        <FaDownload size={14} className="mr-1" />
                        <span>Download</span>
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                        <LiaFileAudioSolid size={16} className="mr-1" />
                        <span>Audio</span>
                      </button>
                      <button
                        className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
                        onClick={() => setShowSharePopup(true)}
                      >
                        <FaShareAlt size={14} className="mr-1" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 rounded-sm">
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Debate Progress</h2>
                  <ProgressBar rounds={data?.data?.rounds} />
                </div>

                {/* Voting Section */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 w-full sm:w-1/2 rounded-sm">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Cast Your Vote</h2>
                    <div className="mb-3 sm:mb-4">
                      <p className="mb-2 sm:mb-3 font-medium text-sm sm:text-base">{data?.data?.title}</p>
                      <div className="space-y-2 sm:space-y-3">
                        <button
                          className={`w-full p-2 sm:p-3 border text-left font-medium transition text-sm sm:text-base ${selectedVote === "For"
                            ? "bg-red-100 border-red-500 text-red-800"
                            : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                            }`}
                          onClick={() => handleSubmitVote("For")}
                        >
                          For
                        </button>
                        <button
                          className={`w-full p-2 sm:p-3 border text-left font-medium transition text-sm sm:text-base ${selectedVote === "Against"
                            ? "bg-blue-100 border-blue-500 text-blue-800"
                            : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                            }`}
                          onClick={() => handleSubmitVote("Against")}
                        >
                          Against
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                        <span className="text-red-500">*</span> 2 weeks left to vote
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 w-full sm:w-1/2 rounded-sm">
                    {votes?.roundVoteCounts && (
                      <VotesChart
                        data={votes?.roundVoteCounts}
                        title={data?.data?.title}
                      />
                    )}
                  </div>
                </div>

                {/* Arguments Section */}
                <div className="bg-white border border-gray-200 shadow-sm mb-4 sm:mb-6 rounded-sm">
                  <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg sm:text-xl font-bold">Arguments</h2>
                  </div>

                  <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
                    {data?.data?.rounds && data.data.rounds.map((roundData) => {
                      const roundNumber = roundData.roundNumber;
                      const forArgument = getArgumentForRound(roundNumber, "For");
                      const againstArgument = getArgumentForRound(roundNumber, "Against");

                      return (
                        <div key={roundNumber} className="border-b border-gray-200 pb-6 sm:pb-8 last:border-b-0 last:pb-0">
                          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-100">
                            Round {roundNumber}: {getRoundTitle(roundNumber)}
                          </h3>

                          <div className="grid gap-4 sm:gap-6">
                            {/* For Argument */}
                            <div className="border-l-4 border-red-500 pl-3 sm:pl-4 bg-red-50 rounded-r-sm p-2 sm:p-3">
                              <div className="flex items-center mb-2 sm:mb-3">
                                <img src="/user.png" alt="" className="rounded-full w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                                <span className="font-medium text-red-800 text-sm sm:text-base">{data.data.leadFor}</span>
                              </div>

                              {forArgument ? (
                                <div
                                  className="prose max-w-none text-sm sm:text-base"
                                  dangerouslySetInnerHTML={{ __html: he.decode(forArgument) }}
                                />
                              ) : (
                                <p className="text-gray-500 italic text-sm sm:text-base">No argument submitted.</p>
                              )}
                            </div>

                            {/* Against Argument */}
                            <div className="border-l-4 border-blue-500 pl-3 sm:pl-4 bg-blue-50 rounded-r-sm p-2 sm:p-3">
                              <div className="flex items-center mb-2 sm:mb-3">
                                <img src="/user.png" alt="" className="rounded-full w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                                <span className="font-medium text-blue-800 text-sm sm:text-base">{data.data.leadAgainst}</span>
                              </div>

                              {againstArgument ? (
                                <div
                                  className="prose max-w-none text-sm sm:text-base"
                                  dangerouslySetInnerHTML={{ __html: he.decode(againstArgument) }}
                                />
                              ) : (
                                <p className="text-gray-500 italic text-sm sm:text-base">No argument submitted.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Argument Editor for Participants */}
                  {user &&
                    (user?._id == data?.forId ||
                      user?._id == data?.againstId) &&
                    round && (
                      <div className="border-t border-gray-200 p-3 sm:p-6 bg-gray-50">
                        <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Enter Your Arguments - Round {round}</h3>
                        <div className="bg-white border border-gray-200">
                          <ReactQuill
                            theme="snow"
                            value={value ? he.decode(value) : ""}
                            onChange={setValue}
                            style={{
                              height: '250px',
                              backgroundColor: "white",
                              overflowY: "auto"
                            }}
                          />
                        </div>
                        <div className="mt-3 sm:mt-4">
                          <Button
                            onClick={handleSendMessage}
                            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                          >
                            Save Argument
                          </Button>
                        </div>
                      </div>
                    )}
                </div>

                {/* Comments Section */}
                <div className="bg-white border border-gray-200 shadow-sm mb-4 sm:mb-6 rounded-sm">
                  <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg sm:text-xl font-bold">Comments</h2>
                  </div>

                  {/* Comment List */}
                  <div
                    className="max-h-80 sm:max-h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
                    ref={scrollContainerRef}
                  >
                    {data?.data?.comments && data?.data?.comments.length > 0 ? (
                      data.data.comments.map((comment, index) => (
                        <div key={index} className={`flex ${comment.type === "Against" ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-full sm:max-w-md ${comment.type === "Against" ? "order-2" : "order-1"}`}>
                            <div className={`flex items-center mb-1 ${comment.type === "Against" ? "justify-start" : "justify-end"}`}>
                              <div className={`text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold ${comment.type === "Against" ? "bg-red-500" : "bg-blue-500"}`}>
                                {comment?.userId?.name?.slice(0, 2)}
                              </div>
                              <span className="ml-2 font-semibold text-xs sm:text-sm">
                                {comment?.userId?.name}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">
                                {timeAgo(comment.createdAt)}
                              </span>
                            </div>

                            <div className={`rounded-sm border p-2 sm:p-3 ${comment.type === "Against"
                              ? "bg-red-50 border-red-100"
                              : "bg-blue-50 border-blue-100"
                              }`}>
                              <p className="text-xs sm:text-sm">{comment.text}</p>
                            </div>

                            <div className="flex mt-1 sm:mt-2 gap-3 sm:gap-4 text-xs">
                              <button className="flex items-center text-gray-500 hover:text-gray-700">
                                <FaThumbsUp size={10} className="mr-1" /> Like
                              </button>
                              <button
                                className="flex items-center text-gray-500 hover:text-gray-700"
                                onClick={() => handleChat(comment?.userId?._id)}
                              >
                                <FaComments size={10} className="mr-1" /> Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 sm:p-4 text-center text-gray-500 text-sm sm:text-base">No comments yet. Be the first to comment!</div>
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
                          disabled={!message || !voteSelection}
                        >
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-4 sm:p-6 shadow-md rounded-sm">
                Unable to load debate details.
              </div>
            )}
          </div>

          {/* Sidebar for Ads - Hidden on mobile, 30% width on desktop */}
          <div className="w-full lg:w-[30%] space-y-4 sm:space-y-6 mt-4 lg:mt-0">
            <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 text-center rounded-sm">
              <div className="mb-2 font-bold uppercase text-xs sm:text-sm tracking-wider text-gray-600">Advertisement</div>
              <div className="bg-gray-100 h-48 sm:h-64 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Ad Space</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 text-center rounded-sm">
              <div className="mb-2 font-bold uppercase text-xs sm:text-sm tracking-wider text-gray-600">Advertisement</div>
              <div className="bg-gray-100 h-48 sm:h-64 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Ad Space</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 rounded-sm">
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Related Debates</h3>
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border-b border-gray-100 pb-2 sm:pb-3 last:border-b-0">
                    <h4 className="font-medium hover:text-blue-600 cursor-pointer text-sm sm:text-base">Sample Related Debate Topic {item}</h4>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>2 days ago</span>
                      <span>32 comments</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Popup */}
      {showSharePopup && (
        <SharePopup
          onClose={() => setShowSharePopup(false)}
          product={data?.data}
        />
      )}
    </div>
  );
};

export default WribateView;