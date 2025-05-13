
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bot,
  ChartLine,
  Settings,
  ShoppingCart,
  Users,
  Shield,
  Bell,
  LogOut,
  MessageSquare
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const { profile, isAdmin, signOut } = useAuth();
  
  // User role from auth context
  const userRole = isAdmin ? 'admin' : 'user';

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["user", "developer", "admin"] },
    { name: "My Bots", href: "/dashboard/bots", icon: Bot, roles: ["user", "developer", "admin"] },
    { name: "Analytics", href: "/dashboard/analytics", icon: ChartLine, roles: ["user", "developer", "admin"] },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart, roles: ["user", "developer", "admin"] },
    { name: "Request Custom Bot", href: "/dashboard/request-bot", icon: MessageSquare, roles: ["user"] },
    { name: "My Bot Requests", href: "/dashboard/bot-requests", icon: MessageSquare, roles: ["user", "admin"] },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["user", "developer", "admin"] },
    // Admin specific routes
    { name: "User Management", href: "/dashboard/users", icon: Users, roles: ["admin"] },
    { name: "Bot Auditing", href: "/dashboard/audit", icon: Shield, roles: ["admin"] },
    { name: "Bot Management", href: "/dashboard/admin/bot-management", icon: Bot, roles: ["admin"] },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  // Check if the current path is in the navigation items
  const isActiveRoute = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-tw-blue to-tw-green rounded-md w-8 h-8"></div>
              <span className="font-bold text-xl">TradeWizard</span>
            </Link>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActiveRoute(item.href)
                      ? "bg-tw-blue-light bg-opacity-15 text-tw-blue"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActiveRoute(item.href)
                        ? "text-tw-blue"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-5 w-5"
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* User profile section */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div>
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {profile?.username?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{profile?.username || 'User'}</p>
                <p className="text-xs font-medium text-gray-500 capitalize">{userRole}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              {/* Mobile menu button */}
              <button type="button" className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-tw-blue">
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notification dropdown */}
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="sr-only">View notifications</span>
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
