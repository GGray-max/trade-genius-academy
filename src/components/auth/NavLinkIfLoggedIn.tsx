import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface NavLinkIfLoggedInProps {
  to: string;
  children: ReactNode;
}

/**
 * Renders a navigation link only when the user is authenticated.
 * Falls back to null when no authenticated user is present.
 * TODO: Enhance with role-based visibility if needed.
 */
const NavLinkIfLoggedIn = ({ to, children }: NavLinkIfLoggedInProps) => {
  const { user, profile } = useAuth();
  if (!user || !profile) return null;
  return (
    <Link to={to} className="hidden md:block">
      <Button variant="outline">{children}</Button>
    </Link>
  );
};

export default NavLinkIfLoggedIn;
