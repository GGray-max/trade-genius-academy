
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-10 w-10 text-tw-blue animate-spin" />
      <p className="ml-2 text-lg">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
