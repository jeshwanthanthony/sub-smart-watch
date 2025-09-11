import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Shield, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="text-2xl font-bold text-primary">SubTracker</div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">
              About <span className="bg-gradient-primary bg-clip-text text-transparent">SubTracker</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to help people take control of their subscription spending 
              and make smarter financial decisions.
            </p>
          </div>

          {/* Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-soft text-center">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Built with Care</h3>
                <p className="text-muted-foreground">
                  Every feature is designed with user experience and financial wellbeing in mind.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
                <p className="text-muted-foreground">
                  Your financial data is encrypted, secure, and never shared with third parties.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft text-center">
              <CardContent className="p-6">
                <Zap className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Smart Insights</h3>
                <p className="text-muted-foreground">
                  AI-powered analytics help you discover patterns and save money automatically.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="shadow-elegant mb-16">
            <CardContent className="p-12">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-6">
                  SubTracker was born from a simple realization: most people have no idea how much 
                  they're actually spending on subscriptions. What starts as a $10 streaming service 
                  here and a $5 app there quickly adds up to hundreds of dollars per month.
                </p>
                <p className="text-muted-foreground mb-6">
                  We believe that financial awareness shouldn't be complicated. That's why we built 
                  SubTracker to be simple, beautiful, and powerful. Our goal is to give you complete 
                  visibility into your recurring expenses so you can make informed decisions about 
                  your money.
                </p>
                <h3 className="text-2xl font-semibold mb-4">What Makes Us Different</h3>
                <ul className="text-muted-foreground space-y-3">
                  <li>🎯 <strong>Focused</strong> - We do one thing really well: subscription tracking</li>
                  <li>🤖 <strong>Intelligent</strong> - AI insights that actually help you save money</li>
                  <li>🔒 <strong>Secure</strong> - Bank-level encryption and privacy protection</li>
                  <li>📱 <strong>Beautiful</strong> - Clean, intuitive design that makes finance fun</li>
                  <li>⚡ <strong>Fast</strong> - Quick setup, instant insights, no complicated features</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Published By Section */}
          <Card className="shadow-elegant bg-gradient-primary text-white text-center">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">App Published by [Your Name]</h2>
              <p className="text-xl opacity-90 mb-6">
                Built with passion for helping people achieve financial clarity
              </p>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/dashboard">Back to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;