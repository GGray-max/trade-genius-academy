
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { UserProfile } from "@/contexts/AuthContext";
import { Loader2, Shield, UserCog, BadgeInfo } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface RoleSettingsProps {
  isAdmin: boolean;
  profile: UserProfile | null;
}

const rolePermissions = {
  user: [
    { name: "Access personal dashboard", allowed: true },
    { name: "Use bots from marketplace", allowed: true },
    { name: "Request custom bots", allowed: true },
    { name: "View analytics for owned bots", allowed: true },
    { name: "Manage subscription", allowed: true },
    { name: "Create bots", allowed: false },
    { name: "View admin dashboard", allowed: false },
    { name: "Manage other users", allowed: false },
    { name: "View system metrics", allowed: false },
  ],
  admin: [
    { name: "Access personal dashboard", allowed: true },
    { name: "Use bots from marketplace", allowed: true },
    { name: "Request custom bots", allowed: true },
    { name: "View analytics for owned bots", allowed: true },
    { name: "Manage subscription", allowed: true },
    { name: "Create bots", allowed: true },
    { name: "View admin dashboard", allowed: true },
    { name: "Manage other users", allowed: true },
    { name: "View system metrics", allowed: true },
  ],
};

const RoleSettings = ({ isAdmin, profile }: RoleSettingsProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRoleRequest = async () => {
    if (!profile) return;
    
    setIsRequesting(true);
    try {
      // In a real application, this would send a request to the backend
      // For now, we'll just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Role change request submitted successfully");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(`Failed to submit request: ${error.message}`);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Role</CardTitle>
          <CardDescription>
            Your current role and permissions in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              {isAdmin ? (
                <Shield className="h-6 w-6 text-primary" />
              ) : (
                <UserCog className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{isAdmin ? "Admin" : "User"}</h3>
                <Badge variant={isAdmin ? "default" : "secondary"}>
                  {isAdmin ? "Administrator" : "Standard User"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {isAdmin 
                  ? "You have full administrative access to the system."
                  : "You have standard user privileges."}
              </p>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableCaption>List of permissions for your current role</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80%]">Permission</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isAdmin ? rolePermissions.admin : rolePermissions.user).map((permission) => (
                  <TableRow key={permission.name}>
                    <TableCell>{permission.name}</TableCell>
                    <TableCell>
                      {permission.allowed ? (
                        <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                          Allowed
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                          Not Allowed
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {!isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Request Role Change</CardTitle>
            <CardDescription>
              Request to change your role from user to admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Admin privileges grant you additional capabilities like creating bots, managing users, and accessing advanced system features.
            </p>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Shield className="mr-2 h-4 w-4" />
                  Request Admin Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Admin Role</DialogTitle>
                  <DialogDescription>
                    Please explain why you need admin privileges. This request will be reviewed by the current administrators.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Explain why you need admin privileges..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleRoleRequest} 
                    disabled={isRequesting || !requestMessage.trim()}
                  >
                    {isRequesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="flex flex-col">
            <CardTitle>Access Control</CardTitle>
            <CardDescription>
              Information about role-based access control
            </CardDescription>
          </div>
          <BadgeInfo className="ml-auto h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-semibold">About roles:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><span className="font-semibold">User:</span> Standard access to personal bots and analytics.</li>
              <li><span className="font-semibold">Admin:</span> Full system access including user management and bot creation.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSettings;
