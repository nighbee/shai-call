import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CallData {
  id: number;
  manager_name: string;
  quality_of_call: number;
  rating: number;
  script_match: number;
  errors: number;
  time_call: number;
  created_at: string;
}

interface CallsTableProps {
  calls: CallData[];
}

export const CallsTable = ({ calls }: CallsTableProps) => {
  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 8) return "bg-dashboard-success/20 text-dashboard-success border-dashboard-success/30";
    if (rating >= 4) return "bg-dashboard-warning/20 text-dashboard-warning border-dashboard-warning/30";
    return "bg-dashboard-error/20 text-dashboard-error border-dashboard-error/30";
  };

  const getQualityBadgeColor = (quality: number) => {
    if (quality >= 8) return "bg-dashboard-success/20 text-dashboard-success border-dashboard-success/30";
    if (quality >= 6) return "bg-dashboard-warning/20 text-dashboard-warning border-dashboard-warning/30";
    return "bg-dashboard-error/20 text-dashboard-error border-dashboard-error/30";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card className="bg-gradient-card shadow-card border-2 border-dashboard-primary/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Recent Calls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Manager</TableHead>
                <TableHead className="text-muted-foreground">Quality</TableHead>
                <TableHead className="text-muted-foreground">Rating</TableHead>
                <TableHead className="text-muted-foreground">Script Match</TableHead>
                <TableHead className="text-muted-foreground">Errors</TableHead>
                <TableHead className="text-muted-foreground">Duration</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id} className="border-border hover:bg-muted/50 transition-smooth">
                  <TableCell className="font-medium text-foreground">
                    {call.manager_name}
                  </TableCell>
                  <TableCell>
                    <Badge className={getQualityBadgeColor(call.quality_of_call)}>
                      {call.quality_of_call.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRatingBadgeColor(call.rating)}>
                      {call.rating}/10
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {call.script_match.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-foreground">
                    {call.errors}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDuration(call.time_call)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(call.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};