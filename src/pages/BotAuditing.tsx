
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Shield, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { mockBots } from "@/data/mockData";
import { Bot } from "@/types";
import { Progress } from "@/components/ui/progress";
import LoadingScreen from "@/components/ui/LoadingScreen";

const BotAuditing = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    document.title = "Bot Auditing | TradeWizard";
    // Simulate API call with a delay
    const fetchBots = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        // Filter and process mock bots based on audit status
        const processedBots = mockBots.map(bot => ({
          ...bot,
          auditStatus: getRandomAuditStatus(),
          auditProgress: Math.floor(Math.random() * 100),
          lastAuditDate: getRandomDate(),
          auditor: getRandomAuditor()
        }));
        setBots(processedBots);
        setLoading(false);
      }, 800);
    };

    fetchBots();
  }, []);

  const getRandomAuditStatus = () => {
    const statuses = ["pending", "in_progress", "approved", "rejected"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getRandomDate = () => {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const getRandomAuditor = () => {
    const auditors = ["John Smith", "Emma Johnson", "Michael Davis", "Sarah Wilson", "System"];
    return auditors[Math.floor(Math.random() * auditors.length)];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case "in_progress":
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> In Progress</Badge>;
      case "approved":
        return <Badge variant="success"><CheckCircle className="mr-1 h-3 w-3" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleApproveBot = (botId: string) => {
    // In a real app, this would be an API call
    toast.success("Bot approved successfully");
    // Update local state to reflect the change
    setBots(
      bots.map((bot) =>
        bot.id === botId ? { ...bot, auditStatus: "approved" } : bot
      )
    );
  };

  const handleRejectBot = (botId: string) => {
    // In a real app, this would be an API call
    toast.error("Bot rejected");
    // Update local state to reflect the change
    setBots(
      bots.map((bot) =>
        bot.id === botId ? { ...bot, auditStatus: "rejected" } : bot
      )
    );
  };

  const handleStartAudit = (botId: string) => {
    // In a real app, this would be an API call
    toast.info("Audit started");
    // Update local state to reflect the change
    setBots(
      bots.map((bot) =>
        bot.id === botId ? { ...bot, auditStatus: "in_progress", auditProgress: 10 } : bot
      )
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingScreen message="Loading bot audit data..." />
      </DashboardLayout>
    );
  }

  const pendingBots = bots.filter(bot => bot.auditStatus === "pending");
  const inProgressBots = bots.filter(bot => bot.auditStatus === "in_progress");
  const approvedBots = bots.filter(bot => bot.auditStatus === "approved");
  const rejectedBots = bots.filter(bot => bot.auditStatus === "rejected");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6 text-tw-blue" />
            Bot Auditing
          </h1>
          <p className="text-muted-foreground mt-2">
            Review, verify, and approve trading bots before they go live on the marketplace
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBots.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressBots.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedBots.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedBots.length}</div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <Tabs
          defaultValue="pending"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Audit</CardTitle>
                <CardDescription>
                  These bots are waiting for audit review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bot Name</TableHead>
                      <TableHead>Developer</TableHead>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBots.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">No pending bots</TableCell>
                      </TableRow>
                    ) : (
                      pendingBots.map((bot) => (
                        <TableRow key={bot.id}>
                          <TableCell className="font-medium">{bot.name}</TableCell>
                          <TableCell>{bot.developer?.name || "Unknown"}</TableCell>
                          <TableCell>{bot.strategy}</TableCell>
                          <TableCell>{bot.riskLevel}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => handleStartAudit(bot.id)}
                              >
                                Start Audit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="in_progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>In Progress</CardTitle>
                <CardDescription>
                  Bots currently being audited
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bot Name</TableHead>
                      <TableHead>Auditor</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inProgressBots.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">No bots in progress</TableCell>
                      </TableRow>
                    ) : (
                      inProgressBots.map((bot) => (
                        <TableRow key={bot.id}>
                          <TableCell className="font-medium">{bot.name}</TableCell>
                          <TableCell>{bot.auditor}</TableCell>
                          <TableCell className="w-[300px]">
                            <div className="flex items-center gap-2">
                              <Progress value={bot.auditProgress} className="h-2" />
                              <span className="text-xs">{bot.auditProgress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleApproveBot(bot.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRejectBot(bot.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Bots</CardTitle>
                <CardDescription>
                  Bots that passed audit and are live on the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bot Name</TableHead>
                      <TableHead>Developer</TableHead>
                      <TableHead>Approved On</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedBots.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">No approved bots</TableCell>
                      </TableRow>
                    ) : (
                      approvedBots.map((bot) => (
                        <TableRow key={bot.id}>
                          <TableCell className="font-medium">{bot.name}</TableCell>
                          <TableCell>{bot.developer?.name || "Unknown"}</TableCell>
                          <TableCell>{bot.lastAuditDate.toLocaleDateString()}</TableCell>
                          <TableCell>{bot.auditor}</TableCell>
                          <TableCell>{getStatusBadge("approved")}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rejected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Bots</CardTitle>
                <CardDescription>
                  Bots that failed the audit process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bot Name</TableHead>
                      <TableHead>Developer</TableHead>
                      <TableHead>Rejected On</TableHead>
                      <TableHead>Rejected By</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedBots.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">No rejected bots</TableCell>
                      </TableRow>
                    ) : (
                      rejectedBots.map((bot) => (
                        <TableRow key={bot.id}>
                          <TableCell className="font-medium">{bot.name}</TableCell>
                          <TableCell>{bot.developer?.name || "Unknown"}</TableCell>
                          <TableCell>{bot.lastAuditDate.toLocaleDateString()}</TableCell>
                          <TableCell>{bot.auditor}</TableCell>
                          <TableCell>{getStatusBadge("rejected")}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BotAuditing;
