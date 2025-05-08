"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Categories from "../../components/Home/Categories";
import { FaThumbsUp, FaShareAlt, FaDownload, FaComments } from "react-icons/fa";
import { LiaFileAudioSolid } from "react-icons/lia";
import { Button } from "@/components/ui/button";
import {
  useGetMyWribateByIdQuery,
  useAddArgumentMutation,
  useAddCommentMutation,
  useGetProfileQuery,
  useAddVoteMutation,
  useGetVotesQuery,
} from "../../../app/services/authApi";
import formatDate, { timeAgo } from "../../utils/dateFormat";
import SharePopup from "../../components/SharePopup";
// import HtmlCoverter from "../Dummy";
import he from "he";
import removeBaseURL from "../../utils/ImageFormat";
import VotesChart from "./Chart";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Search, PaperclipIcon, Smile, Send, ChevronLeft, Video, Phone, MoreVertical } from "lucide-react";
import ProgressBar from "./ProgressBar";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import processArguments from "../../utils/processedArguments";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "@/app/states/GlobalStates";

const VotingPlatformUI = () => {
  const [user] = useAtom(userAtom);
  const [selectedVote, setSelectedVote] = useState(null);
  const [message, setMessage] = useState("");
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [filteredArguments, setFilteredArguments] = useState(null);
  const [round, setRound] = useState(null);
  const [voteSelection, setVoteSelection] = useState(null);
  const [value, setValue] = useState("");
  const scrollContainerRef = useRef(null);
  
  const router = useRouter();
  const { id } = useParams();

  const [addArgument, { isLoading: addingArgument, error: addArgumentError }] =
    useAddArgumentMutation();
  const [addComment, { isLoading: addingComment, error: addCommentError }] =
    useAddCommentMutation();
  const [addVote, { isLoading: addingVote, error: addVoteError }] =
    useAddVoteMutation();

  const { data, isLoading, error, refetch } = useGetMyWribateByIdQuery(id);

  const {
    data: votes,
    isLoading: votesLoading,
    error: votesError,
  } = useGetVotesQuery(id);

  if (votes) {
    console.log(votes);
  }

  const showLoginAlert = () => {
    Swal.fire({
      title: "Login Required",
      text: "Please log in to continue.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/login");
      }
    });
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
      console.log(response);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const newTimeStamp = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const currentTime = new Date(
      newTimeStamp.getTime() + istOffset
    ).toISOString();
    if (data && user) {
      const currentRound = data.data.rounds.find((round, index) => {
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
      const email = user?.message?.email;
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
      refetch(); // Fetch data when component mounts and id is available
    }

    
  }, [id, refetch]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        const container = scrollContainerRef.current;
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [data?.data?.comments]);

  const handleChat = (userId) => {
    router.push(`/app/messages?contact=${userId}`, {
      query: { wribateId: id, title: data?.data?.title },
    });
  };

  console.log(data?.data)

  // Get round title based on round number
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

  // Function to get arguments for specific round and side
  const getArgumentForRound = (roundNumber, side) => {
    if (!data || !data.data || !data.data.arguments) return null;
    
    const argument = data.data.arguments.find(
      arg => arg.roundNumber == roundNumber && arg.panelSide === side
    );
    
    return argument?.text || null;
  };

  return (
    <div className="bg-gray-200">
      <Categories />
      {isLoading && <p>Loading Wribate details</p>}
      {data && (
        <div className="flex flex-col md:flex-row gap-2 md:px-4">
          <div className="flex flex-col min-h-screen bg-gray-200 w-full md:w-[75%]">
            {/* Header */}
            <div className="flex flex-col p-4 md:flex-row">
              <div className="w-full ">
                <div>
                  <h1 className="text-xl sm:text-4xl font-bold px-2 py-2 bg-white mb-2">
                    {data?.data?.title}
                  </h1>
                </div>
                <div className="grid my-4 md:grid-cols-3 px-1 text-xl grid-cols-1 items-center text-white text-center bg-gradient-to-r from-red-500 to-blue-500">
                  <div className="py-2">
                    {data?.data?.leadFor || "@Test 1"}
                  </div>
                  <div className="py-2">VS</div>
                  <div className="py-2">{data?.data?.leadAgainst}</div>
                </div>
                <img
                  src={data?.data?.coverImage}
                  alt="Debate Cover Image"
                  className="w-full h-48 sm:h-64 md:h-80 object-cover shadow:lg border border-cyan-400"
                />
              </div>
              <div className="w-full md:w-1/4 py-4 flex justify-center items-center flex-col bg-white">
                <p className="text-sm text-gray-600 font-bold">
                  Category: {data?.data?.category}
                </p>
                <p className="text-sm text-gray-600 font-bold">
                  University: {data?.data?.institution}
                </p>
                <div className="flex sm:justify-between sm:flex-col flex-row flex-wrap px-2 gap-4 border-t border-b border-gray-200 py-2">
                  <button className="flex items-center justify-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    <span className="ml-2 text-black">Likes</span>
                  </button>
                  <button className="flex items-center justify-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span className="ml-2 text-black">View</span>
                  </button>
                  <button className="flex items-center justify-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="ml-2 text-black">Comments</span>
                  </button>
                  <button className="flex items-center justify-start">
                    <FaDownload size={20} />
                    <span className="ml-2 text-black">Downloads</span>
                  </button>
                  <button className="flex items-center justify-start">
                    <LiaFileAudioSolid size={22} />
                    <span className="ml-2 text-black">Audio</span>
                  </button>
                  <button
                    className="flex items-center justify-start"
                    onClick={() => setShowSharePopup(true)}
                  >
                    <FaShareAlt size={20} />
                    <span className="ml-2 text-black">Share</span>
                  </button>
                </div>
                {showSharePopup && (
                  <SharePopup
                    onClose={() => setShowSharePopup(false)}
                    product={data?.data}
                  />
                )}
              </div>
            </div>

            {/* Stats Section */}
            <ProgressBar rounds={data?.data?.rounds} />

            {/* Voting Section */}
            <h2 className="font-bold text-2xl mt-8">Voting</h2>
            <div className="border rounded-lg shadow-lg my-4 py-2 px-4 bg-white">
              
              <div className="mb-4">
                <label className="block mb-2">
                {data?.data?.title}
                </label>
                <button
                  className={`w-full p-2 mb-2 border rounded-lg text-left 
                     ${selectedVote == "For" ? "bg-blue-200" : ""}`}
                  onClick={() => handleSubmitVote("For")}
                >
                  For
                </button>
                <button
                  className={`w-full p-2 mb-2 border rounded-lg text-left 
                    ${selectedVote == "Against" ? "bg-blue-200" : ""}`}
                  onClick={() => handleSubmitVote("Against")}
                >
                  Against
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="text-red-500">*</span> 2 weeks left
                </p>
              </div>
            </div>
            {votes?.roundVoteCounts && (
              <VotesChart
                data={votes?.roundVoteCounts}
                title={data?.data?.title}
              />
            )}

            {/* Dynamic Arguments Section */}
            <Card className="w-full mt-6  shadow-none bg-transparent rounded-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Arguments</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 p-0 w-full">
                {data?.data?.rounds && data.data.rounds.map((roundData) => {
                  const roundNumber = roundData.roundNumber;
                  const forArgument = getArgumentForRound(roundNumber, "For");
                  const againstArgument = getArgumentForRound(roundNumber, "Against");

                  return (
                    <Card key={roundNumber} className={`p-4 py-5 bg-white shadow-none rounded-xl w-full 
                      ${roundNumber == 1 ? 'blue-shadow' : ''} 
                      ${roundNumber == 2 ? 'green-shadow' : ''} 
                      ${roundNumber == 3 ? 'red-shadow' : ''}`}>
                      <div className="flex w-full flex-col gap-4">
                        {/* LEFT - For Argument */}
                        <div className="self-start sm:w-[95%] border-l-4 items-start border-red-500 pl-4">
                          <div className="w-full flex flex-row flex-wrap gap-2 mb-4 items-center">
                            <img src="/user.png" alt="" className="rounded-full w-8 h-8" />
                            <span className="text-red-800 text-xl">{data.data.leadFor}</span>
                            <span>•</span>
                            <span className="text-black text-xl font-bold">
                              {getRoundTitle(roundNumber)}
                            </span>
                          </div>

                          {forArgument ? (
                            <div
                              className="text-2xl leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: he.decode(forArgument) }}
                            />
                          ) : (
                            <p className="text-gray-500 italic text-2xl">No argument submitted.</p>
                          )}
                        </div>

                        {/* RIGHT - Against Argument */}
                        <div className="border-r-4 sm:w-[95%] mt-4 flex flex-col items-end pr-4 border-blue-500 self-end text-left">
                          <div className="w-full flex flex-row flex-wrap justify-end gap-2 mb-4 items-center">
                            <span className="text-black text-xl font-bold">
                              {getRoundTitle(roundNumber)}
                            </span>
                            <span>•</span>
                            <span className="text-red-800 text-xl">{data.data.leadAgainst}</span>
                            <img src="/user.png" alt="" className="rounded-full w-8 h-8" />
                          </div>

                          {againstArgument ? (
                            <div
                              className="text-2xl leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: he.decode(againstArgument) }}
                            />
                          ) : (
                            <p className="text-gray-500 italic text-2xl">No argument submitted.</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </CardContent>

              {user &&
                (user?.message?.email === data?.data?.leadFor ||
                  user?.message?.email === data?.data?.leadAgainst) &&
                round && (
                  <CardFooter className="flex bg-white flex-col mt-10 p-4 space-y-4">
                    <h4 className="font-bold">Enter Your Arguments - Round {round}</h4>
                    <div className="w-full relative overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={value ? he.decode(value) : ""}
                        onChange={setValue}
                        style={{
                          height:'300px',
                          backgroundColor: "white",
                          overflowY: "auto"
                        }}
                      />
                    </div>

                    <div className="w-full pt-2">
                      <Button onClick={handleSendMessage} className="">Save</Button>
                    </div>
                  </CardFooter>
                )}
            </Card>

            {/* Comments Section */}
            <h4 className="p-4 text-2xl mt-8 font-bold">Comments</h4>
            <div className="flex flex-col max-h-screen bg-white mt-2 mb-2 rounded-lg shadow-lg border border-gray-200">
              
              {/* Chat Messages */}
              {data?.data?.comments && data?.data?.comments.length > 0 ? (
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
                  ref={scrollContainerRef}
                >
                  {data?.data?.comments.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.type == "Against" ? "justify-start" : "justify-end"
                        }`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md ${msg.type == "Against" ? "order-2" : "order-1"
                          }`}
                      >
                        <div
                          className={`flex items-center mb-1 ${msg.type == "Against"
                            ? "justify-start"
                            : "justify-end"
                            }`}
                        >
                          <div
                            className={`text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold 
                            ${msg.type == "Against" ? "bg-red-500" : "bg-blue-500"}
                          `}
                          >
                            {msg?.userId?.name.slice(0, 2)}
                          </div>
                          <span className="ml-2 font-semibold text-sm">
                            {msg?.userId?.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {timeAgo(msg.createdAt)}
                          </span>
                        </div>

                        <div
                          className={`rounded-lg p-3 ${msg.type == "Against"
                            ? "bg-red-50 border border-gray-200"
                            : "bg-blue-50 text-black"
                            }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <div className="flex mt-2 justify-between">
                          <FaThumbsUp color="gray" />
                          <FaComments
                            color="gray"
                            onClick={() => handleChat(msg?.userId?._id)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No comments yet</div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 w-full">
                <div className="bg-white rounded-lg border border-gray-300">
                  <div className="p-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full focus:outline-none text-sm"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center px-3 py-2 border-t border-gray-200 w-full">
                    <div className="flex space-x-2">
                      <button
                        className={`px-4 py-1 rounded-full text-sm flex items-center ${voteSelection === "For"
                          ? "bg-blue-100 text-blue-500"
                          : "bg-gray-100"
                          }`}
                        onClick={() => handleVote("For")}
                      >
                        <span className="w-4 h-4 mr-1 rounded-full border border-current flex items-center justify-center text-xs">
                          {voteSelection === "For" && "✓"}
                        </span>
                        For
                      </button>
                      <button
                        className={`px-4 py-1 rounded-full text-sm flex items-center ${voteSelection === "Against"
                          ? "bg-blue-100 text-blue-500"
                          : "bg-gray-100"
                          }`}
                        onClick={() => handleVote("Against")}
                      >
                        <span className="w-4 h-4 mr-1 rounded-full border border-current flex items-center justify-center text-xs">
                          {voteSelection === "Against" && "✓"}
                        </span>
                        Against
                      </button>
                    </div>
                    <button
                      className="text-white md:px-8 px-4 py-2 rounded-md text-sm font-medium box-border bg-primary"
                      onClick={handleAddComment}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-200">
            <h2>Hello</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingPlatformUI;