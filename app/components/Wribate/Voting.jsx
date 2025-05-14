import React from 'react'
import VotesChart from "../../components/Wribate/Chart";
import {
    useAddVoteMutation,
} from "../../../app/services/authApi";
import toast from 'react-hot-toast';

const Voting = ({ data, selectedVote, votes, user, refetch, setSelectedVote, id }) => {
    
    const [addVote] = useAddVoteMutation();
    
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
            toast.success("Already voted")
        }
    };
    
    // Helper function for showing login alert (added based on usage in code)
    const showLoginAlert = () => {
        // Placeholder implementation
        toast.error("Login to continue!");
    };
    
    return (
        <div className="bg-white border border-gray-200 shadow-sm mb-4 sm:mb-6 rounded-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold">Cast Your Vote</h2>
                <div className="my-3 sm:my-4">
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
            
            <div className="p-3 sm:p-4 bg-gray-50">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Voting Results</h2>
                {votes?.roundVoteCounts && (
                    <VotesChart
                        data={votes?.roundVoteCounts}
                        title={data?.data?.title}
                    />
                )}
            </div>
        </div>
    )
}

export default Voting