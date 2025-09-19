import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, CheckCircle, Star, BarChart3 } from 'lucide-react';

interface MetricsCardsProps {
  metrics: {
    avgQuality: number;
    avgScript: number;
    avgErrors: number;
    avgRating: number;
    avgKPI: number;
  };
  callsCount: number;
}

export const MetricsCards = ({ metrics, callsCount }: MetricsCardsProps) => {
  const formatValue = (value: number) => value.toFixed(1);

  const getColorClass = (value: number) => {
    if (value < 4) return 'text-red-500';
    if (value >= 4 && value <= 7) return 'text-yellow-500';
    return 'text-green-500';
  };

  const cards = [
    { title: 'Quality of Call', value: metrics.avgQuality, icon: TrendingUp },
    { title: 'Script Match', value: metrics.avgScript, icon: Target },
    { title: 'Errors Free', value: metrics.avgErrors, icon: CheckCircle },
    { title: 'Overall Rating', value: metrics.avgRating, icon: Star },
    { title: 'KPI Score', value: metrics.avgKPI, icon: BarChart3 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <Card key={card.title} className="bg-card shadow-card border-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-medium text-card-foreground">
                {card.title}
                <IconComponent className="h-5 w-5 opacity-80" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className={`text-2xl font-bold ${getColorClass(card.value)}`}>
                {formatValue(card.value)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {callsCount} calls
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
