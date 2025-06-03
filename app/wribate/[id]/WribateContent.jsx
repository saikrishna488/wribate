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
      handleRefetch();
    }
  }, [id]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      requestAnimationFrame(() => {
        const container = scrollContainerRef.current;
        container.scrollTop = container.scrollHeight;
      });
    }
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
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Wribate Progress</h2>
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
          <Sidebar
            category={currentCategory}
            country={data?.data?.country || ""}
            allWribates={allWribates}
            currentWribateId={currentWribateId}
          />
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
