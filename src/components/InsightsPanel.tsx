import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Lightbulb, DollarSign } from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingPeriod: "monthly" | "yearly";
  startDate: string;
  notes?: string;
}

interface InsightsPanelProps {
  subscriptions: Subscription[];
  totalYearlySpend: number;
}

const InsightsPanel = ({ subscriptions, totalYearlySpend }: InsightsPanelProps) => {
  // Generate AI-powered insights
  const generateInsights = () => {
    const insights = [];
    
    // High spending warning
    if (totalYearlySpend > 1000) {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        title: "High Annual Spending",
        message: `You're spending $${totalYearlySpend.toFixed(2)} per year on subscriptions. Consider reviewing unused services.`,
        action: "Review Subscriptions"
      });
    }

    // Duplicate service detection
    const streamingServices = subscriptions.filter(sub => 
      sub.name.toLowerCase().includes('netflix') || 
      sub.name.toLowerCase().includes('hulu') || 
      sub.name.toLowerCase().includes('disney') ||
      sub.name.toLowerCase().includes('prime')
    );
    
    if (streamingServices.length > 2) {
      insights.push({
        type: "suggestion",
        icon: TrendingDown,
        title: "Multiple Streaming Services",
        message: `You have ${streamingServices.length} streaming services. You could save money by consolidating.`,
        action: "Compare Services"
      });
    }

    // Annual vs Monthly billing insight
    const monthlySubscriptions = subscriptions.filter(sub => sub.billingPeriod === "monthly");
    const potentialSavings = monthlySubscriptions.length * 2; // Assume $2 savings per service annually
    
    if (monthlySubscriptions.length > 2) {
      insights.push({
        type: "tip",
        icon: DollarSign,
        title: "Switch to Annual Billing",
        message: `Consider switching ${monthlySubscriptions.length} monthly subscriptions to annual billing to save ~$${potentialSavings}/year.`,
        action: "Calculate Savings"
      });
    }

    // General optimization tip
    const oldestSubscription = subscriptions.reduce((oldest, sub) => {
      return new Date(sub.startDate) < new Date(oldest.startDate) ? sub : oldest;
    }, subscriptions[0]);

    if (oldestSubscription) {
      const monthsActive = Math.floor(
        (new Date().getTime() - new Date(oldestSubscription.startDate).getTime()) / 
        (1000 * 60 * 60 * 24 * 30)
      );
      
      if (monthsActive > 12) {
        insights.push({
          type: "tip",
          icon: Lightbulb,
          title: "Long-term Subscription Review",
          message: `Your ${oldestSubscription.name} subscription has been active for ${monthsActive} months. Check if you're still getting value.`,
          action: "Review Usage"
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning": return "destructive";
      case "suggestion": return "secondary";
      case "tip": return "default";
      default: return "default";
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          AI Insights
        </CardTitle>
        <CardDescription>
          Smart suggestions to optimize your subscriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Great job! Your subscriptions look optimized.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-start gap-3">
                  <insight.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge variant={getInsightColor(insight.type)} className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.message}
                    </p>
                    <Button size="sm" variant="outline" className="text-xs">
                      {insight.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3 text-sm">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Avg. per service</div>
              <div className="font-medium">
                ${subscriptions.length > 0 ? (totalYearlySpend / subscriptions.length / 12).toFixed(2) : '0.00'}/mo
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Most expensive</div>
              <div className="font-medium">
                {subscriptions.length > 0 
                  ? subscriptions.reduce((max, sub) => 
                      (sub.billingPeriod === "monthly" ? sub.cost : sub.cost / 12) > 
                      (max.billingPeriod === "monthly" ? max.cost : max.cost / 12) ? sub : max
                    ).name 
                  : 'None'
                }
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;