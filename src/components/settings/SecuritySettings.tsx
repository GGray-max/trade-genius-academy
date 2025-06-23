import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Shield, Key, LogOut, AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface LoginActivity {
  id: string;
  device: string;
  location: string;
  ip: string;
  timestamp: string;
  current: boolean;
}

const SecuritySettings = () => {
  const { profile, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [showNewApiKey, setShowNewApiKey] = useState(false);
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);

  // Mock data for login activity
  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const mockLoginActivity: LoginActivity[] = [
      {
        id: "1",
        device: "Chrome on Windows",
        location: "New York, USA",
        ip: "192.168.1.1",
        timestamp: new Date().toISOString(),
        current: true,
      },
      {
        id: "2",
        device: "Safari on macOS",
        location: "San Francisco, USA",
        ip: "192.168.1.2",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        current: false,
      },
      {
        id: "3",
        device: "Firefox on Ubuntu",
        location: "London, UK",
        ip: "192.168.1.3",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        current: false,
      },
    ];
    setLoginActivity(mockLoginActivity);
  }, []);

  const handleToggle2FA = async (enable: boolean) => {
    setIsLoading(true);
    try {
      // In a real application, this would call your backend API to enable/disable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIs2FAEnabled(enable);
      toast.success(`Two-factor authentication ${enable ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      toast.error(`Failed to ${enable ? 'enable' : 'disable'} 2FA: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetApiKey = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would call your backend API to reset the API key
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockApiKey = `tw_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setNewApiKey(mockApiKey);
      setShowNewApiKey(true);
      toast.success("API key reset successfully");
    } catch (error: any) {
      toast.error(`Failed to reset API key: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOutAllSessions = async () => {
    setIsLoading(true);
    try {
      // Sign out from all sessions
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) throw error;

      // Sign out from current session and redirect to login
      await signOut();
      toast.success("Signed out from all sessions");
    } catch (error: any) {
      toast.error(`Failed to sign out from all sessions: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by requiring a verification code in addition to your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Switch
              checked={is2FAEnabled}
              onCheckedChange={handleToggle2FA}
              disabled={isLoading}
            />
            <div>
              <p className="font-medium">{is2FAEnabled ? "Enabled" : "Disabled"}</p>
              <p className="text-sm text-muted-foreground">
                {is2FAEnabled
                  ? "Your account is protected with two-factor authentication."
                  : "Enable two-factor authentication for enhanced security."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key
          </CardTitle>
          <CardDescription>
            Manage your API key for accessing the TradeWizard API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewApiKey ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-slate-50">
                <Label>Your new API key</Label>
                <div className="flex mt-2">
                  <Input 
                    value={newApiKey} 
                    readOnly 
                    className="font-mono"
                  />
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      navigator.clipboard.writeText(newApiKey);
                      toast.success("API key copied to clipboard");
                    }}
                    className="ml-2"
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-amber-600 mt-2 flex items-center text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Make sure to copy this key now. You won't be able to see it again!
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowNewApiKey(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleResetApiKey} 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Key className="mr-2 h-4 w-4" />
              )}
              Reset API Key
            </Button>
          )}
          <p className="text-sm text-muted-foreground">
            Resetting your API key will invalidate your existing key. Applications using the old key will stop working.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Login Activity</CardTitle>
          <CardDescription>
            Review recent logins to your account. If you see any suspicious activity, change your password and sign out of all sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.device}</TableCell>
                  <TableCell>{activity.location}</TableCell>
                  <TableCell>{activity.ip}</TableCell>
                  <TableCell>{formatDate(activity.timestamp)}</TableCell>
                  <TableCell>
                    {activity.current ? (
                      <span className="text-green-600 font-medium">Current</span>
                    ) : (
                      <span className="text-gray-600">Previous</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out All Sessions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out of all sessions?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will sign you out of all devices, including this one. You'll need to sign in again on each device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleSignOutAllSessions}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Sign Out All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SecuritySettings;