import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export default function WribateVsDebate() {
    const [currentPage, setCurrentPage] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const points = [
        "**Depth Over Instant Rebuttals** – Thoughtful research instead of impulsive counterarguments.",
        "**Clarity & Precision** – Written discourse ensures structured, coherent expression.",
        "**Permanent & Shareable** – Creates lasting records to revisit and share globally.",
        "**Inclusivity & Accessibility** – Engage at your own pace, breaking barriers of time and location.",
        "**Freedom from Manipulation** – Logic prevails over rhetoric and emotional tactics.",
        "**Stronger Persuasion** – Well-crafted arguments lead to enduring influence.",
        "**Encourages Reflection** – Refine viewpoints for meaningful discussions.",
        "**Truth Prevails** – Falsehoods are challenged with facts and accountability."
    ];

    // Split points into groups of 4
    const pointsPerPage = 4;
    const totalPages = Math.ceil(points.length / pointsPerPage);
    
    const getPagePoints = (pageIndex) => {
        const startIndex = pageIndex * pointsPerPage;
        return points.slice(startIndex, startIndex + pointsPerPage);
    };

    useEffect(() => {
        let interval;

        if (!isPaused) {
            interval = setInterval(() => {
                setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
            }, 8000); // Change page every 8 seconds
        }

        return () => clearInterval(interval);
    }, [isPaused, totalPages]);

    const nextPage = () => {
        setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    return (
        <div id="wribate-vs-debate" className="w-full  md:min-h-screen py-16 bg-gray-50 overflow-hidden transition-all duration-300">
            <div className="container mx-auto px-4">
                <h2 className="text-5xl font-bold mb-8 text-center text-blue-800">
                    Wribate  <span className='text-black'>vs. Debate</span>
                </h2>
                
                <div className="flex flex-col md:flex-row  overflow-hidden">
                    {/* Left side - Image */}
                    <div className="md:w-1/2 flex justify-center p-6 ">
                        <div className="relative w-full h-64 md:h-96 transform hover:scale-105 transition-transform duration-500">
                            <img
                                src="/whywribate/debatevswribate.png"
                                alt="Wribate vs Debate Illustration"
                                className="rounded-lg object-contain w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Right side - Text with rows */}
                    <div className="md:w-1/2 p-6 flex flex-col">
                        <div className="flex-grow flex flex-col justify-center">
                            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <ul className="space-y-4">
                                    {getPagePoints(currentPage).map((point, index) => (
                                        <li 
                                            key={index + currentPage * pointsPerPage}
                                            className="flex items-start text-2xl"
                                        >
                                            {/* <div className="mr-2 mt-1 flex-shrink-0">
                                                <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
                                            </div> */}
                                            <p
                                                className="text-slate-700"
                                                dangerouslySetInnerHTML={{ 
                                                    __html: point.replace(
                                                        /\*\*(.*?)\*\*/g, 
                                                        '<strong class="text-blue-700">$1</strong>'
                                                    ) 
                                                }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={prevPage}
                                className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors duration-300 shadow-md hover:shadow-lg"
                                aria-label="Previous page"
                            >
                                <ChevronLeft size={20} className="text-orange-700" />
                            </button>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={togglePause}
                                    className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors duration-300 shadow-md hover:shadow-lg"
                                    aria-label={isPaused ? "Play" : "Pause"}
                                >
                                    {isPaused ? 
                                        <Play size={16} className="text-orange-700" /> : 
                                        <Pause size={16} className="text-orange-700" />
                                    }
                                </button>
                                <span className="text-sm text-orange-600 font-medium">
                                    {currentPage + 1} / {totalPages}
                                </span>
                            </div>

                            <button
                                onClick={nextPage}
                                className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors duration-300 shadow-md hover:shadow-lg"
                                aria-label="Next page"
                            >
                                <ChevronRight size={20} className="text-orange-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}