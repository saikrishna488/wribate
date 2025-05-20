"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAtom } from "jotai";


// Components
import Categories from "../../components/Home/Categories";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

import Arguments from '../../components/Wribate/Arguments'
import Header from '../../components/Wribate/Header'
import Voting from '../../components/Wribate/Voting'
import Comments from '../../components/Wribate/Comments'
import Sidebar from '../../components/Wribate/Sidebar'

// Icons
import { FaThumbsUp, FaShareAlt, FaDownload, FaComments } from "react-icons/fa";


// Utilities

import processArguments from "../../utils/processedArguments";

// API
import {
  useGetMyWribateByIdQuery,
  useAddArgumentMutation,
  useAddCommentMutation,
  useAddVoteMutation,
  useGetVotesQuery,
} from "../../../app/services/authApi";

// State
import { chatAtom, userAtom } from "@/app/states/GlobalStates";

// Custom Components
import SharePopup from "../../components/SharePopup";

import ProgressBar from "../../components/Wribate/ProgressBar";


const WribateView = () => {
  // State
  const [user] = useAtom(userAtom);
  const [selectedVote, setSelectedVote] = useState(null);

  const [showSharePopup, setShowSharePopup] = useState(false);
  const [filteredArguments, setFilteredArguments] = useState(null);
  const [round, setRound] = useState(null);

  const [value, setValue] = useState("");

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


  // Effects
  useEffect(() => {
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
      {/* <Categories /> */}

      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Main Content - Full width on mobile, 70% on desktop */}
          <div className="w-full lg:w-[70%]">
            {isLoading ? (
              <div className="bg-white p-4 sm:p-6 shadow-md rounded-sm">Loading Wribate details...</div>
            ) : data ? (
              <>
                {/* Header Section */}
                <Header data={data} setShowSharePopup={setShowSharePopup} />

                {/* Progress Bar */}
                <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 rounded-sm">
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Wribate Progress</h2>
                  <ProgressBar rounds={data?.data?.rounds} />
                </div>

                {/* Voting Section */}
                <Voting id={id} setSelectedVote={setSelectedVote} user={user} refetch={refetch}  data={data} selectedVote={selectedVote} votes={votes} />

                {/* Arguments Section */}
                <Arguments refetch={refetch} data={data} user={user} id={id} round={round} value={value} setValue={setValue} />

                {/* Comments Section */}
                <Comments refetch={refetch} id={id} data={data} user={user} scrollContainerRef={scrollContainerRef} />
              </>
            ) : (
              <div className="bg-white p-4 sm:p-6 shadow-md rounded-sm">
                Unable to load debate details.
              </div>
            )}
          </div>

          {/* Sidebar for Ads - Hidden on mobile, 30% width on desktop */}
         <Sidebar/>
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