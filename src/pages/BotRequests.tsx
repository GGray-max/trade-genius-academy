
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Loader2, MessageSquare, PlusCircle } from "lucide-react";

interface BotRequest {
  id: string;
  title: string;
  description: string;
  strategy: string;
  risk_level: string;
  market: string;
  budget: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
  admin_username?: string; // Admin assigned to this request
  admin_id?: string;
}

const BotRequests = () => {
  const { user, isAdmin } = useAuth();

  // Fetch bot requests based on user role
  const { data: requests, isLoading, isError, refetch } = useQuery({
    queryKey: ['botRequests', user?.id, isAdmin],
    queryFn: async () => {
      let query;
      
      if (isAdmin) {
        // If admin, fetch requests assigned to this admin OR not assigned to any admin
        query = supabase
          .from('bot_requests')
          .select(`
            *,
            profiles:admin_id (username)
          `)
          .or(`admin_id.eq.${user?.id},admin_id.is.null`);
      } else {
        // If regular user, fetch only their requests
        query = supabase
          .from('bot_requests')
          .select(`
            *,
            profiles:admin_id (username)
          `)
          .eq('user_id', user?.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match our interface
      return data.map((request: any) => ({
        ...request,
        admin_username: request.profiles?.username,
      })) as BotRequest[];
    },
    enabled: !!user,
  });

  const updateRequestStatus = async (requestId: string, status: 'pending' | 'in_progress' | 'completed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('bot_requests')
        .update({ status })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Refetch the requests after update
      refetch();
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const assignToMe = async (requestId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('bot_requests')
        .update({ admin_id: user.id })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Refetch the requests after update
      refetch();
    } catch (error) {
      console.error('Error assigning request:', error);
    }
  };

  // Helper functions for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {isAdmin ? 'Bot Requests Dashboard' : 'My Bot Requests'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isAdmin 
                ? 'Manage and respond to custom bot requests from users' 
                : 'Track and manage your custom trading bot requests'}
            </p>
          </div>
          
          {!isAdmin && (
            <Link to="/dashboard/request-bot">
              <Button className="bg-tw-blue hover:bg-tw-blue-dark">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-tw-blue" />
            <span className="ml-2">Loading requests...</span>
          </div>
        ) : isError ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-red-500">
                <p>Error loading requests. Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        ) : requests && requests.length > 0 ? (
          <div className="space-y-6">
            {requests.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{request.title}</CardTitle>
                      <CardDescription>
                        Requested on {new Date(request.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">Description</h4>
                      <p className="mt-1">{request.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-500">Strategy</h4>
                        <p className="capitalize">{request.strategy.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-500">Risk Level</h4>
                        <p className="capitalize">{request.risk_level}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-500">Market</h4>
                        <p className="capitalize">{request.market}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-500">Budget</h4>
                        <p>{request.budget || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="pt-4 border-t">
                        <div className="flex flex-wrap gap-2 justify-end">
                          {!request.admin_id && (
                            <Button 
                              variant="outline" 
                              onClick={() => assignToMe(request.id)}
                            >
                              Assign to Me
                            </Button>
                          )}
                          
                          {request.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                                onClick={() => updateRequestStatus(request.id, 'in_progress')}
                              >
                                Start Working
                              </Button>
                              <Button 
                                variant="outline" 
                                className="bg-red-50 text-red-700 hover:bg-red-100"
                                onClick={() => updateRequestStatus(request.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {request.status === 'in_progress' && (
                            <Button 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateRequestStatus(request.id, 'completed')}
                            >
                              Mark as Completed
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Bot Requests Yet</h3>
                <p className="text-gray-500 mb-6">
                  {isAdmin 
                    ? "There are no bot requests assigned to you at the moment."
                    : "You haven't made any custom bot requests yet."}
                </p>
                {!isAdmin && (
                  <Link to="/dashboard/request-bot">
                    <Button className="bg-tw-blue hover:bg-tw-blue-dark">
                      Request a Custom Bot
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BotRequests;
