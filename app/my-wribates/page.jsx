"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom } from "../states/GlobalStates";
import getAuthHeader from "../utils/authHeader";
import httpRequest from "../utils/httpRequest";
import WribateCard from "./WribateCard"; // Adjust path as needed

const Home = () => {
  const [user] = useAtom(userAtom);
  const [wribates, setWribates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWribates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await httpRequest(
        axios.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/user/myWribates',
          {
            _id: user._id,
            email: user.email // Fixed: using user.email instead of user._id
          },
          {
            headers: getAuthHeader()
          }
        ),
        null
      );
      
      setWribates(response.wribates)
    } catch (err) {
      console.error('Error fetching wribates:', err);
      setError('Failed to load wribates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchWribates();
    }
  }, [user]);

  const handleWribateClick = (wribate) => {
    // Handle wribate card click - navigate to detail page or perform action
    console.log('Clicked wribate:', wribate);
    // Example: router.push(`/wribate/${wribate._id}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading your wribates...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wribates</h1>
          <p className="text-gray-600">
            {wribates.length > 0 
              ? `You have ${wribates.length} wribate${wribates.length !== 1 ? 's' : ''}`
              : 'No wribates found'
            }
          </p>
        </div>

        {wribates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wribates.map((wribate) => (
              <WribateCard
                key={wribate._id}
                wribate={wribate}
                onClick={() => handleWribateClick(wribate)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No wribates yet</div>
            <p className="text-gray-400 mb-6">
              Start creating your first wribate to see it here.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Create New Wribate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;