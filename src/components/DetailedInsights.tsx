import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallData } from './Dashboard';
import { MessageSquare, FileText, ArrowRight, Lightbulb } from 'lucide-react';
import { parseDateTimeFromDotted } from '@/lib/utils';

interface DetailedInsightsProps {
  data: CallData[];
}

export const DetailedInsights = ({ data }: DetailedInsightsProps) => {
  if (data.length === 0) return null;

  const latestCall = data.sort((a, b) => {
    const dateA = parseDateTimeFromDotted(a.Date, a.Time);
    const dateB = parseDateTimeFromDotted(b.Date, b.Time);
    return dateB.getTime() - dateA.getTime();
  })[0];

  return (
    <Card className="bg-card shadow-lg border-border">
      <CardHeader className="bg-gradient-primary">
        <CardTitle className="flex items-center space-x-2 text-primary-foreground">
          <Lightbulb className="h-5 w-5" />
          <span>Detailed Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary-accent" />
              <h3 className="text-lg font-semibold text-card-foreground">Recommendations</h3>
            </div>
            <div className="bg-accent p-4 rounded-lg border border-border">
              <p className="text-sm text-card-foreground leading-relaxed">
                {latestCall.Recommendations || 'No recommendations available.'}
              </p>
            </div>
          </div>

          {/* Brief */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-chart-2" />
              <h3 className="text-lg font-semibold text-card-foreground">Brief</h3>
            </div>
            <div className="bg-accent p-4 rounded-lg border border-border">
              <p className="text-sm text-card-foreground leading-relaxed">
                {latestCall.Brief || 'No brief available.'}
              </p>
            </div>
          </div>

          {/* Next Best Action */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ArrowRight className="h-5 w-5 text-chart-3" />
              <h3 className="text-lg font-semibold text-card-foreground">Next Best Action</h3>
            </div>
            <div className="bg-gradient-warning p-4 rounded-lg border border-border">
              <p className="text-sm text-warning-foreground font-medium leading-relaxed">
                {latestCall['Next Best Action'] || 'No action items available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Call Summary */}
        <div className="bg-muted p-4 rounded-lg">
          {/* <p className="text-sm text-muted-foreground">
            Latest interaction on {parseDateTimeFromDotted(latestCall.Date).toLocaleDateString()} at {latestCall.Time}
          </p> */}
        </div>
      </CardContent>
    </Card>
  );
};