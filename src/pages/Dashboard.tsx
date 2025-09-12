import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LogOut, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import SubscriptionCard from "@/components/SubscriptionCard";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";
import SpendingChart from "@/components/SpendingChart";
import InsightsPanel from "@/components/InsightsPanel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { User, Session } from '@supabase/supabase-js';

interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingPeriod: "monthly" | "yearly";
  startDate: string;
  notes?: string;
}

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load subscriptions from Supabase
  const loadSubscriptions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error loading subscriptions",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const formattedData = data.map(sub => ({
        id: sub.id,
        name: sub.name,
        cost: parseFloat(sub.cost.toString()),
        billingPeriod: sub.billing_period as "monthly" | "yearly",
        startDate: sub.start_date,
        notes: sub.notes || undefined
      }));

      setSubscriptions(formattedData);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          window.location.href = "/login";
          return;
        }

        // Load subscriptions when user logs in
        if (session?.user && event !== 'SIGNED_OUT') {
          await loadSubscriptions(session.user.id);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        window.location.href = "/login";
        return;
      }

      // Load subscriptions for existing session
      loadSubscriptions(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const monthlyTotal = subscriptions
    .filter(sub => sub.billingPeriod === "monthly")
    .reduce((sum, sub) => sum + sub.cost, 0);
  
  const yearlyFromMonthly = monthlyTotal * 12;
  const yearlyTotal = subscriptions
    .filter(sub => sub.billingPeriod === "yearly")
    .reduce((sum, sub) => sum + sub.cost, 0);
  
  const totalYearlySpend = yearlyFromMonthly + yearlyTotal;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleAddSubscription = async (newSub: {
    name: string;
    cost: number;
    billingPeriod: "monthly" | "yearly";
    startDate: string;
    notes?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          name: newSub.name,
          cost: newSub.cost,
          billing_period: newSub.billingPeriod,
          start_date: newSub.startDate,
          notes: newSub.notes || null
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error adding subscription",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const formattedSubscription: Subscription = {
        id: data.id,
        name: data.name,
        cost: parseFloat(data.cost.toString()),
        billingPeriod: data.billing_period as "monthly" | "yearly",
        startDate: data.start_date,
        notes: data.notes || undefined
      };

      setSubscriptions([formattedSubscription, ...subscriptions]);
      toast({
        title: "Success",
        description: "Subscription added successfully",
      });
    } catch (error) {
      console.error('Error adding subscription:', error);
      toast({
        title: "Error",
        description: "Failed to add subscription",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting subscription",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscription",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-primary">SubTracker</h1>
              <nav className="flex gap-4">
                <Link to="/dashboard" className="text-primary font-medium">
                  Dashboard
                </Link>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </nav>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${monthlyTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Active recurring subscriptions
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yearly Projection</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">${totalYearlySpend.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total annual cost
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{subscriptions.length}</div>
              <p className="text-xs text-muted-foreground">
                Services being tracked
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscriptions List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Your Subscriptions</h2>
              <Button onClick={() => setShowAddModal(true)} variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                Add Subscription
              </Button>
            </div>
            
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onDelete={handleDeleteSubscription}
                />
              ))}
            </div>
          </div>

          {/* Sidebar with Charts and Insights */}
          <div className="space-y-6">
            <SpendingChart subscriptions={subscriptions} />
            <InsightsPanel subscriptions={subscriptions} totalYearlySpend={totalYearlySpend} />
          </div>
        </div>
      </div>

      <AddSubscriptionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSubscription}
      />
    </div>
  );
};

export default Dashboard;