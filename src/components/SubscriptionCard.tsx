import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Trash2, Edit } from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingPeriod: "monthly" | "yearly";
  startDate: string;
  notes?: string;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete: (id: string) => void;
  onEdit?: (subscription: Subscription) => void;
}

const SubscriptionCard = ({ subscription, onDelete, onEdit }: SubscriptionCardProps) => {
  const { name, cost, billingPeriod, startDate, notes } = subscription;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getBadgeVariant = (period: string) => {
    return period === "monthly" ? "default" : "secondary";
  };

  return (
    <Card className="shadow-soft hover:shadow-elegant transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{name}</h3>
              <Badge variant={getBadgeVariant(billingPeriod)}>
                {billingPeriod}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-primary">${cost.toFixed(2)}</span>
                <span>/ {billingPeriod === "monthly" ? "month" : "year"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Started {formatDate(startDate)}</span>
              </div>
            </div>
            
            {notes && (
              <p className="text-sm text-muted-foreground">{notes}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(subscription)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(subscription.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;