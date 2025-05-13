
import { Shield, Users, Bot, AlertTriangle, CheckCircle, Database } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminDashboard = () => {
  // Mock data for admin dashboard
  const totalUsers = 1245;
  const totalBots = 87;
  const pendingAudits = 14;
  const totalRevenue = "$25,789.45";

  const recentUsers = [
    { id: "U1234", name: "Alice Johnson", email: "alice@example.com", joined: "2023-05-10", status: "active" },
    { id: "U1235", name: "Bob Smith", email: "bob@example.com", joined: "2023-05-11", status: "active" },
    { id: "U1236", name: "Carol Davis", email: "carol@example.com", joined: "2023-05-12", status: "pending" },
    { id: "U1237", name: "David Wilson", email: "david@example.com", joined: "2023-05-13", status: "active" },
  ];

  const pendingBots = [
    { id: "B789", name: "Crypto Wizard", developer: "TradeMaster", submitted: "2023-05-10", risk: "medium" },
    { id: "B790", name: "Forex Ninja", developer: "ForexGuru", submitted: "2023-05-11", risk: "high" },
    { id: "B791", name: "Stock Hunter", developer: "StockPro", submitted: "2023-05-12", risk: "low" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Complete platform overview and management tools.
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<Users />}
            trend="up"
            trendValue="+12% this month"
          />
          <StatCard
            title="Total Bots"
            value={totalBots}
            icon={<Bot />}
            trend="up"
            trendValue="+5 this week"
          />
          <StatCard
            title="Pending Audits"
            value={pendingAudits}
            icon={<Shield />}
            trend="down"
            trendValue="-3 from yesterday"
          />
          <StatCard
            title="Total Revenue"
            value={totalRevenue}
            icon={<Database />}
            trend="up"
            trendValue="+8.3% this month"
          />
        </div>

        {/* Recent users table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Users</CardTitle>
            <CardDescription>Newly registered platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.joined}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active" 
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="destructive" size="sm">Suspend</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button variant="outline" className="w-full">View All Users</Button>
            </div>
          </CardContent>
        </Card>

        {/* Bot audits table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Pending Bot Audits</CardTitle>
            <CardDescription>Bots awaiting review and approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Bot Name</TableHead>
                  <TableHead>Developer</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingBots.map((bot) => (
                  <TableRow key={bot.id}>
                    <TableCell className="font-medium">{bot.id}</TableCell>
                    <TableCell>{bot.name}</TableCell>
                    <TableCell>{bot.developer}</TableCell>
                    <TableCell>{bot.submitted}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        bot.risk === "low" 
                          ? "bg-green-100 text-green-800"
                          : bot.risk === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}>
                        {bot.risk}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-tw-blue hover:bg-tw-blue-dark">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button variant="outline" className="w-full">View All Audits</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
