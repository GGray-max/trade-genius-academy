
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { LogIn, User } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-tw-blue to-tw-green rounded-md w-8 h-8"></div>
            <span className="font-bold text-xl">TradeWizard</span>
          </Link>
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Marketplace</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-tw-blue-light to-tw-blue-dark p-6 no-underline outline-none focus:shadow-md"
                          href="/marketplace"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Bot Marketplace
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Discover top-performing trading bots from our community of developers
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link
                        to="/marketplace/trending"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Trending Bots</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Most popular bots this week
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/marketplace/leaderboard"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Leaderboard</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Top performing bots by ROI
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/marketplace/new"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">New Releases</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Recently launched trading bots
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/pricing" className="flex items-center gap-1 px-4 py-2">
                  Pricing
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/features" className="flex items-center gap-1 px-4 py-2">
                  Features
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/docs" className="flex items-center gap-1 px-4 py-2">
                  Docs
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link to="/profile">
                <div className="w-9 h-9 rounded-full bg-tw-blue-dark text-white flex items-center justify-center text-sm font-medium">
                  JD
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-tw-blue hover:bg-tw-blue-dark">
                  <User className="mr-2 h-4 w-4" />
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
