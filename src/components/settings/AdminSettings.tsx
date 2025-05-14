
import { useState } from "react";
import { toast } from "sonner";
import { 
  Users, 
  Bot, 
  LineChart, 
  Database, 
  Shield,
  User,
  Search,
  ArrowUpDown,
  MoreHorizontal 
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

// Mock users data
const users = [
  { id: "user1", username: "john_doe", email: "john@example.com", role: "user", status: "active", created: "2025-01-15" },
  { id: "user2", username: "jane_smith", email: "jane@example.com", role: "admin", status: "active", created: "2025-02-10" },
  { id: "user3", username: "mike_jones", email: "mike@example.com", role: "user", status: "inactive", created: "2025-03-05" },
  { id: "user4", username: "sarah_brown", email: "sarah@example.com", role: "user", status: "active", created: "2025-04-20" },
];

// Mock bots data
const bots = [
  { id: "bot1", name: "TrendTracker", strategy: "Trend Following", risk: "Medium", status: "active", users: 42 },
  { id: "bot2", name: "VolatilityHunter", strategy: "Volatility Breakout", risk: "High", status: "active", users: 29 },
  { id: "bot3", name: "StableCoin", strategy: "Mean Reversion", risk: "Low", status: "maintenance", users: 57 },
  { id: "bot4", name: "ScalpMaster", strategy: "Scalping", risk: "High", status: "development", users: 0 },
];

// Mock system metrics
const systemMetrics = {
  activeUsers: 128,
  activeBots: 24,
  totalRequests: 5462,
  avgResponseTime: 320, // ms
  errorRate: 0.5, // percent
  serverLoad: 28, // percent
};

const AdminSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [botSearchQuery, setBotSearchQuery] = useState("");
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );
  
  const filteredBots = bots.filter(bot => 
    bot.name.toLowerCase().includes(botSearchQuery.toLowerCase()) ||
    bot.strategy.toLowerCase().includes(botSearchQuery.toLowerCase())
  );

  const handleChangeUserRole = (userId: string, newRole: string) => {
    toast.success(`User role updated to ${newRole}`);
  };

  const handleToggleBotStatus = (botId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toast.success(`Bot status changed to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Users</p>
                <p className="text-2xl font-bold">{systemMetrics.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Bots</p>
                <p className="text-2xl font-bold">{systemMetrics.activeBots}</p>
              </div>
              <Bot className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Error Rate</p>
                <p className="text-2xl font-bold">{systemMetrics.errorRate}%</p>
              </div>
              <LineChart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">
            <User className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="bots">
            <Bot className="h-4 w-4 mr-2" />
            Bot Management
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="h-4 w-4 mr-2" />
            System Metrics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>User Management</span>
                <Button onClick={() => navigate("/dashboard/users")}>
                  View All Users
                </Button>
              </CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "outline"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "success" : "secondary"}
                                className={user.status === "active" ? "bg-green-100 text-green-800" : ""}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleChangeUserRole(user.id, user.role === "admin" ? "user" : "admin")}
                              >
                                {user.role === "admin" ? "Remove Admin Role" : "Make Admin"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toast.success(`Reset password link sent to ${user.email}`)}
                              >
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => toast.success(`User ${user.username} suspended`)}
                              >
                                Suspend User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bots" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Bot Management</span>
                <Button onClick={() => navigate("/dashboard/admin/bot-management")}>
                  Manage All Bots
                </Button>
              </CardTitle>
              <CardDescription>
                Monitor and manage trading bots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bots..."
                  value={botSearchQuery}
                  onChange={(e) => setBotSearchQuery(e.target.value)}
                  className="max-w-md"
                />
                <Button 
                  variant="outline"
                  className="ml-2"
                  onClick={() => navigate("/dashboard/bots/create")}
                >
                  Create New Bot
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBots.map(bot => (
                      <TableRow key={bot.id}>
                        <TableCell className="font-medium">{bot.name}</TableCell>
                        <TableCell>{bot.strategy}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            bot.risk === "Low" ? "border-green-500 text-green-700" :
                            bot.risk === "Medium" ? "border-amber-500 text-amber-700" :
                            "border-red-500 text-red-700"
                          }>
                            {bot.risk}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={bot.status === "active" ? "success" : "secondary"}
                                 className={
                                   bot.status === "active" ? "bg-green-100 text-green-800" :
                                   bot.status === "maintenance" ? "bg-amber-100 text-amber-800" :
                                   "bg-blue-100 text-blue-800"
                                 }>
                            {bot.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{bot.users}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleToggleBotStatus(bot.id, bot.status)}
                              >
                                {bot.status === "active" ? "Disable Bot" : "Enable Bot"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toast.success(`${bot.name} settings opened`)}
                              >
                                Edit Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toast.success(`${bot.name} performance data exported`)}
                              >
                                Export Performance Data
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Metrics</CardTitle>
              <CardDescription>
                Key performance metrics for the TradeWizard platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.activeUsers}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Bots
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.activeBots}</div>
                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      API Requests (24h)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.totalRequests.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+18% from yesterday</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.avgResponseTime} ms</div>
                    <p className="text-xs text-muted-foreground">-5% from last week</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Error Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.errorRate}%</div>
                    <p className="text-xs text-muted-foreground">-0.2% from last week</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Server Load
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.serverLoad}%</div>
                    <p className="text-xs text-muted-foreground">+2% from last hour</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Detailed Analytics
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
