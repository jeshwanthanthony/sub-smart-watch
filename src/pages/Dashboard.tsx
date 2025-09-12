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

// Dummy data for subscriptions
const dummySubscriptions = [
  {
    id: "1",
    name: "Netflix",
    cost: 15.99,
    billingPeriod: "monthly" as const,
    startDate: "2024-01-15",
    notes: "Premium plan"
  },
  {
    id: "2", 
    name: "Spotify Premium",
    cost: 9.99,
    billingPeriod: "monthly" as const,
    startDate: "2023-12-01",
    notes: "Individual plan"
  },
  {
    id: "3",
    name: "Adobe Creative Suite",
    cost: 52.99,
    billingPeriod: "monthly" as const,
    startDate: "2024-02-01",
    notes: "All apps included"
  },
  {
    id: "4",
    name: "Microsoft 365",
    cost: 99.99,
    billingPeriod: "yearly" as const,
    startDate: "2024-03-01",
    notes: "Personal subscription"
  },
  {
    id: "5",
    name: "Gym Membership",
    cost: 29.99,
    billingPeriod: "monthly" as const,
    startDate: "2024-01-01",
    notes: "Local fitness center"
  }
];

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState(dummySubscriptions);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = "/login";
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        window.location.href = "/login";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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
  const handleAddSubscription = (newSub: any) => {
    const subscription = {
      ...newSub,
      id: Date.now().toString()
    };
    setSubscriptions([...subscriptions, subscription]);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

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