import React, { useEffect } from 'react'
import he from "he";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useAddArgumentMutation,
} from "../../../app/services/authApi";
import { Button } from "@/components/ui/button"; // Added missing Button import
import toast from 'react-hot-toast';

const Arguments = ({ data, user, id, round, value, setValue,refetch }) => { // Added missing props

    const [addArgument] = useAddArgumentMutation();

    const getArgumentForRound = (roundNumber, side) => {
        if (!data || !data.data || !data.data.arguments) return null;

        const argument = data.data.arguments.find(
            arg => arg.roundNumber == roundNumber && arg.panelSide === side
        );

        return argument?.text || null;
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

      // Helper function for showing login alert (added based on usage in code)
      const showLoginAlert = () => {
        // Placeholder implementation
        console.error("Login required!");
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
                toast.success("Added")
                refetch()
            }
          } catch (err) {
            console.error(err);
          }
        };


        useEffect(()=>{
             console.log(user?._id, data?.againstId, data?.forId, round)
        },[])


    return (
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

                            <div className="space-y-4 sm:space-y-6">
                                {/* For Argument - Left Side */}
                                <div className="border-l-4 border-red-500 bg-red-50 rounded-r-sm p-2 sm:p-3 ml-0 mr-auto w-full sm:w-4/5 md:w-3/4">
                                    <div className="flex items-center mb-2 sm:mb-3">
                                        <img src="/user.png" alt="" className="rounded-full w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                                        <span className="font-medium text-red-800 text-sm sm:text-base">{data.data.leadFor}</span>
                                    </div>

                                    {forArgument ? (
                                        <div
                                            className="prose max-w-none text-md sm:text-md"
                                            dangerouslySetInnerHTML={{ __html: he.decode(forArgument) }}
                                        />
                                    ) : (
                                        <p className="text-gray-500 text-md sm:text-base">No argument submitted.</p>
                                    )}
                                </div>

                                {/* Against Argument - Right Side */}
                                <div className="border-r-4 border-blue-500 bg-blue-50 p-2 sm:p-3 ml-auto mr-0 w-full sm:w-4/5 md:w-3/4">
                                    <div className="flex items-center justify-end mb-2 sm:mb-3">
                                        <span className="font-medium text-blue-800 text-sm sm:text-base">{data.data.leadAgainst}</span>
                                        <img src="/user.png" alt="" className="rounded-full w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                                    </div>

                                    {againstArgument ? (
                                        <div
                                            className="prose max-w-none text-md sm:text-md"
                                            dangerouslySetInnerHTML={{ __html: he.decode(againstArgument) }}
                                        />
                                    ) : (
                                        <p className="text-gray-500 text-right text-md sm:text-base">No argument submitted.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Argument Editor for Participants */}
            {user &&
                (user?._id === data?.forId ||
                    user?._id === data?.againstId) && round && (
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
    )
}

export default Arguments