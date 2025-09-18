import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, UserIcon } from "lucide-react";

interface DashboardFiltersProps {
  selectedManager: string;
  selectedDateRange: string;
  managers: string[];
  onManagerChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
}

export const DashboardFilters = ({
  selectedManager,
  selectedDateRange,
  managers,
  onManagerChange,
  onDateRangeChange
}: DashboardFiltersProps) => {
  const dateRangeOptions = [
    { value: "today", label: "Today" },
    { value: "7days", label: "Last 7 days" },
    { value: "alltime", label: "All time" }
  ];

  return (
    <Card className="bg-gradient-card shadow-card border-2 border-dashboard-primary/20">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Manager
            </label>
            <Select value={selectedManager} onValueChange={onManagerChange}>
              <SelectTrigger className="bg-background/50 border-border">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All managers</SelectItem>
                {managers.map((manager) => (
                  <SelectItem key={manager} value={manager}>
                    {manager}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Date Range
            </label>
            <Select value={selectedDateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger className="bg-background/50 border-border">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};