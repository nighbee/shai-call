import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, CheckCircle, Star, BarChart3 } from 'lucide-react';
import { CallData } from './Dashboard';

interface MetricsCardsProps {
  data: CallData[];
}

export const MetricsCards = ({ data }: MetricsCardsProps) => {
  const calculateAverage = (field: keyof CallData) => {
    const values = data
      .map((item) => Number(item[field]))
      .filter((v) => !Number.isNaN(v));
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, v) => acc + v, 0);
    return sum / values.length;
  };

  const formatPercentage = (value: number) => `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}`;
  const formatScore = (value: number) => value.toFixed(2);

  const metrics = [
    {
      title: 'Quality of Call',
      value: formatPercentage(calculateAverage('Quality of Call')),
      icon: TrendingUp,
      gradient: 'bg-gradient-primary',
      textColor: 'text-success-foreground'
    },
    {
      title: 'Script Match',
      value: formatPercentage(calculateAverage('Script Match')),
      icon: Target,
      gradient: 'bg-gradient-success',
      textColor: 'text-success-foreground'
    },
    {
      title: 'Errors Free',
      value: formatPercentage(calculateAverage('Errors Free')),
      icon: CheckCircle,
      gradient: 'bg-gradient-warning',
      textColor: 'text-warning-foreground'
    },
    {
      title: 'Overall Rating',
      value: formatScore(calculateAverage('Overall Rating')),
      icon: Star,
      gradient: 'bg-gradient-danger',
      textColor: 'text-success-foreground'
    },
    {
      title: 'KPI Score',
      value: formatScore(calculateAverage('KPI')),
      icon: BarChart3,
      gradient: 'bg-gradient-primary',
      textColor: 'text-success-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => {
        const IconComponent = metric.icon;
        return (
          <Card key={metric.title} className="bg-card shadow-card border-border overflow-hidden">
            <CardHeader className={`${metric.gradient} ${metric.textColor} pb-2`}>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                {metric.title}
                <IconComponent className="h-5 w-5 opacity-80" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-card-foreground">
                {metric.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {data.length} calls
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};