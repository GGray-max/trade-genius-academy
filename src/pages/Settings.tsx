
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import AccountSettings from "@/components/settings/AccountSettings";
import PreferenceSettings from "@/components/settings/PreferenceSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import RoleSettings from "@/components/settings/RoleSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import AdminSettings from "@/components/settings/AdminSettings";

const Settings = () => {
  const { profile, isAdmin, refreshUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    document.title = "Settings | TradeWizard";
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Separator />
        <Tabs
          defaultValue="account"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-[600px]">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="roles">Role & Access</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
          </TabsList>
          <TabsContent value="account" className="space-y-4">
            <AccountSettings profile={profile} refreshUserProfile={refreshUserProfile} />
          </TabsContent>
          <TabsContent value="preferences" className="space-y-4">
            <PreferenceSettings />
          </TabsContent>
          <TabsContent value="security" className="space-y-4">
            <SecuritySettings />
          </TabsContent>
          <TabsContent value="roles" className="space-y-4">
            <RoleSettings isAdmin={isAdmin} profile={profile} />
          </TabsContent>
          <TabsContent value="billing" className="space-y-4">
            <BillingSettings />
          </TabsContent>
          {isAdmin && (
            <TabsContent value="admin" className="space-y-4">
              <AdminSettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
