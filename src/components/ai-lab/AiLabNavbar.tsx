import { Link } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface AiLabNavbarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AiLabNavbar = ({ collapsed, onToggle }: AiLabNavbarProps) => {
  const { user, profile, signOut } = useAuth();
  const initials = profile?.username?.substring(0, 2).toUpperCase() || "U";

  return (
    <header
      className={cn(
        "z-40 w-full h-12 flex items-center justify-between px-4 sticky top-0 bg-[#1e2438]/80 backdrop-blur-lg border-b border-white/10"
      )}
    >
      {/* Left – home */}
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" asChild>
          <Link to="/">
            <Home className="h-5 w-5 text-white" />
          </Link>
        </Button>
      </div>

      {/* Right – toggle + avatar */}
      <div className="flex items-center gap-3">
        {/* Neon hollow ring toggle */}
        <button
          onClick={onToggle}
          aria-label="Toggle AI Assistant"
          className="relative h-10 w-10 focus:outline-none"
        >
          {/* Static glowing ring */}
          <span className="absolute inset-0 rounded-full border-2 border-cyan-300/80 shadow-[0_0_10px_3px_rgba(0,255,255,0.6)]" />
          {/* Soft outer glow */}
          <span className="absolute inset-0 rounded-full border-2 border-cyan-300/60 blur-md opacity-70" />
          {/* Clockwise light trail */}
          <span
            className="absolute inset-0 rounded-full border-t-2 border-l-2 border-cyan-200/80 blur-sm animate-spin"
            style={{ animationDuration: '1s' }}
          />
          {/* Counter-clockwise light trail */}
          <span
            className="absolute inset-0 rounded-full border-b-2 border-r-2 border-cyan-200/60 blur-sm"
            style={{ animation: 'spinReverse 1.4s linear infinite' }}
          />
        </button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border border-white/20">
                <AvatarFallback className="bg-tw-blue text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-[#2b3248]/90 text-white border border-white/10">
              <DropdownMenuItem onClick={signOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    <style>{`
          @keyframes spinReverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        `}</style>
    </header>
  );
};

export default AiLabNavbar;
