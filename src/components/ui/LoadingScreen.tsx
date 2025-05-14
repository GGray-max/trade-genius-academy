
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  const [loadingText, setLoadingText] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  
  const loadingTips = [
    "Analyzing market trends...",
    "Calculating optimal strategies...",
    "Checking trading signals...",
    "Connecting to exchanges...",
    "Optimizing algorithms...",
    "Scanning for opportunities...",
    "Synchronizing data...",
    "Loading your portfolio...",
    "Preparing your dashboard...",
    "Crunching the numbers..."
  ];

  useEffect(() => {
    const fullText = message;
    let currentIndex = 0;

    // Typing effect
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setLoadingText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);

    // Change tips every 3 seconds
    const tipsInterval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % loadingTips.length);
    }, 3000);

    return () => {
      clearInterval(typingInterval);
      clearInterval(tipsInterval);
    };
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-tw-blue to-tw-green opacity-75 blur"></div>
        <Loader2 className="relative h-12 w-12 animate-spin text-white" />
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xl font-medium text-tw-blue-dark">{loadingText}</p>
        <p className="mt-2 text-sm text-gray-500 animate-pulse">{loadingTips[tipIndex]}</p>
      </div>
      
      <div className="mt-8 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-tw-blue to-tw-green animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
