'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAtom } from "jotai";

// Components
import Arguments from '../../components/Wribate/Arguments'
import Header from '../../components/Wribate/Header'
import Voting from '../../components/Wribate/Voting'
import Comments from '../../components/Wribate/Comments'
import Sidebar from '../../components/Wribate/Sidebar'

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

export default function WribateContent() {
  const [user] = useAtom(userAtom);
  const [selectedVote, setSelectedVote] = useState(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [filteredArguments, setFilteredArguments] = useState(null);
  const [round, setRound] = useState(null);
  const [value, setValue] = useState("");
  const scrollContainerRef = useRef(null);

  const router = useRouter();
  const { id } = useParams();

  const [addArgument, { isLoading: addingArgument }] = useAddArgumentMutation();
  const [addComment, { isLoading: addingComment }] = useAddCommentMutation();
  const [addVote, { isLoading: addingVote }] = useAddVoteMutation();
  const { data, isLoading, refetch } = useGetMyWribateByIdQuery(id);
  const { data: votes, isLoading: votesLoading, refetch: refetchVotes } = useGetVotesQuery(id);

  const handleRefetch = async () => {
    try {
      await Promise.all([
        refetch(),
        refetchVotes()
      ]);
    } catch (error) { }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      const newUrl = `${window.location.pathname}#${sectionId}`;
      window.history.pushState(null, null, newUrl);
    }
  };

  useEffect(() => {
    const handleFragmentScroll = () => {
      const hash = window.location.hash.substring(1);
      if (hash && data) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 500);
      }
    };

    if (data) {
      handleFragmentScroll();
    }

    const handlePopState = () => {
      handleFragmentScroll();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [data]);

  useEffect(() => {
    if (data && data.data.rounds) {
      // Use UTC time directly since dates are stored in UTC
      const currentTime = new Date();

      console.log('Current time (UTC):', currentTime.toISOString());
      console.log('Available rounds:', data.data.rounds);

      // Strategy 1: Find currently active round
      let selectedRound = data.data.rounds.find(round => {
        const startDate = new Date(round.startDate);
        const endDate = new Date(round.endDate);
        return currentTime >= startDate && currentTime <= endDate;
      });

      // Strategy 2: If no active round, find the most recent started round
      if (!selectedRound) {
        const startedRounds = data.data.rounds
          .filter(round => currentTime >= new Date(round.startDate))
          .sort((a, b) => b.roundNumber - a.roundNumber);
        selectedRound = startedRounds[0];
      }

      // Strategy 3: If user is a participant and no round is active, show the next upcoming round
      if (!selectedRound && user && (user._id === data.forId || user._id === data.againstId)) {
        const upcomingRounds = data.data.rounds
          .filter(round => currentTime < new Date(round.startDate))
          .sort((a, b) => a.roundNumber - b.roundNumber);
        selectedRound = upcomingRounds[0];
      }

      if (selectedRound) {
        setRound(selectedRound.roundNumber);
      } else {
        setRound(null);
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
      const id = user?._id;
      let type = null;
      if (data?.forId?.includes(id)) {
        type = "For";
      }
      if (data?.againstId?.includes(id)) {
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
      handleRefetch();
    }
  }, [id]);

  const prevCommentsLength = useRef(0);

  useEffect(() => {
    const currentLength = data?.data?.comments?.length || 0;
    if (currentLength > prevCommentsLength.current && scrollContainerRef.current) {
      requestAnimationFrame(() => {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      });
    }
    prevCommentsLength.current = currentLength;
  }, [data?.data?.comments]);

  // --- Related Wribates logic ---
  // This assumes your backend sends all wribates as `allWribates` in the response
  const allWribates = data?.allWribates || [];
  const currentWribateId = data?.data?._id || id;
  const currentCategory = data?.data?.category || "";

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="w-full lg:w-[70%]">
            {isLoading ? (
              <div className="bg-white p-4 sm:p-6 shadow-md rounded-sm">Loading Wribate details...</div>
            ) : data ? (
              <>
                <Header
                  data={data}
                  setShowSharePopup={setShowSharePopup}
                  scrollToSection={scrollToSection}
                  votes={votes || {}}
                />

                <div id="progress" className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 rounded-sm">
                  <ProgressBar rounds={data?.data?.rounds} />
                </div>

                <div id="voting">
                  <Voting
                    id={id}
                    setSelectedVote={setSelectedVote}
                    user={user}
                    refetch={handleRefetch}
                    data={data}
                    selectedVote={selectedVote}
                    votes={votes || {}}
                  />
                </div>

                <div id="arguments">
                  <Arguments
                    refetch={handleRefetch}
                    data={data}
                    user={user}
                    id={id}
                    round={round}
                    value={value}
                    setValue={setValue}
                  />
                </div>

                <div id="comments">
                  <Comments
                    refetch={handleRefetch}
                    id={id}
                    data={data}
                    user={user}
                    scrollContainerRef={scrollContainerRef}
                  />
                </div>
              </>
            ) : (
              <div className="bg-white p-4 sm:p-6 shadow-md rounded-sm">
                Unable to load debate details.
              </div>
            )}
          </div>

          {/* Sidebar - Hidden on mobile, 30% on desktop */}
          <Sidebar />
        </div>
      </div>

      {showSharePopup && (
        <SharePopup
          onClose={() => setShowSharePopup(false)}
          product={data?.data}
        />
      )}
    </div>
  );
}
