
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-tw-blue-dark" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingScreen;
