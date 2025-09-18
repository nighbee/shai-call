import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "error";
}

export const KPICard = ({ 
  title, 
  value, 
  change, 
  changeLabel,
  icon,
  color = "primary"
}: KPICardProps) => {
  const colorClasses = {
    primary: "border-dashboard-primary/20 bg-gradient-card",
    success: "border-dashboard-success/20 bg-gradient-success",
    warning: "border-dashboard-warning/20",
    error: "border-dashboard-error/20"
  };

  return (
    <Card className={`${colorClasses[color]} shadow-card hover:shadow-elevated transition-smooth border-2`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={`p-2 rounded-lg ${
            color === "primary" ? "bg-dashboard-primary/10 text-dashboard-primary" :
            color === "success" ? "bg-dashboard-success/10 text-dashboard-success" :
            color === "warning" ? "bg-dashboard-warning/10 text-dashboard-warning" :
            "bg-dashboard-error/10 text-dashboard-error"
          }`}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change !== undefined && (
          <div className="flex items-center pt-1">
            {change > 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-dashboard-success" />
            ) : change < 0 ? (
              <ArrowDownIcon className="h-4 w-4 text-dashboard-error" />
            ) : null}
            <span className={`text-xs ml-1 ${
              change > 0 ? "text-dashboard-success" : 
              change < 0 ? "text-dashboard-error" : 
              "text-muted-foreground"
            }`}>
              {changeLabel || `${Math.abs(change)}%`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};