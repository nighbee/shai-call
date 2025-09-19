import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CallData } from './Dashboard';
import { Clock, Phone, User } from 'lucide-react';
import { parseDateTimeFromDotted } from '@/lib/utils';

interface CallHistoryTableProps {
  data: CallData[];
}

export const CallHistoryTable = ({ data }: CallHistoryTableProps) => {
  const sortedData = [...data].sort((a, b) => {
    const dateA = parseDateTimeFromDotted(a.Date, a.Time);
    const dateB = parseDateTimeFromDotted(b.Date, b.Time);
    return dateB.getTime() - dateA.getTime();
  });

  const getRatingBadge = (rating: number) => {
    if (rating >= 8) return 'bg-success text-success-foreground';
    if (rating >= 6) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  const getPercentageBadge = (percentage: number) => {
    if (percentage >= 80) return 'bg-success text-success-foreground';
    if (percentage >= 60) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  return (
    <Card className="bg-card shadow-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-card-foreground">
          <Clock className="h-5 w-5" />
          <span>Recent Calls</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Manager</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Client</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Quality</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Script Match</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Errors Free</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Rating</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((call, index) => (
                <tr key={index} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="p-3 text-sm text-card-foreground">
                    {parseDateTimeFromDotted(call.Date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm text-card-foreground">{call.Time}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-card-foreground">{call['Man name']}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-card-foreground">{call['Client Phone']}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-card-foreground">{call.Duration}</td>
                  <td className="p-3">
                    <Badge className={getPercentageBadge(call['Quality of Call'])}>
                      {call['Quality of Call']}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={getPercentageBadge(call['Script Match'])}>
                      {call['Script Match']}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={getPercentageBadge(call['Errors Free'])}>
                      {call['Errors Free']}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={getRatingBadge(call['Overall Rating'])}>
                      {call['Overall Rating']}/10
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No calls found for the selected filters.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};