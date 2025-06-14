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

// API
import {
  useGetVotesQuery,
} from "../../../app/services/authApi";

// State
import { chatAtom, userAtom } from "@/app/states/GlobalStates";

// Custom Components
import SharePopup from "../../components/SharePopup";
import ProgressBar from "../../components/Wribate/ProgressBar";
import httpRequest from "@/app/utils/httpRequest";
import axios from "axios";
import authHeader from "@/app/utils/authHeader";

export default function WribateContent() {
  const [user] = useAtom(userAtom);
  const [selectedVote, setSelectedVote] = useState(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [round, setRound] = useState(null);
  const [value, setValue] = useState("");
  const scrollContainerRef = useRef(null);
  const router = useRouter();
  const { id } = useParams();
  const [wribate, setWribate] = useState({});
  // const { data, isLoading, refetch } = useGetMyWribateByIdQuery(id);
  const { data: votes, isLoading: votesLoading, refetch: refetchVotes } = useGetVotesQuery(id);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true)


  //fetch wribate
  const fetchWribate = async () => {
    const data = await httpRequest(axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/getWribateById/' + id, {
      headers: authHeader()
    }))

    setWribate(data.wribate);
    setData(data);
    setIsLoading(false)
  }

  useEffect(() => {
    fetchWribate()
  }, [])

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




  // Return current round
  useEffect(() => {
    if (wribate?.rounds?.length) {
      const currentTime = new Date();

      const runningRound = wribate.rounds.find(round => {
        const start = new Date(round.startDate);
        const end = new Date(round.endDate);
        return currentTime >= start && currentTime <= end;
      });

      setRound(runningRound ? runningRound.roundNumber : null);
    }
  }, [wribate]);
  

  useEffect(() => {
    if (id) {
      handleRefetch();
    }
  }, [id]);

  const prevCommentsLength = useRef(0);

  useEffect(() => {
    const currentLength = wribate?.comments?.length || 0;
    if (currentLength > prevCommentsLength.current && scrollContainerRef.current) {
      requestAnimationFrame(() => {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      });
    }
    prevCommentsLength.current = currentLength;
  }, [wribate.comments]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="w-full lg:w-[70%]">
            {isLoading ? (
              <div className="bg-white p-4 sm:p-6 shadow-md rounded-sm">Loading Wribate details...</div>
            ) : wribate ? (
              <>
                <Header
                  wribate={wribate}
                  setShowSharePopup={setShowSharePopup}
                  scrollToSection={scrollToSection}
                  votes={votes || {}}
                />

                <div id="progress" className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 rounded-sm">
                  <ProgressBar rounds={wribate?.rounds} />
                </div>

                <div id="voting">
                  <Voting
                    id={id}
                    setSelectedVote={setSelectedVote}
                    user={user}
                    refetch={handleRefetch}
                    wribate={wribate}
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
                    wribate={wribate}
                  />
                </div>

                <div id="comments">
                  <Comments
                    refetch={handleRefetch}
                    id={id}
                    wribate={wribate}
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
