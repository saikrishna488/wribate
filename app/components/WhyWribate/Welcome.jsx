import Link from 'next/link';
import { useState, useEffect } from 'react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

export default function WelcomeSection() {
  // Only keep shimmer for logo and track if content has loaded
  const [shimmerPosition, setShimmerPosition] = useState(-100);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Text transition states
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // The sequence of texts to display
  const textSequence = [
    "Want to hone your persuasive & writing skills?",
    "Want to make a difference in the world?",
    "Want an enjoyable reading experience?",
    "Do you want to win?"
  ];

  useEffect(() => {
    // Set loaded state after a small delay for initial transition
    const loadTimeout = setTimeout(() => {
      setHasLoaded(true);
    }, 300);

    // Shimmer effect for logo
    const shimmerInterval = setInterval(() => {
      setShimmerPosition(prev => (prev >= 100) ? -100 : prev + 2);
    }, 30);

    // Simple text transition
    const textTransitionInterval = setInterval(() => {
      // Toggle visibility to create transition effect
      if (isVisible) {
        setTimeout(() => {
          setIsVisible(false);
          // Wait for exit transition, then change text
          setTimeout(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textSequence.length);
            setIsVisible(true);
          }, 500);
        }, 3000); // Show each text for 3 seconds
      }
    }, 4000); // Total cycle time

    // Cleanup
    return () => {
      clearTimeout(loadTimeout);
      clearInterval(shimmerInterval);
      clearInterval(textTransitionInterval);
    };
  }, [isVisible, textSequence.length]);

  return (
    <div id="welcome" className="border border-slate-200 scroll-pt-16 bg-blue-50 py-16 flex-col md:min-h-screen shadow-sm w-full">
      <div className="flex flex-col lg:flex-row">
        {/* Left column - Logo only */}
        <div className="lg:w-1/3 bg-blue-50 flex flex-col px-6 py-4 items-center">
          <div className="relative overflow-hidden w-60 h-60">
            <img src="/logo.svg" alt="Wribate Logo" className="w-full h-full object-contain rounded shadow" />
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-60"
              style={{
                transform: `translateX(${shimmerPosition}%)`,
                width: '100%',
                left: '0'
              }}
            ></div>
          </div>
          <strong className="text-blue-900 text-2xl mt-10">Wribate = Write + Debate</strong>
        </div>

        {/* Right column - Content and static text */}
        <div className="lg:w-2/3 px-6 py-4 flex flex-col items-center bg-blue-50">
          {/* Title */}
          <h2 className="text-3xl md:text-5xl text-center font-bold text-slate-900 border-b border-blue-200 pb-3">
            Step into the World of <span className="text-blue-900">Wribate™</span>
          </h2>
          
          {/* Animated text sequence */}
          <div
            className="my-4 bg-white rounded p-4 transition-all duration-500 ease-in-out shadow-sm w-full"
            style={{
              opacity: hasLoaded ? 1 : 0,
              transform: hasLoaded ? 'translateY(0)' : 'translateY(20px)',
              // height: '80px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div 
              className="text-slate-800 text-2xl text-center font-medium"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-50px)",
                transition: "opacity 0.5s ease, transform 0.5s ease"
              }}
            >
              {textSequence[currentTextIndex]}
            </div>
          </div>

          {/* Description bullets */}
          <ul
            className="space-y-2 list-none mt-4 transition-all duration-500 ease-in-out delay-100"
            style={{
              opacity: hasLoaded ? 1 : 0,
              transform: hasLoaded ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <li className="text-slate-700 text-center mb-8 font-semibold text-3xl flex items-start">
              <span>Are you passionate about something, anything?</span>
            </li>
            <li className="text-slate-700 font-bold text-center text-2xl flex items-start">
              <span>A wide variety of subject-matters is open to Wribate – from Politics to Economy,
                from Technology to Religion.</span>
            </li>
          </ul>

          {/* CTA button */}
          <Link
            href="/subscriptions"
            className="mt-6 px-6 py-2 bg-indigo-800 rounded-full text-white text-2xl font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto transition-all duration-500 ease-in-out delay-300"
            style={{
              opacity: hasLoaded ? 1 : 0,
              transform: hasLoaded ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            Join, Wribate™  and Win.
          </Link>
        </div>
      </div>
    </div>
  );}