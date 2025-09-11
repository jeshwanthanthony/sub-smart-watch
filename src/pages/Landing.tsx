import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CreditCard, PieChart, TrendingDown, Bell, Shield, BarChart3 } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Track Subscriptions",
      description: "Monitor all your recurring payments in one place"
    },
    {
      icon: PieChart,
      title: "Visual Analytics",
      description: "Beautiful charts showing your spending patterns"
    },
    {
      icon: TrendingDown,
      title: "AI Insights",
      description: "Smart suggestions to optimize your subscriptions"
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified about renewals and unused services"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected"
    },
    {
      icon: BarChart3,
      title: "Spending Reports",
      description: "Detailed reports on your monthly and yearly costs"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">SubTracker</div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold text-foreground">
          Take Control of Your
          <span className="bg-gradient-primary bg-clip-text text-transparent"> Subscriptions</span>
        </h1>
        <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
          Track, analyze, and optimize your recurring payments with AI-powered insights. 
          Stop wasting money on forgotten subscriptions.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" variant="hero" asChild>
            <Link to="/register">Start Free Today</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-soft hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6 text-center">
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="bg-card rounded-xl shadow-elegant p-8">
          <h2 className="text-3xl font-bold mb-8">Join Thousands of Smart Savers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary">$2.3M+</div>
              <div className="text-muted-foreground">Total Savings Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">15K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success">98%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-primary rounded-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Save Money?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start tracking your subscriptions today and discover how much you can save.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-primary mb-4 md:mb-0">SubTracker</div>
            <div className="flex gap-6">
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;