import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingPeriod: "monthly" | "yearly";
  startDate: string;
  notes?: string;
}

interface SpendingChartProps {
  subscriptions: Subscription[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))', 
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--accent-foreground))',
];

const SpendingChart = ({ subscriptions }: SpendingChartProps) => {
  // Convert all subscriptions to monthly cost for fair comparison
  const chartData = subscriptions.map((sub, index) => ({
    name: sub.name,
    value: sub.billingPeriod === "monthly" ? sub.cost : sub.cost / 12,
    color: COLORS[index % COLORS.length],
    originalCost: sub.cost,
    period: sub.billingPeriod
  }));

  const totalMonthly = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-3 rounded-lg shadow-elegant border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data.originalCost.toFixed(2)} / {data.period === "monthly" ? "month" : "year"}
          </p>
          <p className="text-sm text-muted-foreground">
            Monthly equivalent: ${data.value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (subscriptions.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Spending Breakdown</CardTitle>
          <CardDescription>Visual breakdown of your subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            No subscriptions to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg">Spending Breakdown</CardTitle>
        <CardDescription>Monthly cost distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">
                ${item.value.toFixed(2)}/mo
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between font-semibold">
            <span>Total Monthly</span>
            <span>${totalMonthly.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingChart;